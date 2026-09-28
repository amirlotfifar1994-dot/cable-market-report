// Capture public competitor homepages in isolated headless Chromium contexts.
// Usage: set CODEX_PLAYWRIGHT_PATH to the bundled playwright package, then:
//   node capture-homepages.js [slug]
const fs = require("node:fs/promises");
const path = require("node:path");
const bundledPlaywright = "C:\\Users\\Amir\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\playwright";
const { chromium, devices } = require(process.env.CODEX_PLAYWRIGHT_PATH || bundledPlaywright);

const root = __dirname;
const outDir = path.join(root, "competitor-screenshots");
const manifestPath = path.join(outDir, "manifest.json");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const targets = [
  { slug: "barghsan", name: "برق‌سان", urls: ["https://www.barghsan.com/"] },
  { slug: "jahancablearka", name: "جهان کابل آرکا", urls: ["https://jahancablearka.com/"] },
  { slug: "chalipacable", name: "چلیپا کابل پویا", urls: ["https://www.chalipacable.com/", "https://www.chalipacable.ir/", "http://www.chalipacable.com/", "http://www.chalipacable.ir/", "https://chalipacable.ir/", "https://chalipacable.com/", "http://chalipacable.ir/", "http://chalipacable.com/"] },
  { slug: "voltatadbir", name: "ولتا تدبیر", urls: ["https://voltatadbir.ir/"] },
  { slug: "maniadsanat", name: "مانیاد صنعت", urls: ["https://maniadsanat.com/"] },
  { slug: "renirvana", name: "رایا ارتباط نیروانا", urls: ["https://renirvana.com/"] },
  { slug: "legrandco", name: "لگراندکو", urls: ["https://legrand-co.ir/"] },
  { slug: "cableiran", name: "کابل ایران", urls: ["https://cableiran.com/"] },
  { slug: "bargheasia", name: "برق و صنعت آسیا", urls: ["https://bargheasia.com/"] },
  { slug: "legrandpars", name: "لگراند پارس", urls: ["https://www.legrandpars.ir/"] },
];

async function revealLazyContent(page) {
  const size = await page.evaluate(() => ({
    height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
    viewport: window.innerHeight,
  }));
  const step = Math.max(500, Math.round(size.viewport * 0.8));
  for (let y = 0, n = 0; y < size.height && n < 80; y += step, n++) {
    try { await page.evaluate(value => window.scrollTo(0, value), y); }
    catch { await page.waitForLoadState("domcontentloaded", { timeout: 10000 }).catch(() => {}); }
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(450);
}

async function captureDevice(browser, target, device) {
  const mobile = device === "mobile";
  const settings = mobile
    ? { ...devices["iPhone 13"], viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }
    : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
  const context = await browser.newContext({
    ...settings,
    locale: "fa-IR",
    colorScheme: "light",
    reducedMotion: "reduce",
    serviceWorkers: "block",
    acceptDownloads: false,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(25000);
  const result = { device, status: "failed", attempts: [] };
  for (const url of target.urls) {
    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      const code = response ? response.status() : null;
      const title = await page.title();
      const finalUrl = page.url();
      result.attempts.push({ url, code, finalUrl, title });
      if (code && code >= 400) continue;
      await page.waitForTimeout(900);
      if (!(target.slug === "barghsan" && mobile)) await revealLazyContent(page);
      const file = target.slug + "-" + device + ".jpg";
      const output = path.join(outDir, file);
      await page.screenshot({
        path: output,
        fullPage: true,
        type: "jpeg",
        quality: 74,
        animations: "disabled",
        caret: "hide",
        timeout: 60000,
      });
      const dimensions = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      })).catch(() => null);
      result.status = "captured";
      result.url = finalUrl;
      result.title = title;
      result.file = file;
      result.dimensions = dimensions;
      result.bytes = (await fs.stat(output)).size;
      break;
    } catch (error) {
      result.attempts.push({ url, error: String(error.message || error).slice(0, 250) });
    }
  }
  await context.close();
  return result;
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const only = process.argv[2];
  const selected = only ? targets.filter(target => target.slug === only) : targets;
  if (!selected.length) throw new Error("Unknown slug: " + only);
  let manifest = {};
  try { manifest = JSON.parse(await fs.readFile(manifestPath, "utf8")); } catch {}
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-first-run", "--disable-default-apps", "--disable-extensions"],
  });
  for (const target of selected) {
    manifest[target.slug] = { name: target.name, capturedAt: new Date().toISOString(), captures: {} };
    for (const device of ["desktop", "mobile"]) {
      const result = await captureDevice(browser, target, device);
      manifest[target.slug].captures[device] = result;
      console.log(JSON.stringify({ slug: target.slug, ...result }));
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
    }
  }
  await browser.close();
}

main().catch(error => { console.error(error); process.exitCode = 1; });
