/**
 * Build-time logo optimisation.
 *
 * The supplied lockups are 6160×2533 PNGs (~1.4 MB together) but never render
 * wider than ~240 CSS px. This trims them to the sizes actually used and emits
 * WebP alongside a compressed PNG fallback.
 *
 * Run with: npm run optimize:logos
 */
import { mkdir, readdir, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(here, '../src/assets')
const OUT = resolve(here, '../src/assets/optimized')

// 2× the largest rendered width (240px in the footer) covers retina.
const WIDTHS = [320, 640]

const SOURCES = [
  // White "10X" — for dark surfaces. Ships with a correct alpha channel.
  { file: 'Footer.png', name: 'logo-light' },
  // Navy "10X" — for light surfaces. Ships FLATTENED ONTO BLACK with no alpha
  // channel at all, so placing it on the light theme drew an opaque black box
  // around the mark. Keyed below.
  { file: 'Header.png', name: 'logo-dark', keyBlack: true },
]

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`

/**
 * Restore transparency on artwork that was flattened onto black.
 *
 * The source is cleanly separated: the ground is exactly rgb(0,0,0) and the
 * darkest artwork pixel is rgb(7,24,54), with only ~0.1% of pixels in between
 * (the wordmark's antialiased edges). A hard key at max-channel ≤ 8 therefore
 * removes the ground without touching the mark, and the ~10× downscale that
 * follows rebuilds smooth edges on its own — sharp premultiplies alpha while
 * resizing, so no dark fringe survives.
 */
async function keyOutBlack(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += 4) {
    const max = Math.max(data[i], data[i + 1], data[i + 2])
    if (max <= 8) data[i + 3] = 0
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer()
}

await mkdir(OUT, { recursive: true })

for (const { file, name, keyBlack } of SOURCES) {
  const input = join(SRC, file)
  const before = (await stat(input)).size
  const meta = await sharp(input).metadata()

  // Everything downstream works from this, so the key happens exactly once.
  const source = keyBlack ? await keyOutBlack(input) : input

  for (const width of WIDTHS) {
    const base = sharp(source).resize({ width, withoutEnlargement: true })

    await base
      .clone()
      .webp({ quality: 90, effort: 6, alphaQuality: 100 })
      .toFile(join(OUT, `${name}-${width}.webp`))

    await base
      .clone()
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(join(OUT, `${name}-${width}.png`))
  }

  console.log(
    `${file}  ${meta.width}×${meta.height}  ${kb(before)}  →  ${name}-{${WIDTHS.join(
      ',',
    )}}.{webp,png}`,
  )
}

const produced = await readdir(OUT)
let total = 0
for (const f of produced) total += (await stat(join(OUT, f))).size
console.log(`\n${produced.length} files, ${kb(total)} total in src/assets/optimized`)
