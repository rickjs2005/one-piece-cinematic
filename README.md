**English** · [Português](README.pt-BR.md)

# One Piece — A história que o mundo tentou apagar

A single-page cinematic piece about the story of One Piece ("The story the
world tried to erase"). A scroll-driven scene opens the site, and from there
the page tells the journey in five chapters — Execution, Crew, Route, Wars,
Dawn — closing with a showcase of memorable quotes. The site content is in
Brazilian Portuguese.

> **Type:** fan-made — a non-commercial fan project, not affiliated with or
> endorsed by Eiichiro Oda, Shueisha, Toei Animation or any One Piece rights
> holder. No official logo files are used: the title is set in a regular
> typeface (Anton). No public demo is confirmed.

![Opening scene: the throne and the ONE PIECE title](docs/screenshots/hero.webp)

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4**
- **GSAP 3** + ScrollTrigger for all animation
- **Lenis** to smooth the scroll that feeds ScrollTrigger
- ESLint 9 (`eslint-config-next`)

Static site — no backend, database or API.

## Running

Prerequisites: Node.js 20.9+ (CI uses Node 22) and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. There are no environment variables.

To check real performance, use the production build: in development the image
optimizer processes the artwork on demand and competes with the browser for
CPU.

```bash
npm run build && npm run start
```

## Structure

```
src/app/                    home, /laugh-tale (the reward of the HOLD button), color and type tokens
src/components/hero/        ThroneHero — the opening scene — and its layers (ShotLayer)
src/components/chapter.tsx  ChapterSection — the pinned horizontal strip of each chapter
src/components/chapter-extras.tsx  CrewPanel and MapPanel, the extra panels of two chapters
src/components/intro.tsx    the opening manifesto
src/components/falas.tsx    the editorial quotes showcase
src/components/site-shell.tsx, loader.tsx, nav.tsx, site-footer.tsx  site shell
src/content/                the 5 chapters, the crew, the route and the quotes
src/lib/                    hero timeline, Lenis + ScrollTrigger, reveals, text splitting
scripts/                    artwork downscaling (downscale-art) and local capture/recording (shoot, record)
public/art/                 manifesto and quotes illustrations
public/shot/                photos per chapter (execucao, tripulacao, rota, guerras, amanhecer, cutout)
public/video/               the 2 hero shots
public/laugh-tale/          the secret page wallpaper
docs/superpowers/specs/     the design documents the project started from (Portuguese)
docs/screenshots/           image used in this README
```

Each chapter is an entry in `CHAPTERS` (`src/content/chapters.ts`), rendered by
the same `ChapterSection` in `src/app/page.tsx`. Changing a quote, an island on
the route or a crew member only touches `src/content/`, not components.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | production build (includes type checking) |
| `npm run start` | serves the production build |
| `npm run lint` | ESLint |
| `node scripts/downscale-art.mjs` | downsizes the artwork in `public/art/` (uses `sharp`, installed as a Next.js dependency) |
| `node scripts/shoot.mjs [url] [outDir]` | screenshots with headless Chromium (`puppeteer-core`) |
| `node scripts/record.mjs <realSec> <targetSec> <outDir> [url]` | records the journey as video (requires `ffmpeg`) |

The capture scripts default to Edge at its standard Windows path; on other
systems, point `BROWSER_PATH` to an installed Chromium.

## Design decisions worth knowing

**Pinned sections use `position: sticky`, not ScrollTrigger's `pin`.** Sticky
creates no pin-spacer, does not shift the rest of the page and needs no
re-measuring after images load.

**Lenis only emits events for the scroll it drives itself.** A programmatic
scroll — anchor, Home key, scroll restoration on reload — would leave
ScrollTrigger with a stale position, so `src/lib/scroll.ts` holds the single
instance (`getLenis`/`setLenis`) and exposes `scrollToId`, which falls back to
native `scrollIntoView` when Lenis has not mounted yet.

**Artwork is downsized to the size it is displayed at**
(`scripts/downscale-art.mjs`). At 2K the page froze Chrome's renderer. If new
artwork is added, run the script before committing.

**No full-screen `feTurbulence`.** An SVG film-grain layer under
`mix-blend-mode` froze the browser completely — noted in `globals.css` so it
does not come back.

**`prefers-reduced-motion` is respected in every animated section**: the hero
shows the final frame without scrub, videos are replaced by still images, and
the horizontal galleries become regular scrolling lists.

## Limitations

- Single page in Portuguese, no automated tests.
- Heavy media in the repository: 7 videos (`public/shot/*/full.mp4`,
  `public/video/eyes.mp4`, `public/video/throne.mp4`, ~2.6 to ~8.3 MB each).
- `metadataBase` in `src/app/layout.tsx` is a placeholder, not a published
  address.

## Credits and third-party rights

One Piece and its names, characters and elements belong to Eiichiro Oda /
Shueisha / Toei Animation. This is a fan work, non-commercial, with no
affiliation with or endorsement by the rights holders.

- **Illustrations and photos** (`public/art/`, `public/shot/`,
  `public/laugh-tale/`): AI-generated, inspired by the work, according to the
  author (`downscale-art.mjs` names Higgsfield as the source of the artwork).
  Some depict characters and symbols of the series, such as the Straw Hat
  pirates' flag (`public/art/flag.webp`).
- **Videos** (7 `.mp4` files): origin not documented. The design document
  planned to generate them with AI (image-to-video), but there is no record
  confirming their origin or usage license.

If you are a rights holder and want any content removed, please open an issue.

## Security

See [SECURITY.md](SECURITY.md).

## License

No license has been chosen yet; all rights reserved by the author. This
applies only to the author's code and original material — the rights to One
Piece belong to their respective owners.
