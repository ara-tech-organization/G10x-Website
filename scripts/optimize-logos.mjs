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
  { file: 'Footer.png', name: 'logo-light' }, // white "10X" — for dark surfaces
  { file: 'Header.png', name: 'logo-dark' }, // navy "10X" — for light surfaces
]

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`

await mkdir(OUT, { recursive: true })

for (const { file, name } of SOURCES) {
  const input = join(SRC, file)
  const before = (await stat(input)).size
  const meta = await sharp(input).metadata()

  for (const width of WIDTHS) {
    const base = sharp(input).resize({ width, withoutEnlargement: true })

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
