import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
mkdirSync('.shots', { recursive: true })
const b = await chromium.launch({ executablePath: EDGE, headless: true })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:5199/G10x-Website/', { waitUntil: 'load' })
await p.waitForTimeout(6500)
await p.screenshot({ path: '.shots/hero-1440.png' })
await b.close()
