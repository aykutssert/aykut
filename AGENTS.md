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

- **Deployment**: VPS via Docker single container. NOT Vercel. NOT serverless.
- **Database**: PocketBase (remote: https://db.kernelgallery.com).
- **Framework**: Next.js 16 App Router with `'use cache'`, `cacheTag`, `cacheLife`, `revalidateTag` (requires 2 arguments).
- **Blog rendering**: `renderMarkdownHtml` (remark/rehype). Prompts/docs: `renderDocHtml` (Shiki).

## Workflow Rules

- **Never push to git without explicit permission from the user.**
- Don't add new dependencies without asking first.
- Don't modify auth logic without asking first.
- Don't change the database schema without asking first.
