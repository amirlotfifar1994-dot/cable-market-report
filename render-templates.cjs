const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const root = __dirname;
const out = path.join(root, 'assets', 'templates');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  });
  try {
    for (const variant of ['signal', 'atlas', 'copper', 'procure']) {
      for (const view of [
        { name: 'desktop', width: 1440, height: 1000 },
        { name: 'mobile', width: 390, height: 850 },
      ]) {
        const page = await browser.newPage({
          viewport: { width: view.width, height: view.height },
          deviceScaleFactor: 1,
          colorScheme: 'light',
        });
        const url = pathToFileURL(path.join(root, 'templates-render.html'));
        url.searchParams.set('variant', variant);
        await page.goto(url.href, { waitUntil: 'load' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(Array.from(document.images).map((image) => image.decode().catch(() => {})));
        });
        await page.screenshot({
          path: path.join(out, `${variant}-${view.name}.png`),
          fullPage: true,
          animations: 'disabled',
        });
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
