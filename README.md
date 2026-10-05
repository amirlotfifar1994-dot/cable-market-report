# پرونده بازار کابل

گزارش تعاملی درباره رقبا، راهبرد سئو، مسیرهای ساخت و طراحی سایت برای تأمین‌کننده کابل وارداتی.

## صفحه‌ها

- [نقشه راه](index.html)
- [بررسی رقبا و اطلس تصویری](competitors.html)
- [راهبرد سایت و سئو](strategy.html)
- [وردپرس یا توسعه اختصاصی](build-paths.html)
- [مدل طراحی سایت](design.html)
- [گالری تمپلیت‌ها](templates.html)
- [تمپلیت‌های قابل اجرای وودمارت و المنتور](woodmart-templates.html)

این سایت از فایل‌های HTML، CSS و JavaScript ایستا ساخته شده و برای انتشار در GitHub Pages به فرایند ساخت نیاز ندارد. مسیر همهٔ پیوندهای داخلی نسبی است تا در زیرمسیر مخزن نیز کار کند.

## WoodMart commerce studio

The WoodMart gallery now includes three additional concepts (Copper, Line, Depot), 18 new desktop/mobile page images, four AI concept photos, an interactive price desk prototype, and a WooCommerce implementation brief. The price desk is a standalone demonstration and does not connect to a real store.

- [Implementation brief](woodmart-build-brief.md)
- [New image package](woodmart-commerce-images.zip)
- [Sample price CSV](sample-woocommerce-price-update.csv)
- [Image generation prompts](woodmart-image-prompts.json)

## WoodMart slider concepts

Three more concepts — Wave (full-width hero slider), Pulse (featured-product showcase), and Orbit (bento banners and brand carousel) — bring the gallery to nine concepts and 54 page images. Each new concept has home, catalog, and product screenshots for desktop and mobile, plus an embedded interactive HTML preview with arrows, dots, swipe, and opt-in autoplay.

- [Slider image package](woodmart-slider-images.zip)
- [Wave live concept](woodmart-slider-render.html?theme=wave)
- [Pulse live concept](woodmart-slider-render.html?theme=pulse)
- [Orbit live concept](woodmart-slider-render.html?theme=orbit)

The previews are design demonstrations, not an installed WordPress store or Elementor import files. Native WoodMart implementation paths are documented; reproducing Pulse's exact featured-product hero dynamically may require a custom template or limited development. All live prices in a real implementation must come from WooCommerce product data.

## Customer pages, security, and SEO roadmap

Wave, Pulse, and Orbit now each include seven page concepts: home, catalog, product, about, contact, customer account, and email/SMS login. The gallery contains 78 desktop/mobile images in total. The sample customer account includes customer-specific quotes, request submission, quote details, a printable HTML download, and a demonstration acceptance action. Login is a clearly marked OTP simulation with no email/SMS delivery or authentication backend.

- [Security and customer-account implementation report](security.html)
- [Scenario-based SEO roadmap](seo-roadmap.html)

The SEO report combines four product-market scenarios with three sales models, links opportunities to the existing competitor evidence, and includes technical, content, development, measurement, and six-month execution plans. Brand/SKU data remains unknown; examples and workload figures are proposals, not traffic forecasts. Security controls are implementation requirements, not protections applied to an installed store.

## تکمیل سئو · ۳ اکتبر ۲۰۲۶

- مطالعه موردی معرفی‌شده تیم: دیپلم‌سرا؛ مشاهدات عمومی و وضعیت مستند عملکرد جدا شده‌اند.
- نقشه کلمه → صفحه → اقدام، فایل CSV و الگوی گزارش ماهانه در `seo-roadmap.html`.
- مشاهدات محدود در `diplomsara-seo-observations.md`؛ رتبه و رشد عددی بدون داده درج نشده‌اند.

## تکمیل امنیت · ۳ اکتبر ۲۰۲۶

- سه مسیر استعلام، فروشگاه و شرکت/ERP با دامنه مستقل در `security.html`.
- تنظیمات پیشخوان و وودمارت، سیاست OTP/نشست، مالکیت و نسخه سند، نقش قیمت، سرویس‌ها و بازیابی.
- معیارهای پذیرش اجرای واقعی و ۱۴ یادداشت محلی پیگیری؛ به وردپرس متصل نیستند.
- شرح تحویل قابل دانلود در `security-implementation-brief.md`.

## صفحه نقشه راه

`index.html` درگاه هفت مرحله مرتب از رقبا تا راه‌اندازی و رشد است؛ هر مرحله خروجی تصمیم و پیوند به گزارش‌ها دارد. برچسب ناوبری همه گزارش‌ها «نقشه راه» است. منبع ساخت صفحه: `build-roadmap-home.py` و `roadmap-home.css`.

طراحی صفحه نقشه راه شامل آغاز تصویری، کارت‌های دارای آیکون، تفکیک رنگی مرحله‌ها و دسترسی مستقل به گزارش‌ها و فرم کارفرما است. فهرست کناری دسکتاپ هنگام مرور مرحله فعلی را مشخص می‌کند؛ نسخه گوشی فهرست افقی قابل پیمایش دارد. رفتار مرحله فعلی در `roadmap-home.js` تعریف شده و نشانه پیشرفت یا تکمیل پروژه نیست.

