const fs = require('fs');
const path = require('path');

const root = __dirname;
const source = fs.readFileSync(path.join(root, 'cable-market-report.html'), 'utf8');
function section(id, oldLabel, newLabel) {
  const match = source.match(new RegExp(`<section class="section" id="${id}">[\\s\\S]*?<\\/section>`));
  if (!match) throw new Error(`Missing section ${id}`);
  return oldLabel ? match[0].replace(oldLabel, newLabel) : match[0];
}
const content = [
  section('scope', '۰۲ / روش بررسی', '۰۱ / روش بررسی'),
  section('competitors', '۰۳ / نقشه رقابت', '۰۲ / نقشه رقابت'),
  section('screenshots', '۰۴ / اطلس تصویری', '۰۳ / اطلس تصویری'),
  section('gaps', '۰۵ / اولویت‌های محصول', '۰۴ / فرصت‌های محصول'),
  section('sources', '۱۰ / منابع و اعتبار', '۰۵ / منابع و اعتبار'),
].join('\n');
const html = `<!doctype html>
<html lang="fa" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="بررسی ده سایت مرتبط با بازار کابل، قوت‌ها، فرصت‌های طراحی و سئو و تصاویر کامل صفحه اصلی در دسکتاپ و گوشی."><title>گزارش رقبا و شواهد تصویری | بازار کابل</title><link rel="stylesheet" href="reports-site.css"></head>
<body>
  <nav class="site-nav" aria-label="ناوبری اصلی"><div class="wrap"><a class="site-brand" href="index.html"><span class="brand-mark" aria-hidden="true">◎</span><span>پرونده بازار کابل</span></a><div class="nav-links"><a href="index.html">نقشه راه</a><a href="competitors.html" aria-current="page">رقبا</a><a href="strategy.html">راهبرد</a><a href="build-paths.html">مسیر ساخت</a><a href="design.html">طراحی</a><a href="client-brief.html">اطلاعات کارفرما</a></div><div class="nav-actions"><button class="icon-btn print-btn" type="button" onclick="window.print()">چاپ / PDF</button><button class="icon-btn" id="theme-toggle" type="button" aria-label="تغییر تم">☀</button></div></div><div class="reading-bar" id="reading-bar" aria-hidden="true"></div></nav>
  <header class="hero"><div class="wrap"><div><span class="eyebrow">گزارش ۱ · رقبا و شواهد</span><h1>بازار کابل: <em>رقبا، قوت‌ها و خلأها</em></h1><p>بررسی ۱۰ سایت مرتبط با مدل کسب‌وکار تأمین و نمایندگی فروش کابل. هر ادعا به صفحه عمومی قابل مشاهده متصل است و تصاویر کامل صفحه اصلی برای مقایسه طراحی در دسترس‌اند.</p><div class="hero-meta"><span>۲۷ سپتامبر ۲۰۲۶</span><span>۱۰ سایت در نمونه</span><span>دسکتاپ و گوشی</span></div><div class="hero-actions"><a class="primary" href="#competitors">نقشه رقبا ←</a><a class="secondary" href="#screenshots">اطلس تصاویر</a><a class="secondary" href="index.html">خانه گزارش‌ها</a></div></div><div class="hero-art"><img src="industrial-cable-hero.png" alt="تصویر مفهومی کابل صنعتی با مقطع مسی"></div></div></header>
  <main class="wrap page-main"><div class="metrics" aria-label="شاخص‌های این گزارش"><div class="metric"><strong>۱۰</strong><span>سایت بررسی‌شده</span></div><div class="metric"><strong>۳ + ۷</strong><span>رقبای اولیه و تکمیلی</span></div><div class="metric"><strong>۹</strong><span>سایت با تصویر کامل</span></div><div class="metric"><strong>۱۸</strong><span>اسکرین‌شات دسکتاپ و گوشی</span></div></div>
  <section class="section" id="summary"><div class="section-head"><div><div class="kicker">جمع‌بندی</div><h2>رقابت با سبد کالا و کدهای واقعی روشن می‌شود</h2></div></div><div class="report-intro"><div class="panel"><p class="callout">عدد ۱۰، اندازه کل بازار یا تعداد قطعی رقبای مستقیم نیست؛ این فهرست نمونه‌ای از سایت‌های مرتبط است.</p><p>برای کابل صنعتی، ولتا تدبیر و مانیاد صنعت؛ برای کابل شبکه، رایا ارتباط نیروانا و لگراندکو؛ و برای جست‌وجوهای عمومی، فروشگاه‌های بزرگ هم اهمیت دارند. فهرست برندها و SKUهای مشتری، نقشه رقابت نهایی را دقیق می‌کند.</p></div><div class="panel"><h3>فرصت قابل ساخت</h3><ul><li>پارت‌نامبر و مشخصات فنی قابل جست‌وجو</li><li>دیتاشیت و اصالت کنار همان مدل</li><li>مقایسه مدل‌های نزدیک با تفاوت روشن</li><li>RFQ چندقلمی با مقدار و مقصد پروژه</li></ul></div></div></section>
  ${content}
  <section class="next-report" aria-label="ادامه مطالعه"><div><div class="kicker">گام بعدی</div><h2>یافته‌های رقبا را به برنامه سایت تبدیل کنید</h2><p>اولویت‌ها، نقشه سئو و انتخاب فناوری را در گزارش راهبرد ببینید.</p></div><div class="next-actions"><a class="btn btn-primary" href="strategy.html#summary">رفتن به راهبرد ←</a><a class="btn btn-secondary" href="index.html#reports">بازگشت به صفحه اصلی</a></div></section>
  </main>
  <dialog class="shot-dialog" id="shot-dialog" aria-label="تصویر تمام‌صفحه رقیب"><div class="dialog-head"><strong id="dialog-title"></strong><button type="button" id="dialog-close">بستن ×</button></div><div class="dialog-body"><img id="dialog-image" alt=""></div></dialog>
  <footer class="site-footer"><div class="wrap"><strong>گزارش رقبا · بازار کابل</strong><span>۲۷ سپتامبر ۲۰۲۶ · مشاهده عمومی، با محدودیت‌های ذکرشده در متن</span></div></footer>
  <button class="toc-fab" id="toc-fab" type="button" aria-expanded="false" aria-controls="toc-panel">فهرست بخش‌ها</button><nav class="toc-panel" id="toc-panel" aria-label="فهرست همین صفحه" hidden><strong>در این صفحه</strong></nav>
  <script src="reports-site.js"></script>
</body></html>`;
fs.writeFileSync(path.join(root, 'competitors.html'), html, 'utf8');
console.log('Built competitors.html from the verified report sections');
