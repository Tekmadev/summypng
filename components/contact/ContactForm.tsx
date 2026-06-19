"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { brand, services } from "@/config/business";
import type { PhotoCategory } from "@/types";

/** Ordered step metadata for the progress indicator. */
const STEPS = [
  { key: "subject", label: "Subject" },
  { key: "project", label: "Project" },
  { key: "details", label: "Details" },
] as const;

/** Shape of the in-progress inquiry. Mirrors the public fields of ContactQuery. */
interface FormData {
  category: PhotoCategory | "";
  description: string;
  preferredDate: string;
  name: string;
  email: string;
  phone: string;
}

const EMPTY: FormData = {
  category: "",
  description: "",
  preferredDate: "",
  name: "",
  email: "",
  phone: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Premium multi-step booking form.
 *
 * Three steps (category, project, contact) with animated directional
 * transitions and a confident success state. Fully client-side for now: the
 * Supabase `contact_queries` insert and silent UTM attribution wire in during
 * Phase 2. The captured UTM source is already collected on mount.
 *
 * @module components/contact/ContactForm
 */
export function ContactForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const reduce = useReducedMotion();
  const headingRef = useRef<HTMLParagraphElement>(null);
  const utmSource = useRef<string | null>(null);

  // Capture UTM source for attribution (submitted with the inquiry in Phase 2).
  useEffect(() => {
    utmSource.current = new URLSearchParams(window.location.search).get("utm_source");
  }, []);

  // Move focus to the step label whenever the step changes (skip first paint).
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setError(null);
  };

  const validateStep = (): string | null => {
    if (step === 0 && !data.category) return "Pick a category to continue.";
    if (step === 1 && data.description.trim().length === 0)
      return "Tell us a little about the project.";
    if (step === 2) {
      if (data.name.trim().length === 0) return "Your name, please.";
      if (!EMAIL_RE.test(data.email)) return "A valid email so Summy can reply.";
    }
    return null;
  };

  const goNext = () => {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    setDirection(1);
    setStep((value) => Math.min(value + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setError(null);
    setDirection(-1);
    setStep((value) => Math.max(value - 1, 0));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (step < STEPS.length - 1) {
      goNext();
      return;
    }
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    // TODO(Phase 2): insert into Supabase `contact_queries` with utmSource.current.
    setSubmitted(true);
  };

  const offset = reduce ? 0 : 40;
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? offset : -offset, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -offset : offset, opacity: 0 }),
  };

  if (submitted) {
    return (
      <div className="max-w-xl" role="status" aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Inquiry received
        </p>
        <p className="mt-6 font-display text-3xl leading-snug tracking-tight sm:text-4xl">
          {brand.confirmationMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl" noValidate>
      {/* Progress */}
      <div className="flex items-center gap-4">
        <p
          ref={headingRef}
          tabIndex={-1}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted outline-none"
        >
          {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
          <span className="ml-3 text-foreground">{STEPS[step]!.label}</span>
        </p>
        <div className="h-px flex-1 bg-border">
          <div
            className="h-px bg-accent transition-[width] duration-500 ease-cinematic"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative mt-10 min-h-[18rem]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 ? (
              <fieldset>
                <legend className="text-lg text-foreground/85">
                  What are you shooting?
                </legend>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {services.map((service) => {
                    const active = data.category === service.key;
                    return (
                      <label
                        key={service.key}
                        className={`cursor-pointer border p-5 transition-colors duration-300 ease-cinematic ${
                          active
                            ? "border-accent bg-surface"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={service.key}
                          checked={active}
                          onChange={() => update("category", service.key)}
                          className="sr-only"
                        />
                        <span className="font-display text-xl tracking-tight">
                          {service.label}
                        </span>
                        <span className="mt-1 block text-sm text-muted">
                          {service.tagline}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <label htmlFor="description" className="text-lg text-foreground/85">
                    Tell us about the project
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    value={data.description}
                    onChange={(event) => update("description", event.target.value)}
                    placeholder="The space, the people, the feeling you're after."
                    className="mt-3 w-full resize-none border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus-visible:border-accent"
                  />
                </div>
                <div>
                  <label htmlFor="preferredDate" className="text-lg text-foreground/85">
                    Preferred date <span className="text-muted">(optional)</span>
                  </label>
                  <input
                    id="preferredDate"
                    type="date"
                    value={data.preferredDate}
                    onChange={(event) => update("preferredDate", event.target.value)}
                    className="mt-3 w-full border border-border bg-surface px-4 py-3 text-foreground focus-visible:border-accent [color-scheme:dark]"
                  />
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="text-lg text-foreground/85">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={data.name}
                    onChange={(event) => update("name", event.target.value)}
                    className="mt-3 w-full border border-border bg-surface px-4 py-3 text-foreground focus-visible:border-accent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-lg text-foreground/85">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(event) => update("email", event.target.value)}
                    className="mt-3 w-full border border-border bg-surface px-4 py-3 text-foreground focus-visible:border-accent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-lg text-foreground/85">
                    Phone <span className="text-muted">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={data.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    className="mt-3 w-full border border-border bg-surface px-4 py-3 text-foreground focus-visible:border-accent"
                  />
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="text-xs font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-0"
        >
          Back
        </button>

        <button
          type="submit"
          className="border border-foreground/20 px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ease-cinematic hover:bg-foreground hover:text-background"
        >
          {step < STEPS.length - 1 ? "Continue" : "Send inquiry"}
        </button>
      </div>
    </form>
  );
}
