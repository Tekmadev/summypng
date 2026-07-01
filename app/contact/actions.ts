"use server";

import { contact, getServiceBySlug, identity, services } from "@/config/business";
import { createPublicServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ContactQueryInsert } from "@/types";

/**
 * Contact / booking inquiry server action.
 *
 * Validates the multi-step form, stores the inquiry in Supabase
 * `contact_queries` (anon key, gated by the public-insert RLS policy), and sends
 * the studio an email notification via Resend. The database write is the source
 * of truth: if email delivery fails or is not configured, the submission still
 * succeeds and the failure is logged, never surfaced to the visitor.
 *
 * @module app/contact/actions
 */

/** Result returned to the form via `useActionState`. */
export interface ContactState {
  readonly status: "idle" | "success" | "error";
  /** Visitor-facing message for the error state. */
  readonly message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_CATEGORIES = new Set<string>(services.map((service) => service.key));

/** ISO calendar date, as produced by `<input type="date">`. */
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Read a trimmed string field, or "" when absent. */
function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Cap to a max length and collapse empties to undefined. This is a public POST
 * endpoint, so every text field is bounded to keep an attacker from persisting
 * an unbounded payload; legitimate input is well within these limits.
 */
function capped(value: string, max: number): string | undefined {
  const v = value.slice(0, max);
  return v.length > 0 ? v : undefined;
}

/** Accept a preferred date only if it is a real ISO calendar date. */
function safeDate(value: string): string | undefined {
  return DATE_RE.test(value) && !Number.isNaN(Date.parse(value)) ? value : undefined;
}

export async function submitInquiry(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = field(formData, "name");
  const email = field(formData, "email");
  const phone = field(formData, "phone");
  const category = field(formData, "category");
  const description = field(formData, "description");
  const preferredDate = field(formData, "preferredDate");

  // Server-side validation mirrors the client gate.
  if (name.length === 0) return { status: "error", message: "Your name is required." };
  if (!EMAIL_RE.test(email))
    return { status: "error", message: "A valid email is required so Summy can reply." };
  if (!VALID_CATEGORIES.has(category))
    return { status: "error", message: "Please choose a valid category." };
  if (description.length === 0)
    return { status: "error", message: "Please tell us a little about the project." };

  if (!isSupabaseConfigured()) {
    console.error("[contact] Supabase env missing; inquiry not stored.");
    return {
      status: "error",
      message: "We could not submit your inquiry just now. Please email " + contact.email + ".",
    };
  }

  const service = getServiceBySlug(category);

  try {
    const supabase = createPublicServerClient();

    // Resolve the category UUID when the categories table is seeded; tolerate
    // its absence (store the human label regardless).
    let categoryId: string | undefined;
    const { data: categoryRow } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .maybeSingle();
    if (categoryRow && typeof categoryRow.id === "string") categoryId = categoryRow.id;

    const payload: ContactQueryInsert = {
      name: name.slice(0, 200),
      email: email.slice(0, 320),
      phone: capped(phone, 50),
      category_id: categoryId,
      category_label: service?.label,
      description: capped(description, 5000),
      preferred_date: safeDate(preferredDate),
      utm_source: capped(field(formData, "utm_source"), 200),
      utm_medium: capped(field(formData, "utm_medium"), 200),
      utm_campaign: capped(field(formData, "utm_campaign"), 200),
      referrer: capped(field(formData, "referrer"), 500),
      landing_page: capped(field(formData, "landing_page"), 500),
      user_agent: capped(field(formData, "user_agent"), 500),
    };

    const { error } = await supabase.from("contact_queries").insert(payload);
    if (error) {
      console.error("[contact] insert failed:", error.message);
      return {
        status: "error",
        message: "We could not submit your inquiry just now. Please email " + contact.email + ".",
      };
    }

    await sendNotification({
      name,
      email,
      phone,
      categoryLabel: service?.label ?? category,
      description,
      preferredDate,
    });

    return { status: "success" };
  } catch (cause) {
    console.error("[contact] unexpected error:", cause);
    return {
      status: "error",
      message: "Something went wrong. Please email " + contact.email + " and we will reply.",
    };
  }
}

/** Email the studio about a new inquiry. Best-effort: never throws to the caller. */
async function sendNotification(input: {
  name: string;
  email: string;
  phone: string;
  categoryLabel: string;
  description: string;
  preferredDate: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_NOTIFICATION_EMAIL ?? contact.email;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set; skipping email notification.");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_FROM ?? `${identity.businessName} <onboarding@resend.dev>`;

    const lines = [
      `New inquiry via ${identity.name}.`,
      "",
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone || "(not provided)"}`,
      `Category: ${input.categoryLabel}`,
      `Preferred date: ${input.preferredDate || "(none)"}`,
      "",
      "Project:",
      input.description,
    ];

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: input.email,
      subject: `New inquiry: ${input.categoryLabel} from ${input.name}`,
      text: lines.join("\n"),
    });
    if (error) console.error("[contact] email send failed:", error);
  } catch (cause) {
    console.error("[contact] email send threw:", cause);
  }
}
