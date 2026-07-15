<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

If you think something is important, keep it in MEMORY.md.

---

## Content Rules

- **Never use the em dash character "—"** anywhere: not in blog posts, UI text, code comments, or any generated content. Use " - " (space-hyphen-space) instead.
- Never use AI-generated emojis as bullet points. Use plain text markers (·, -, *).

## UI / Styling Rules

- This site supports **both dark mode and light mode**. The `.dark` class is applied to the `<html>` element when dark mode is active. It does NOT use `prefers-color-scheme`.
- **Never hardcode colors** in blog post `<style>` blocks or components. Always provide both light and dark variants using the `.dark` selector.
- Use Tailwind semantic tokens in components: `text-foreground`, `bg-background`, `border-border`, `text-muted-foreground`, etc.
- For custom HTML inside markdown blog posts, write a `<style>` block with explicit `.dark` class overrides for every color rule.

## Architecture

- **Personal site** (blog + CV) of Aykut Sert. Fully static: `output: 'export'`, no database, no API routes, no auth, no admin panel.
- **Deployment**: Cloudflare static hosting, domain kernelgallery.com. `npm run build` outputs to `out/`. NOT Vercel. NOT a VPS.
- **Blog content**: markdown files in `content/blog/<slug>.md` with frontmatter (title, description, date, image, tags). Images in `public/blog/`. Publishing = add file + git push.
- **Blog rendering**: `renderMarkdownHtml` in `lib/render-markdown.ts` (remark/rehype + rehype-pretty-code). Data layer: `lib/blog.ts` (fs-based, runs at build time).
- **i18n**: EN/TR via next-intl, fully client-side (`LocaleProvider` reads a cookie in the browser). UI strings in `messages/en.json` + `messages/tr.json`. Blog content is single-language.
- **Roaming pet**: sprite atlas at `public/pets/spritesheet.webp` (8 cols x 9 rows, 192x208 cells), driven by `components/pets/RoamingPetClient.tsx`.

## Workflow Rules

- **Never push to git without explicit permission from the user.**
- Don't add new dependencies without asking first.
- Static export constraints apply: no `cookies()`/`headers()` in server components, no API routes, no middleware/proxy, `next/image` runs unoptimized.
