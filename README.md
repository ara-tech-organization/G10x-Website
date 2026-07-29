# G10X — Defy Limits

Marketing site for **G10X Private Limited**, a digital marketing company in
Thanjavur, Tamil Nadu.

The design language is cinematic and automotive-adjacent — a lit corridor, road
paint, telemetry dials, pit-board stages — because the brand's own mark is an
arrow: forward movement, direction, acceleration. The content is a marketing
agency's, so nothing here depicts a literal vehicle.

**Scope of this build: the home page.** Header and footer use the supplied
lockups and are shared, so the remaining routes drop straight in.

---

## Run it

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # production bundle into dist/
npm run preview        # serve the built bundle
npm run lint           # eslint, zero warnings expected
npm run optimize:logos # regenerate logo variants from the source PNGs
```

---

## Stack

| Concern        | Choice                                                      |
| -------------- | ----------------------------------------------------------- |
| Framework      | React 19 + Vite 8                                           |
| Styling        | Tailwind CSS v4 (`@theme` tokens, no config file)           |
| Animation      | Framer Motion 12                                            |
| 3D             | three.js + React Three Fiber 9 + Drei                       |
| Smooth scroll  | Lenis                                                       |
| Routing        | React Router 7                                              |
| Icons          | Lucide                                                      |
| Counters       | react-countup                                               |
| Typeface       | Open Sauce Sans, self-hosted from `src/assets/fonts/`        |

GSAP was installed and then removed — Framer Motion covers every case here, and
shipping a second animation runtime for nothing costs ~70 kB gzipped.

---

## Layout of the source

```
src/
  content/
    site.js          all home-page copy — the single source of truth
    schema.js        JSON-LD: Organization, LocalBusiness, WebSite, FAQPage, Breadcrumb
  lib/
    cn.js            clsx + tailwind-merge
    motion.js        shared easings, springs, variants
  hooks/
    useLenis.js      smooth scroll + scrollToTarget()
    usePointer.js    pointer parallax as motion values, fine-pointer detection
    useMagnetic.js   magnetic hover
    useMediaQuery.js breakpoint + reduced-motion subscriptions
  components/
    ui/              Button, Logo, Reveal, Marquee, SectionShell, ArrowGlyph,
                     CursorGlow, ScrollProgress
    layout/          Header, Footer, Preloader, SeoHead, PageTransition
    three/           HeroScene (lazy), TunnelParts, geometry
    sections/        one file per section, each with its own layout
  pages/
    Home.jsx         section order