## اطلاعات موردنیاز کارفرما · ۴ اکتبر ۲۰۲۶

- صفحه `client-brief.html`: تعداد مدل و تنوع، دسته‌بندی، برند/نمایندگی، آدرس و تماس، قواعد فروش، طراحی، حساب مشتری، اتصال‌ها و تحویل.
- موارد مهم برای شروع جدا علامت خورده‌اند؛ پاسخ نامشخص هم قابل ثبت است. درصد تکمیل، صرفاً تعداد پاسخ‌هاست.
- ذخیره صریح در همین مرورگر، بازیابی محلی، دانلود و کپی متن خلاصه، چاپ خلاصه و پاک‌کردن با تأیید داخلی.
- فرم backend و ارسال پاسخ ندارد؛ کارفرما خلاصه را جدا تحویل می‌دهد. اطلاعات و فایل‌ها در مخزن عمومی ثبت نمی‌شوند.
- منبع فرم: `build-client-brief.py`؛ سبک و رفتار در `client-brief.css` و `client-brief.js`.

## تصاویر اختصاصی و حرکت اختیاری · ۴ اکتبر ۲۰۲۶

- ده صفحه اصلی هرکدام تصویر موضوعی تازه دارند؛ تصاویر مفهومی با ابزار داخلی image_gen ساخته شده‌اند.
- فایل و پرامپت هر تصویر در `assets/editorial-2026/manifest.json`؛ تصویرهای گزارش رقبا و گالری طرح‌ها حفظ شده‌اند.
- ورود تیتر و بخش‌ها هنگام اسکرول، واکنش دکمه‌ها و نور قاب؛ توقف حرکت از منو و رعایت تنظیم کاهش حرکت دستگاه.
- فرم ۶۴ سؤال دارد؛ شرح بازبینی در `portal-review.md`.
- پس از ساخت دوباره صفحات قدیمی، `python visual_upgrade.py` را اجرا کنید. سازنده‌های پایتون اصلی این مرحله را خودکار اجرا می‌کنند.
- بسته‌های دانلودی با `python package_report_portal.py` ساخته می‌شوند. بسته کامل شامل تصویرهای رقبا و تصویرهای تازه است؛ دانلود بسته‌های جداگانه طرح‌ها از آدرس عمومی انجام می‌شود.

## تصاویر سبک و بارگذاری تدریجی · ۴ اکتبر ۲۰۲۶

- نسخه نمایشی ۱۴۱ تصویر در اندازه کامل در مجموع حدود ۶۸٪ سبک‌تر شده؛ فایل‌های اصلی برای دانلود حفظ شده‌اند.
- اندازه‌های متفاوت برای گوشی و دسکتاپ، اولویت تصویر آغاز، دریافت نزدیک قاب دید و تعویق تصاویر تب‌های بسته.
- لودینگ داخل قاب، تلاش دوباره هنگام خطا، بازخورد جابه‌جایی و نمایش فوری تم ذخیره‌شده.
- منبع: `optimize_report_media.py`، `report-loading.js` و `report-loading.css`؛ اندازه‌های ثبت‌شده و شرح محدودیت‌ها در `media-performance-notes.md`.
- ترتیب تولید: ساخت صفحه → `visual_upgrade.py` → برای تصویر تازه `optimize_report_media.py` → `package_report_portal.py`.

## پلن‌های دقیق اجرا و مرز سئو · ۵ اکتبر ۲۰۲۶

- `service-plans.html`: چهار پیشنهاد ۴۵، ۶۵، ۸۵ و ۱۱۰ میلیون تومان با فرض‌های مشخص و سقف ۱۵۰ SKU آماده؛ قیمت‌ها پس از تکمیل اطلاعات کارفرما نهایی می‌شوند.
- شرح طراحی، امکانات فروش و حساب، امنیت، ورود، قیمت و پیش‌فاکتور، معیار تحویل، سهم اجزای قیمت و موارد خارج از قرارداد.
- سئوی فنی در همه پلن‌ها؛ ۱۰/۲۰/۳۵/۵۰ صفحه منتخب و ۰/۲/۴/۶ مقاله اولیه. تولید ماهانه و بودجه رسانه جدا از طراحی‌اند.
- خدمات ماهانه ۲۵/۳۵/۵۰، گزینه‌های اضافه، محاسبه بودجه سه/شش/دوازده‌ماهه با جلوگیری از دوباره‌حساب‌کردن نگهداری.
- منبع واحد `service-plans.json`؛ سازنده `build-service-plans.py`؛ شرح کامل هر پلن به شکل TXT و همه پلن‌ها در `service-plans-proposal.md`.
- برنامه‌ها پیشنهاد اجرا هستند؛ این گزارش نصب وردپرس یا تعهد رتبه و فروش نیست. بسته‌های ZIP عمومی فعلاً مربوط به نسخه قبلی‌اند.
