// Inserts the locally captured homepage screenshots into the HTML report.
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const reportPath = path.join(root, "cable-market-report.html");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "competitor-screenshots", "manifest.json"), "utf8"));
const order = [
  "barghsan", "jahancablearka", "chalipacable", "voltatadbir", "maniadsanat",
  "renirvana", "legrandco", "cableiran", "bargheasia", "legrandpars",
];
function esc(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function figure(site, device) {
  const item = site.captures[device];
  if (!item || item.status !== "captured") return "";
  const label = device === "desktop" ? "دسکتاپ" : "گوشی";
  const src = "competitor-screenshots/" + item.file;
  const title = site.name + " · " + label + " · صفحه خانه";
  return `<figure class="shot shot--${device}">
          <a class="preview" href="${esc(src)}" data-title="${esc(title)}" target="_blank" rel="noopener noreferrer" aria-label="نمایش تصویر تمام‌صفحه ${esc(title)}"><img src="${esc(src)}" alt="نمای تمام‌صفحه صفحه خانه ${esc(site.name)} در حالت ${label}" loading="lazy" decoding="async"></a>
          <figcaption><span>${label} · تمام‌صفحه</span><a href="${esc(src)}" download>دریافت تصویر ↓</a></figcaption>
        </figure>`;
}
const cards = order.map((slug, index) => {
  const site = manifest[slug];
  if (!site) throw new Error("Missing manifest item: " + slug);
  const desktop = site.captures.desktop;
  const mobile = site.captures.mobile;
  const available = desktop?.status === "captured" && mobile?.status === "captured";
  const siteUrl = desktop?.url || mobile?.url;
  return `<article class="panel atlas-item" id="shot-${slug}">
        <header class="atlas-item-head"><span class="atlas-index">${String(index + 1).padStart(2, "0")}</span><div><h3>${esc(site.name)}</h3><p class="atlas-sub">${available ? "صفحه اصلی در دسکتاپ و گوشی" : "تصویر صفحه خانه قابل ثبت نبود"}</p></div>${available && siteUrl ? `<a class="atlas-site" href="${esc(siteUrl)}" target="_blank" rel="noopener noreferrer">سایت رقیب ↗</a>` : ""}</header>
        ${available ? `<div class="shot-pair">${figure(site, "desktop")}${figure(site, "mobile")}</div>` : `<div class="atlas-error"><b>ثبت تصویر ممکن نشد</b>هر دو دامنه معرفی‌شده چلیپا کابل خطای گواهی HTTPS دادند. از هشدار امنیتی عبور نشده و تصویری به‌جای صفحه خانه قرار نگرفته است.</div>`}
      </article>`;
}).join("\n");
const atlasNav = order.map((slug, index) => `<a href="#shot-${slug}"><span>${String(index + 1).padStart(2, "0")}</span>${esc(manifest[slug].name)}</a>`).join("");
const section = `<section class="section" id="screenshots">
      <div class="section-head"><div><div class="kicker">۰۴ / اطلس تصویری</div><h2>صفحه خانه رقبا، کامل و در دو اندازه</h2><p class="lead">از ۹ سایت، ۱۸ تصویر تمام‌صفحه ثبت شد. پیش‌نمایش، بخش آغازین هر صفحه را نشان می‌دهد؛ برای دیدن کل صفحه روی تصویر بزنید.</p></div><div class="section-side">۱۸ تصویر<br><strong>۹ وب‌سایت</strong></div></div>
      <nav class="atlas-nav" aria-label="فهرست تصاویر رقبا">${atlasNav}</nav>
      <div class="atlas">${cards}</div>
      <p class="mini-legend">ثبت تصاویر: ۲۷ سپتامبر ۲۰۲۶. عرض مرورگر دسکتاپ ۱۴۴۰ پیکسل و نمای گوشی ۳۹۰ پیکسل بوده است. محتوای پویا ممکن است هنگام مراجعه بعدی تفاوت داشته باشد.</p>
    </section>`;
const start = "<!-- screenshot-gallery-start -->";
const end = "<!-- screenshot-gallery-end -->";
const html = fs.readFileSync(reportPath, "utf8");
if (!html.includes(start) || !html.includes(end)) throw new Error("Gallery markers missing");
const updated = html.replace(new RegExp(start + "[\\s\\S]*?" + end), start + "\n    " + section + "\n    " + end);
fs.writeFileSync(reportPath, updated, "utf8");
console.log("Inserted", order.length, "competitors and", order.filter(slug => manifest[slug].captures.desktop?.status === "captured" && manifest[slug].captures.mobile?.status === "captured").length * 2, "screenshots");
