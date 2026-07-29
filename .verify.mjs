import { chromium } from 'playwright-core'
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const URL = 'http://localhost:5173/G10x-Website/'
const b = await chromium.launch({ executablePath: EDGE, headless: true })
const read = (p) => p.evaluate(() => ({
  theme: document.documentElement.getAttribute('data-theme'),
  bg: getComputedStyle(document.body).backgroundColor,
  stored: localStorage.getItem('g10x-theme'),
}))

const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } })
const p = await ctx.newPage()
p.on('pageerror', (e) => console.log('PAGEERROR:', e.message))
await p.goto(URL, { waitUntil: 'load' })
await p.waitForTimeout(5500)
console.log('fresh visitor on :5173 ', JSON.stringify(await read(p)))

const t = p.locator('header button[aria-label]').first()
console.log('toggle label           ', JSON.stringify(await t.getAttribute('aria-label')))
await t.click(); await p.waitForTimeout(900)
console.log('after click            ', JSON.stringify(await read(p)))
await t.click(); await p.waitForTimeout(900)
console.log('after second click     ', JSON.stringify(await read(p)))

// What the server is actually serving for the pre-paint default.
const html = await (await fetch(URL)).text()
const m = html.match(/var t = '(\w+)'/)
console.log('served default in HTML ', m ? m[1] : 'NOT FOUND')
await b.close()
