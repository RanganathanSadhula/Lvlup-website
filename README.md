# LvlUp website

Next.js (App Router) · TypeScript (strict) · Tailwind CSS 3 · React Hook Form + Zod · Lucide.
A one-page marketing site rebuilt from `LvlUp website · Desktop 1440.pdf` and the supplied section images.

## Prerequisites
Node.js 20+ and npm 10+.

## Run
```bash
npm install
cp .env.example .env.local   # optional: fill in contact details / integrations
npm run dev                  # http://localhost:3000
```

## Scripts
| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run lint` | ESLint (next/core-web-vitals + next/typescript) |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run test` | Vitest (form validation) |
| `npm run build` | Production build |
| `npm run verify` | lint → typecheck → test → build |

## Testing checklist (manual, after `npm run verify`)
Check at 1440, 1280, 1024, 768, 390 and 360px: no horizontal scroll; mobile menu opens/closes (Esc too); header anchors scroll to sections; FAQ opens/closes by mouse and keyboard (Tab, Enter/Space) and the parents/schools tabs switch (←/→); school-pack form shows field errors, then the "not connected" error (no webhook) or success (webhook set); compare against the PDF.

## Structure
```
src/app            layout, page, error/loading/not-found, /api/school-pack, /legal/[slug] placeholders
src/components     layout/ (Header, Footer, MobileNavigation) · sections/ (one per page section) · ui/ (primitives)
src/data           typed content: site, curriculum, faq, tutors, content
src/lib            utils, zod validations
design-reference/  the 15 original section screenshots (design source of truth; not served)
public/images      photos cropped from those screenshots + SVG backgrounds
```

## Asset mapping
The ZIP's PNGs are **full-section design screenshots** (1440px wide), not standalone illustrations, so they were used as references and the UI was rebuilt in code. Only photographs/avatars were cropped out (script logic: simple pixel crops) into `public/images`:

| Source screenshot | Used for |
|---|---|
| Hero.png | `hero-student.jpg` (hero photo; the example-project card is rebuilt in code and covers the baked-in card) |
| Solution.png | `solution-understand/safely/build.jpg` |
| Levels (curriculum).png | `curriculum/level-1…8.jpg` |
| Outcomes.png | `outcomes-confidence.jpg` |
| Audience fit.png | `audience-fit.jpg` |
| Proof (no testimonials yet).png | `proof-class.jpg` (a baked-in "3:12" badge is covered by the coded badge), `tutors/*.jpg` avatars |
| Fact strip, Problem, Safety, Process, Pricing, FAQ, For schools, Final CTA, Footer | Layout/content reference only (no photos) |

Crops are limited by the screenshot resolution (1×); swap in originals at the same filenames for sharper results. Topographic and chevron backgrounds are approximated SVGs (`topo-*.svg`, `chevrons.svg`).

## Configuration & integrations (`.env.example`)
- **Contact details** (WhatsApp, email, city) are placeholders (`[number]`, `[email]`, `[City]`, as in the design) until set.
- **Enrol / Book-a-call URLs**: no enrolment system was provided. Enrol buttons go to `NEXT_PUBLIC_ENROL_URL`, else scroll to "How joining works"; Book-a-call goes to `NEXT_PUBLIC_BOOKING_URL`, else the school-pack form.
- **School-pack form** → `POST /api/school-pack` validates with Zod, then forwards JSON to `SCHOOL_PACK_WEBHOOK_URL` (server-side; optional bearer secret). With no webhook it returns 503 and the UI states the request was *not* delivered. It never fakes success. Add rate limiting/CAPTCHA before heavy public use.
- **"Watch a real class"** is a non-interactive preview until `NEXT_PUBLIC_CLASS_VIDEO_URL` is set.
- **Legal/PDF links** (privacy, child safety, refunds, terms, partner terms, curriculum) point at `/legal/*` placeholder pages; replace with real documents.

## Assumptions
1. **Language selector**: only English exists, so "हिंदी" is shown disabled ("coming soon"), not a fake toggle.
2. **FAQ**: the design shows one answer (coding). The other parent answers and the 4 "For schools" Q&As are drafted only from facts elsewhere in the design; please review for accuracy. `[7] working days` and `[Month] 2027` are kept as the design's placeholders.
3. **Testimonials/metrics** are marked "Sample" as in the design.
4. **Fonts**: Inter Tight (display), Inter, JetBrains Mono via `next/font/google` (closest match to the design; the original fonts weren't specified). Requires network at build time.
5. **Curriculum navigator** highlights the card in view (starts at Level 1) rather than being fixed on Level 6 as in the static design; Level 6 keeps its dark "featured" card. The navigator is desktop-only; mobile shows stacked cards.
6. PDF text extraction lost some punctuation (e.g. "Grades 7–8", "Hindi"); restored by hand.

## Deployment
Any Node host or Vercel: set the env vars, run `npm run build` then `npm start` (or import the repo into Vercel). Set `NEXT_PUBLIC_SITE_URL` to the production origin.
