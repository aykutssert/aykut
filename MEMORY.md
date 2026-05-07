# Project Memory

## Stack
- **Next.js 16.2.4** + **React 19.2.4** — not standard Next.js 15; APIs may differ, always check `node_modules/next/dist/docs/`
- **Supabase** — auth, database, storage (`*.supabase.co`)
- **OpenAI** — image generation via `lib/openai/product-image-generation.ts`
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css`, NOT `tailwind.config.js`
- **TypeScript strict** — all types live in `types/index.ts`

## Product Studio — Image Generation Flow
1. **Prepare** (`/api/product-results/prepare`) — creates a `pending` DB row, deducts unit cost
2. **Worker** (`/api/product-results/worker`) — polls for pending jobs, calls OpenAI, uploads result to Supabase Storage
3. **Generate** (`/api/product-results/generate`) — kicks off the worker after prepare

Unit costs live in `lib/product-image-sizes.ts`:
- 1:1 → low: 1 / medium: 7 / high: 20
- 4:5 / 16:9 → low: 1 / medium: 8 / high: 25

Free plan = 20 units/month (~2 medium photos).

## Key lib files
| File | Purpose |
|---|---|
| `lib/product-image-sizes.ts` | Size map, quality options, unit cost table |
| `lib/product-usage.ts` | Monthly usage snapshot + recording events |
| `lib/product-worker.ts` | Claims next pending job, runs generation |
| `lib/product-worker-auth.ts` | Auth for worker route |
| `lib/product-results.ts` | DB queries for results |
| `lib/product-products.ts` | DB queries for user products |
| `lib/product-templates.ts` | DB queries for templates |
| `lib/supabase/server.ts` | Server Supabase client (uses cookies) |
| `lib/supabase/client.ts` | Browser Supabase client |

## Supabase Storage
Images are served from `*.supabase.co/storage/v1/object/public/**`. Whitelisted in `next.config.ts` under `images.remotePatterns`.

## Design System
- CSS custom properties for theming — all in `globals.css` under `:root` / `.dark`
- Selection color: `#F4C9B7` (light) / `#53361E` (dark)
- Gradient animation: `.animate-gradient` — `background-size: 400%`, `animation: gradient-shift 28s linear infinite`
- Gradient text loses color on selection — fix with `::selection { color: hsl(var(--foreground)) }` on the element
- Dark mode via `.dark` class on `<html>` — `@custom-variant dark (&:where(.dark, .dark *))`
- Product Studio accent: orange (`orange-200/60`, `orange-950/20`, etc.)

## localStorage Keys
| Key | Purpose |
|---|---|
| `product-studio-onboarding-v1` | Onboarding banner dismissed flag |
| `roaming-pet-enabled` | Roaming pet toggle state |

## Routing
- `/product-studio/templates` — template gallery (entry point)
- `/product-studio/products` — user's uploaded products
- `/product-studio/create` — generation form (query: `?product=<id>&template=<id>`)
- `/product-studio/results` — all generated results
- `/account/likes` — liked prompts & pets (query: `?type=prompts|pets`)
- `/pricing` — pricing page
- `/prompts` — prompt library
- `/pets` — Codex pets
- `/docs` — documentation

## Shared Components worth knowing
- `components/ui/ImageWithSkeleton.tsx` — image with animate-pulse shimmer; `fixedContainer` prop for fixed-size containers
- `components/product-templates/ProductSubnav.tsx` — subnav shared across all product-studio pages; also renders `ProductOnboardingBanner`
- `components/product-templates/ProductOnboardingBanner.tsx` — one-time onboarding (localStorage-gated)
- `components/product-templates/UpgradeDialog.tsx` — upgrade plan dialog