```

### Content

Every string on the page comes from the client's *"G10X - Website Content"*
document, home section. Wording is only lightly tightened for screen
readability; claims, numbers and names are unchanged.

Two blocks are flagged `placeholder: true` in `site.js` because the source
document marks them as samples — **What We're Working On** and **What Our
Clients Are Saying**. Both render a visible note saying so. Swap the arrays and
drop the flag when real work and verified reviews are available.

The document also states *"no fabricated numbers"*, which is why the statistics
section quotes only figures the document itself contains (the 60–90 day SEO
window) or counts of things listed elsewhere on the page (6 channels, 10
industries, 0 lock-in contracts).

### Sections

Order is a narrative arc, not the document's writing order:

`Hero → About → Services → Why Us → Industries → Process → Telemetry →
Toolstack → Promises → Work → Testimonials → Pricing → FAQ → Contact`

No two sections share a layout. Highlights:

- **Hero** — live 3D corridor; scroll velocity accelerates the environment and
  the type recedes into it.
- **About** — the story runs down a lit highway, the mark travelling it as you
  scroll, milestones lighting up as they are passed.
- **Services** — two-pane command console on desktop, expanding rows below `lg`.
- **Process** — pins and travels horizontally through seven stages over road
  paint; stacks vertically on narrow screens.
- **Why Us** — six chamfered spec tiles on a machinist grid, cut with
  `clip-path` (see the `g-chamfer` utility) so the 1px edge can light up along
  the diagonal. Uniform heights: an earlier asymmetric bento read as broken
  alignment rather than as composition.
- **Telemetry** — sweeping gauge dials with tick marks. A value range steps down
  a type size so it cannot burst out of its dial, and the unit sits inside the
  dial so all four cards share one label baseline.
- **Promises** — six commitments hung off a bezier spine that draws on scroll.
- **Testimonials** — a channel strip: the tuned-in quote opens to full width
  while the others compress to vertical spines. Stacks and fully opens below
  `lg`, where a horizontal accordion would be unusable.
- **Work** — an editorial index with no panels, cards or rules at all: the
  three projects are held apart by scale, whitespace and an indent that steps
  right on each entry, so the set climbs the page as a diagonal. Deliberately
  the quietest structure on the page, since it sits between the gauge dials and
  the testimonial channel strip.
- **Contact** — channels over a radar sweep, plus the enquiry form.

---

## Notes for whoever picks this up

**The enquiry form has no backend.** It validates natively and then opens a
prefilled `mailto:` draft. Replace the body of `handleSubmit` in
`sections/Contact.jsx` with a real endpoint call; nothing else changes.

**The two logo files are not interchangeable.** `Header.png` has a navy "10X"
built for light surfaces; `Footer.png` has a white "10X" for dark ones. This
site is `#050814` throughout, so the light-on-dark lockup (`Footer.png`) is the
default in both the header and the footer — the navy one is illegible here. Pass
`variant="dark"` to `<Logo />` if a light panel is ever introduced.

**Logos are served from `src/assets/optimized/`.** The supplied PNGs are
6160×2533 (1.4 MB together) and never render above ~240 px. `npm run
optimize:logos` regenerates 320/640 px WebP + PNG variants (78 kB total). Re-run
it if the source artwork changes; do not import the raw PNGs.

**The pre-paint style in `index.html` must stay off `body`.** That `<style>`
block is unlayered, and unlayered rules beat everything in `@layer base`
regardless of specificity. Declaring `body { background }` there overrode the
themed `bg-void` permanently — the page stayed dark while every child's text
flipped to its light values, which read as the whole light theme being broken.
Only `<html>` is pre-painted, keyed off `data-theme`.

**`Header.png` has no alpha channel.** The supplied navy lockup is flattened
onto opaque black, so on the light theme it drew a black box around the mark.
`npm run optimize:logos` keys the ground out: the background is exactly
`rgb(0,0,0)` and the darkest artwork pixel is `rgb(7,24,54)`, so a hard key at
max-channel ≤ 8 is safe, and the ~10× downscale rebuilds clean edges.

**`text-accent`, not `text-brand-pink`, for text.** The display pink clears AA
on the dark ground but only reaches 3.5–3.8:1 on the light panels, under the bar
for the 11–12px labels it is used on. `--color-accent` carries the display pink
on dark and a deepened pink on light. Decorative pink — glows, rails, dots —
stays on `--color-brand-pink` and does not flip. Likewise `--grid-line`,
`--dial-track` and `--dial-tick` exist because literal whites drawn inline
(blueprint grids, gauge tracks) disappear entirely on the light ground.

**Light is the default theme, and three places have to agree on that.** The
pre-paint script in `index.html`, `readStoredTheme()` in `hooks/useTheme.js`,
and the `@theme` block in `index.css` all resolve to light when nothing is
stored. `@theme` holds the *light* values specifically so a no-JS visitor gets
the light ground from the inline `<style>` with matching light text tokens —
with dark values there, they would have got dark text on a light page. Both
`[data-theme]` blocks restate their theme in full, so either can also be scoped
to a subtree. Toggling writes to `localStorage` and persists across reloads.

**Colour has two ramps, on purpose.** `.g-gradient` is the display ramp for
glows, hairlines and gradient type. `.g-gradient-fill` is the same ramp
deepened, for any filled surface carrying white text — white on the display
ramp's pink and coral ends measures 3.8:1 and 3.1:1, under WCAG AA. Use the fill
variant for buttons and solid panels.

