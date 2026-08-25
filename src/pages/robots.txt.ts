import type { APIRoute } from "astro";

// Grounded AI-crawler posture (register seo.ai_crawlers): the blanket rule
// already admits every token, so the named entries are a DECLARATION of the
// allow-and-be-cited policy. OAI-SearchBot governs ChatGPT search visibility;
// Claude-SearchBot is Anthropic's search crawler; Google-Extended is a product
// token (Gemini training/grounding only — no Search impact).
export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL("https://example.invalid")).origin;
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
  const body = [
    "User-agent: *", "Allow: /", "",
    "User-agent: GPTBot", "Allow: /", "",
    "User-agent: OAI-SearchBot", "Allow: /", "",
    "User-agent: ClaudeBot", "Allow: /", "",
    "User-agent: Claude-SearchBot", "Allow: /", "",
    "User-agent: Google-Extended", "Allow: /", "",
    "User-agent: PerplexityBot", "Allow: /", "",
    `Sitemap: ${origin}${base}/sitemap-index.xml`, "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
