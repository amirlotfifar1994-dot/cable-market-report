# پرونده بازار کابل

گزارش تعاملی درباره رقبا، راهبرد سئو، مسیرهای ساخت و طراحی سایت برای تأمین‌کننده کابل وارداتی.

## صفحه‌ها

- [درگاه گزارش‌ها](index.html)
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