**Fonts are checked in, not installed.** `@fontsource/open-sauce-sans@5.3.0`
publishes a corrupt `latin-400-normal.woff2` — it begins with PostScript Type 1
data instead of the `wOF2` magic, so browsers reject it with an OTS parsing
error and the body weight silently falls back to system-ui. Verified against the
published tarball, so it is upstream, not a bad download. The six weights this
site uses live in `src/assets/fonts/` with their `@font-face` rules written out
in `index.css`; weight 400 uses the (valid) `.woff`, 500–900 use `.woff2`.

**`react-countup` needs an interop shim.** It is CJS-only with `main: "build"`
and no `exports` field, so Vite's pre-bundling hands back `{ default: Component }`
rather than the component. Rendering that object throws "Element type is
invalid" and unmounts the entire tree — the whole page goes blank at the
Telemetry section. `lib/countUp.js` normalises it once; import `CountUp` from
there, never from the package directly.

**The 3D scene is wrapped in `SceneBoundary`.** A failed dynamic import — a
chunk 404 after a deploy, a blocked request, a refused WebGL context — used to
throw during render and blank the site over a decorative background. The
boundary drops the scene and leaves the CSS backdrop standing.

**ESLint disables two rules under `components/three/`.** `useFrame` callbacks
run on the render loop, not during React render, so mutating a memoised
`Object3D` or instance matrix there is the intended three.js API rather than a
purity violation. The compiler-aware rules cannot tell the two call sites apart.

**`react-router` reports a high-severity advisory** (GHSA-qwww-vcr4-c8h2). It is
an RSC-mode CSRF bypass; this is a client-rendered SPA with no RSC and no server
actions, so it is not reachable here. Worth re-checking when a patched release
lands.

---

## Responsive

Verified with zero horizontal overflow at 320, 360, 390, 480, 640, 768, 1024,
1280, 1440 and 1920px.

An `xs` breakpoint (30rem / 480px) is added in `@theme`, because Tailwind ships
nothing below `sm` and that left the whole 480–640px band sharing a layout with
a 320px screen. Telemetry, Why Us, Toolstack, the footer sitemap and the contact
form all pair up at `xs` rather than waiting for `sm`.

Two overflow traps worth knowing about, both fixed and both easy to reintroduce:

- **Decorative glows escape their section.** The Services backlight sits 160px
  past the right edge (`-right-40`) and was widening the entire document at
  narrow viewports. It cannot be fixed by clipping the section — that section's
  readout panel is `lg:sticky`, and any clipping ancestor kills the pin — so the
  glow gets its own `overflow-hidden` wrapper. Same pattern in Work.
- **Grid items default to `min-width: auto`.** In About, the route column's 4rem
  left inset pushed the single-column track 30px past its container at 320px.
  Both columns now carry `min-w-0` and the `lg` template uses `minmax(0, 1fr)`.

The pinned sections (Process, Work) and the two-pane ones (Services,
Testimonials) all fall back to stacked layouts below `lg` via `useIsTablet`,
and the pinned ones also unpin under `prefers-reduced-motion`.

## Accessibility & performance

- Reduced motion is honoured throughout: Lenis does not initialise, the 3D scene
  never loads, marquees and counters hold still, and a CSS backdrop replaces the
  corridor.
- Single `h1`; every section is `aria-labelledby` its own heading. FAQ is a
  proper disclosure pattern; the carousel is keyboard-operable and pauses on
  hover and focus.
- Skip link is the first tab stop. Focus rings are visible and on-brand.
- three.js is code-split behind `React.lazy` and only fetched on
  `requestIdleCallback`, so it never blocks first paint. Frames stop entirely
  when the hero scrolls out of view.
- DPR is capped at 1.75; the tunnel, streaks and dust are one instanced draw
  call each, and depth fade comes from fog rather than per-instance opacity.
