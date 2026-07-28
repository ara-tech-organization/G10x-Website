/**
 * Social share card.
 *
 * Emits public/og-image.png at 1200×630 — the size Facebook, LinkedIn,
 * WhatsApp and Twitter's summary_large_image all key off. Built from the
 * brand ground, the signature gradient ramp and the white lockup so the card
 * reads as the site rather than as a generic link preview.
 *
 * Two columns: the hero H1 on the left, the six service pillars stacked in a
 * panel on the right, contact rail across the foot. Nothing is centred over
 * empty canvas — the whole frame carries content, which is what makes it
 * legible at the ~500px wide most feeds actually render it.
 *
 * Text is drawn as SVG. librsvg (what sharp renders SVG through) will not
 * load the site's woff2 face, so the type falls back to whatever grotesque
 * the machine has. The card is generated once and committed, so this is a
 * build-box concern only — not something visitors ever see vary.
 *
 * Run with: npm run make:og
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const LOGO = resolve(here, '../src/assets/Footer.png') // white mark, has alpha
const OUT = resolve(here, '../public/og-image.png')

const W = 1200
const H = 630

// Sampled from src/index.css — keep in step with the accent ramp there.
const VOID = '#050814'
const PURPLE = '#7c2ff4'
const VIOLET = '#a438e8'
const PINK = '#df4a94'
const CORAL = '#f0655a'
const CHALK = '#ffffff'
const MIST = '#a8b0c4'

const FONT = "'Open Sauce Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

// Left column runs 72→700; the service panel takes 744→1128.
const L = 72
const PANEL_X = 744
const PANEL_W = 384

// The six pillars, in the order the Services section lists them.
const PILLARS = [
  'Search Engine Optimization',
  'Social Media Marketing',
  'Search Engine Marketing',
  'Branding &amp; Design',
  'Video Editing',
  'Website &amp; App Development',
]

const esc = (s) =>
  s.replace(/&(?!amp;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const pillarRows = PILLARS.map((name, i) => {
  const y = 246 + i * 42
  return `
    <circle cx="${PANEL_X + 34}" cy="${y - 6}" r="4.5" fill="url(#ramp)"/>
    <text x="${PANEL_X + 54}" y="${y}" font-family="${FONT}" font-size="19"
          font-weight="500" fill="${CHALK}" opacity="0.92">${name}</text>`
}).join('')

const backdrop = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="ramp" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${PURPLE}"/>
      <stop offset="34%" stop-color="${VIOLET}"/>
      <stop offset="66%" stop-color="${PINK}"/>
      <stop offset="100%" stop-color="${CORAL}"/>
    </linearGradient>
    <linearGradient id="rampV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${PURPLE}"/>
      <stop offset="50%" stop-color="${PINK}"/>
      <stop offset="100%" stop-color="${CORAL}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.86" cy="0.1" r="0.72">
      <stop offset="0%" stop-color="${PURPLE}" stop-opacity="0.40"/>
      <stop offset="55%" stop-color="${PINK}" stop-opacity="0.11"/>
      <stop offset="100%" stop-color="${VOID}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.04" cy="0.96" r="0.5">
      <stop offset="0%" stop-color="${VIOLET}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${VOID}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${VOID}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- Signature ramp, top edge. -->
  <rect width="${W}" height="6" fill="url(#ramp)"/>

  <!-- Left column -->

  <text x="${L}" y="212" font-family="${FONT}" font-size="19" font-weight="700"
        letter-spacing="3.2" fill="${PINK}">DIGITAL MARKETING COMPANY · THANJAVUR</text>

  <!-- The page H1, on the same three lines the hero splits it into. -->
  <text x="${L}" y="286" font-family="${FONT}" font-size="60" font-weight="800"
        letter-spacing="-2" fill="${CHALK}">Digital Growth,</text>
  <text x="${L}" y="352" font-family="${FONT}" font-size="60" font-weight="800"
        letter-spacing="-2" fill="${CHALK}">Built for Your</text>
  <text x="${L}" y="418" font-family="${FONT}" font-size="60" font-weight="800"
        letter-spacing="-2" fill="url(#ramp)">Business</text>

  <rect x="${L}" y="452" width="48" height="3" rx="1.5" fill="url(#ramp)"/>

  <text x="${L}" y="500" font-family="${FONT}" font-size="21" font-weight="400"
        fill="${MIST}">Honest, strategic growth for businesses</text>
  <text x="${L}" y="528" font-family="${FONT}" font-size="21" font-weight="400"
        fill="${MIST}">ready to compete online.</text>

  <!-- Right panel -->

  <rect x="${PANEL_X}" y="150" width="${PANEL_W}" height="340" rx="22"
        fill="${CHALK}" fill-opacity="0.045"
        stroke="${CHALK}" stroke-opacity="0.11" stroke-width="1"/>
  <!-- Vertical ramp on the panel's leading edge. -->
  <rect x="${PANEL_X}" y="182" width="3" height="276" rx="1.5" fill="url(#rampV)"/>

  <text x="${PANEL_X + 34}" y="196" font-family="${FONT}" font-size="14"
        font-weight="700" letter-spacing="2.6" fill="${MIST}">WHAT WE DO</text>

  ${pillarRows}

  <!-- Foot rail -->

  <rect x="0" y="566" width="${W}" height="1" fill="${CHALK}" fill-opacity="0.10"/>

  <text x="${L}" y="604" font-family="${FONT}" font-size="20" font-weight="600"
        fill="${CHALK}">${esc('G10X Private Limited')}</text>
  <text x="${L + 232}" y="604" font-family="${FONT}" font-size="20"
        font-weight="400" fill="${MIST}">${esc('Srinivasapuram, Thanjavur — 613009')}</text>
  <text x="${W - 72}" y="604" text-anchor="end" font-family="${FONT}"
        font-size="20" font-weight="600" fill="${CHALK}">+91 92807 01655</text>
</svg>`

const logo = await sharp(await readFile(LOGO))
  .resize({ width: 210, fit: 'inside' })
  .png()
  .toBuffer()

const { height: logoH } = await sharp(logo).metadata()

const png = await sharp(Buffer.from(backdrop))
  .composite([{ input: logo, top: 62, left: L }])
  .png({ compressionLevel: 9 })
  .toBuffer()

await writeFile(OUT, png)

console.log(
  `og-image.png  ${W}×${H}  logo 210×${logoH}  ${(png.length / 1024).toFixed(1)} kB`,
)
