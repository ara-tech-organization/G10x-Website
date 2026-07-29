import { chromium } from 'playwright-core'
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const b = await chromium.launch({ executablePath: EDGE, headless: true })
for (const w of [390, 640, 1024, 1280, 1440, 1920]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  await p.goto('http://localhost:5199/G10x-Website/', { waitUntil: 'load' })
  await p.waitForTimeout(5000)
  const r = await p.evaluate(() => {
    const h = document.querySelector('#top h1')
    const cs = getComputedStyle(h)
    return { px: Math.round(parseFloat(cs.fontSize)), lines: h.getClientRects().length, h: Math.round(h.getBoundingClientRect().height) }
  })
  console.log(`  ${String(w).padStart(4)}px  h1 = ${String(r.px).padStart(3)}px   block height ${r.h}px`)
  await p.close()
}
await b.close()
