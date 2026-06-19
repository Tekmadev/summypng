import { buildLlmsTxt } from "@/lib/seo";

/** Statically generated at build time from the business config. */
export const dynamic = "force-static";

/**
 * Serve `/llms.txt` — a compact, citable summary of the business for LLMs and
 * answer engines. Built entirely from {@link config/business}.
 */
export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
