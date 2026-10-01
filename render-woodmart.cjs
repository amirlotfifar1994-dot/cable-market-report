const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const root = __dirname;
const output = path.join(root, 'assets', 'templates', 'woodmart');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  try {
    for (const theme of ['technical', 'brands', 'project']) {
      for (const pageType of ['home', 'catalog', 'product']) {
        for (const view of [
          { name: 'desktop', width: 1440, height: 900 },
          { name: 'mobile', width: 390, height: 844 }
        ]) {
          const page = await browser.newPage({ viewport: { width: view.width, height: view.height }, deviceScaleFactor: 1 });
          const url = pathToFileURL(path.join(root, 'woodmart-render.html'));
          url.searchParams.set('theme', theme);
          url.searchParams.set('page', pageType);
          await page.goto(url.href, { waitUntil: 'load' });
          await page.evaluate(async () => {
            await document.fonts.ready;
            await Promise.all(Array.from(document.images).map(img => img.decode().catch(() => {})));
          });
          await page.screenshot({ path: path.join(output, theme + '-' + pageType + '-' + view.name + '.png'), fullPage: true, animations: 'disabled' });
          await page.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
