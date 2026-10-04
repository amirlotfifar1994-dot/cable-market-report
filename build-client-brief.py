"""Generate the client discovery questionnaire; answers stay in the browser."""
from pathlib import Path
from html import escape

ROOT = Path(__file__).parent

def field(key, label, hint='', kind='text', essential=False, options=None):
    return dict(key=key, label=label, hint=hint, kind=kind, essential=essential, options=options or [])

GROUPS = [
    ('company','شرکت و راه ارتباطی','برای صفحه درباره ما، تماس و اعتماد مشتری.', 'design.html#journey',[
        field('company_name','نام شرکت و نام تجاری سایت','نام فارسی و انگلیسی؛ نامی که روی سربرگ و سایت نمایش داده می‌شود.',essential=True),
        field('company_story','معرفی کوتاه و مزیت شرکت','حوزه فعالیت، سابقه، واردات، نمایندگی‌ها و مزیتی که بتوان برای آن مدرک ارائه کرد.','textarea'),
        field('contact_person','نماینده کارفرما و راه تماس پروژه','نام، سمت و یک راه ارتباطی برای هماهنگی و تأیید تصمیم‌ها.',essential=True),
        field('public_contacts','راه‌های تماس قابل انتشار','تلفن فروش، تلفن ثابت، ایمیل رسمی، واتساپ و شبکه‌های اجتماعی؛ مشخص کنید کدام عمومی باشد.','textarea',True),
        field('addresses','آدرس دفتر، فروشگاه و انبار','آدرس کامل، شهر، کدپستی و لینک موقعیت روی نقشه؛ محل مراجعه مشتری و نشانی غیرقابل انتشار را جدا کنید.','textarea',True),
        field('working_hours','ساعت کاری و زمان پاسخ‌گویی','روزهای کاری، تعطیلات و زمان معمول پاسخ به استعلام.'),
        field('company_proof','مدارک قابل نمایش و پروژه‌های انجام‌شده','مجوز، گواهی، نمایندگی معتبر، سوابق پروژه و مشتریانی که اجازه ذکر نام یا لوگویشان را دارید.','textarea'),
    ]),
    ('catalog','تعداد کالا و دسته‌بندی','مبنای منو، لیست کالا، فیلتر و حجم ورود اطلاعات.', 'woodmart-templates.html#gallery',[
        field('product_count','تعداد مدل‌ها و کالاها','تقریبی هم کافی است؛ تعداد مدل پایه و تعداد تنوع قابل فروش را جدا بگویید. مثلاً ۸۰ مدل و ۲۴۰ ترکیب سطح مقطع/طول.',essential=True),
        field('launch_catalog','کالاهای نسخه اول و تعداد مورد انتظار در آینده','چه تعداد برای شروع وارد سایت شود؟ چه دسته‌هایی بعداً اضافه می‌شوند؟','textarea'),
        field('categories','دسته‌بندی اصلی و زیرشاخه‌ها','مثال: کابل صنعتی ← قدرت، کنترل، ابزار دقیق؛ کابل شبکه ← مسی، فیبر؛ فقط گروه‌هایی که واقعاً می‌فروشید.','textarea',True),
        field('brands','برندها، کشور و وضعیت نمایندگی','برند وارداتی یا داخلی، نمایندگی رسمی/فروشنده، سند قابل نمایش، موجودی یا تأمین سفارشی.','textarea',True),
        field('priority_products','۵ تا ۱۰ مدل مهم برای شروع','مدل پرفروش، سودآور یا اولویت‌دار؛ اگر مشخص نیست «نیاز به بررسی» بنویسید.','textarea'),
        field('variants','تنوع هر کالا','تعداد رشته، سطح مقطع، طول، رنگ، شیلد، زره، Cat، نوع فیبر یا بسته‌بندی؛ کدام ترکیب قیمت/موجودی جدا دارد؟','textarea'),
        field('filters','ویژگی‌های لازم برای جست‌وجو و فیلتر','کاربرد، برند، سایز، ولتاژ، جنس هادی، استاندارد و ...؛ ویژگی قابل فیلتر را از توضیح فنی جدا کنید.','textarea'),
        field('units','واحد فروش و حداقل سفارش','متر، حلقه، قرقره یا عدد؛ طول بسته، حداقل سفارش، امکان برش و ضرایب سفارش را مشخص کنید.','textarea',True),
        field('catalog_source','اطلاعات فعلی کالا کجاست؟','اکسل، نرم‌افزار انبار، کاتالوگ یا سایت قبلی؟ مسئول آماده‌سازی عنوان، SKU، مشخصات، عکس و دیتاشیت کیست؟','textarea'),
    ]),
    ('sales','قیمت، موجودی و روش فروش','تعیین می‌کند فروشگاه و استعلام چگونه اجرا شوند.', 'woodmart-templates.html#pricing',[
        field('sales_model','روش فروش سایت','روش اصلی را انتخاب کنید؛ جزئیات دسته‌های متفاوت را در سؤال بعد بنویسید.','select',True,['خرید آنلاین با قیمت','استعلام و پیش‌فاکتور','ترکیبی: قیمت برای بعضی کالاها، استعلام برای بقیه','هنوز تصمیم نگرفته‌ایم']),
        field('sales_exceptions','قواعد متفاوت برای دسته یا برند','چه کالاهایی خرید آنلاین، قیمت پس از ورود یا فقط استعلام داشته باشند؟','textarea'),
        field('price_rules','مبنای نمایش و تغییر قیمت','تومان یا ریال، مالیات، قیمت متری یا بسته‌ای، عمده/همکار، تعداد خرید و اعتبار قیمت روز.','textarea',True),
        field('price_owner','مسئول قیمت و موجودی','چه کسی، با چه تناوبی و از چه منبعی قیمت را تغییر می‌دهد؟ تغییر تکی، گروهی یا اتصال نرم‌افزار؟',essential=True),
        field('stock_rules','وضعیت موجودی و زمان تأمین','موجود، ناموجود، در راه یا سفارشی؛ نمایش تعداد دقیق لازم است؟ زمان تأمین وارداتی و جایگزین مدل چیست؟','textarea'),
        field('quote_process','مراحل استعلام و پیش‌فاکتور','چه اطلاعاتی از خریدار بگیریم؟ مسئول پاسخ، زمان پاسخ، تأیید قیمت، تاریخ اعتبار و قالب سربرگ.','textarea'),
        field('shipping','ارسال و تحویل','شهرهای تحت پوشش، باربری/پیک، هزینه و مسئول محاسبه، تحویل حضوری، ارسال قرقره و سفارش حجیم.','textarea'),
        field('returns','قواعد ضمانت، برش و مرجوعی','اصالت، گارانتی، کابل برش‌خورده، کالای سفارشی و خسارت حمل؛ متن نهایی سیاست‌ها را چه کسی تأیید می‌کند؟','textarea'),
    ]),
    ('audience','مشتری و بازار هدف','برای اولویت طراحی، محتوا و سئو.', 'seo-roadmap.html#paths',[
        field('customers','مشتری اصلی شما کیست؟','پیمانکار، کارخانه، همکار فروشنده، شبکه‌کار یا مصرف‌کننده؟ اولویت را بگویید.','textarea',True),
        field('target_regions','بازار جغرافیایی و زبان‌ها','شهرهای اصلی، فروش سراسر ایران یا صادرات؛ زبان فارسی تنها یا زبان دوم؟',essential=True),
        field('buying_questions','مشتری قبل از خرید چه سؤال‌هایی دارد؟','قیمت، استاندارد، اصالت، موجودی، جایگزین مدل، متراژ، زمان تأمین؛ نمونه سؤال‌های فروش را بنویسید.','textarea'),
        field('seo_priority','موضوع و مدل‌های مهم برای سئو','نام‌هایی که مشتری واقعاً جست‌وجو می‌کند؛ کدام گروه ارزش فروش یا اولویت تجاری بیشتری دارد؟','textarea'),
        field('rivals','رقبای موردنظر و دلیل انتخاب','لینک سایت‌ها؛ در کدام بخش از نظر شما خوب‌اند و چه خلائی دارند؟','textarea'),
        field('content_owner','مسئول بررسی فنی و تولید محتوا','چه کسی مشخصات، مقالات و ادعاها را تأیید می‌کند؟ امکان تهیه عکس و محتوای اختصاصی هست؟'),
    ]),
    ('identity','هویت بصری و صفحات','برای انتخاب طرح قابل اجرای وودمارت و المنتور.', 'woodmart-templates.html#gallery',[
        field('design_choice','طرح یا سبک مورد پسند','نام طرح در گالری وودمارت یا لینک نمونه؛ بگویید چه بخش آن را دوست دارید.','textarea',True),
        field('brand_assets','لوگو، رنگ و فونت برند','فایل لوگوی اصلی، کد رنگ، راهنمای برند؛ اگر موجود نیست مشخص کنید طراحی هویت هم لازم است.','textarea'),
        field('page_list','صفحه‌های موردنیاز','خانه، همه کالاها، محصول، برند، درباره، تماس، مقالات، استعلام، حساب مشتری، پروژه‌ها و ...','textarea'),
        field('home_priority','در صفحه اول چه چیزهایی اولویت دارد؟','برندها، جست‌وجوی مدل، دسته‌ها، پیشنهاد ویژه، اسلایدر، پروژه‌ها یا درخواست تأمین؟','textarea'),
        field('photos','عکس و مدارک محصول و شرکت','عکس واقعی کابل/انبار/دفتر، دیتاشیت، گواهی و اجازه استفاده از عکس و لوگوی برندها؛ نام فایل یا وضعیت آماده‌سازی.','textarea'),
        field('design_avoid','محدودیت و مواردی که نمی‌پسندید','رنگ، چیدمان، انیمیشن، حجم تصویر، سبک متن یا هر الزام برند.','textarea'),
    ]),
    ('customer','حساب مشتری و امکانات فروش','نیازها را پیش از انتخاب افزونه و توسعه مشخص کنیم.', 'security.html#customer',[
        field('account_need','حساب مشتری لازم است؟','این انتخاب سؤال‌های تکمیلی پنل را نشان می‌دهد.','select',False,['بله، از نسخه اول','در مرحله بعد','خیر','نیاز به تصمیم']),
        field('login_method','روش ورود موردنظر','برای کد ورود، سرویس ایمیل یا پیامک و هزینه ارسال هم باید تعیین شود.','select',False,['ایمیل و گذرواژه','پیامک و کد یک‌بارمصرف','ایمیل و پیامک','نیاز به پیشنهاد']),
        field('account_features','امکانات پنل مشتری','دیدن سفارش و پیش‌فاکتور، دانلود سند، ثبت درخواست، تکرار سفارش، پیگیری وضعیت یا چند کاربر برای شرکت؟','textarea'),
        field('quote_access','قواعد پیش‌فاکتور و دسترسی','مشتری فقط سند خودش؛ نقش مسئول فروش، تأیید قیمت، نسخه جدید سند و اشخاص مجاز در حساب سازمانی.','textarea'),
        field('staff_roles','کاربران داخل شرکت','تعداد مدیر، مسئول فروش، قیمت‌گذار، انبار و محتوا؛ هر نقش چه کارهایی مجاز است انجام دهد؟','textarea'),
        field('notifications','چه پیام‌هایی باید ارسال شود؟','ثبت استعلام، صدور سند، تغییر وضعیت یا آماده‌شدن سفارش؛ پیامک/ایمیل و مسئول پاسخ‌گویی.','textarea'),
    ]),
    ('online','پرداخت و اتصال‌ها','فقط برای امکاناتی که واقعاً در دامنه پروژه قرار می‌گیرند.', 'build-paths.html#routes',[
        field('payment','روش پرداخت موردنیاز','درگاه آنلاین، انتقال بانکی، پرداخت پس از تأیید یا فروش اعتباری؛ پرداخت اعتباری نیاز به قواعد مستقل دارد.','textarea'),
        field('invoice','فاکتور و اطلاعات حقوقی خریدار','فاکتور رسمی/غیررسمی، اطلاعات شرکت خریدار، شرایط مالیات و قالب سند؛ اطلاعات ضروری را مشخص کنید.','textarea'),
        field('integrations','اتصال به سیستم دیگر','نام نرم‌افزار حسابداری/انبار/CRM، چه داده‌ای منتقل شود و آیا API یا خروجی اکسل دارد؟','textarea'),
        field('providers','سرویس‌های تهیه‌شده یا موردنیاز','درگاه، پیامک، ایمیل تراکنشی، حمل یا CRM؛ فقط نام سرویس و وضعیت قرارداد، نه کلید و رمز.','textarea'),
        field('ai_content','محتوا و اتوماسیون با n8n و AI','آیا نیاز دارید؟ منبع اطلاعات، بررسی انسانی، مسئول تأیید و بودجه محتوا را تعیین کنید.','textarea'),
    ]),
    ('technical','دامنه، سایت قبلی و نگه‌داری','برای راه‌اندازی و حفظ آدرس‌ها و دارایی‌های فعلی.', 'security.html#operations',[
        field('domain','دامنه فعلی یا نام دامنه پیشنهادی','مالک دامنه، تاریخ تمدید و وضعیت ایمیل سازمانی؛ اگر دامنه ندارید نام پیشنهادی.'),
        field('old_site','سایت قبلی و اطلاعات قابل انتقال','لینک سایت؛ تعداد کالا، نوشته، مشتری و سفارش؛ کدام آدرس‌های قبلی باید حفظ/منتقل شوند؟','textarea'),
        field('hosting','وضعیت هاست و قالب','نام میزبان، پلن و مالکیت لایسنس وودمارت/المنتور؛ رمز یا اطلاعات ورود اینجا نوشته نشود.'),
        field('analytics','ابزارهای آمار و سئوی قبلی','Search Console، آنالیتیکس و داده موجود؛ فقط وضعیت و مالک حساب را بنویسید، دسترسی جداگانه اعطا شود.'),
        field('maintenance','مسئول نگه‌داری و آموزش','چه کسی کالا، محتوا و قیمت را مدیریت می‌کند؟ آموزش، پشتیبانی و پشتیبان‌گیری با کدام تیم است؟','textarea'),
        field('privacy','اطلاعات مشتری و سیاست‌های قابل انتشار','چه داده‌ای لازم دارید و چه کسی متن حریم خصوصی، شرایط خرید و رضایت تماس را تأیید می‌کند؟','textarea'),
    ]),
    ('delivery','بودجه، زمان و دامنه تحویل','برای تبدیل پاسخ‌ها به برآورد و برنامه اجرا.', 'build-paths.html#routes',[
        field('budget','بازه بودجه و هزینه‌های دوره‌ای','بودجه ساخت، محتوا/ورود کالا و بودجه ماهانه سئو/نگه‌داری؛ هزینه هاست، لایسنس و پیامک را جدا در نظر بگیرید.',essential=True),
        field('deadline','زمان مطلوب انتشار و دلیل آن','تاریخ یا بازه و وابستگی به نمایشگاه، کمپین یا رویداد؛ اگر آزاد است مشخص کنید.',essential=True),
        field('launch_must','امکانات ضروری نسخه اول','حداکثر ۵ نیاز اصلی؛ باقی موارد را برای فاز بعد مشخص کنید.','textarea',True),
        field('approval','مسئول تأیید نهایی و معیار تحویل','تأیید طرح، اطلاعات کالا، قیمت و محتوای فنی با چه کسانی است؟ چه چیزی نشانه پذیرش نسخه اول است؟','textarea'),
        field('asset_dates','زمان آماده‌شدن اطلاعات و فایل‌ها','مسئول و موعد آماده‌سازی لوگو، فهرست کالا، عکس، توضیح فنی و متن درباره/تماس.','textarea'),
        field('other','خواسته‌ها و سؤال‌های باقی‌مانده','مواردی که در سؤال‌های بالا پوشش داده نشده است.','textarea'),
    ]),
]

def render_field(f):
    key=f['key']; label=escape(f['label']); hint=escape(f['hint'])
    tag='<span class="cb-essential">برای شروع</span>' if f['essential'] else '<span class="cb-optional">تکمیلی</span>'
    attrs=f'id="cb-{key}" name="{key}" data-label="{label}" aria-describedby="hint-{key}"'+(' data-essential="true"' if f['essential'] else '')
    if f['kind']=='textarea':
        control=f'<textarea {attrs} rows="3" maxlength="5000" placeholder="پاسخ یا وضعیت فعلی را بنویسید…"></textarea>'
    elif f['kind']=='select':
        control=f'<select {attrs}><option value="">انتخاب کنید…</option>'+''.join(f'<option>{escape(o)}</option>' for o in f['options'])+'</select>'
    else:
        control=f'<input {attrs} type="text" maxlength="1500" placeholder="پاسخ شما…">'
    return f'<div class="cb-field"><label for="cb-{key}"><span>{label}</span>{tag}</label><small id="hint-{key}">{hint}</small>{control}</div>'

panels=[]
for i,(slug,title,lead,related,fields) in enumerate(GROUPS,1):
    count=len(fields)
    body=''.join(render_field(f) for f in fields)
    if slug=='customer':
        first=render_field(fields[0]); rest=''.join(render_field(f) for f in fields[1:4])
        staff=''.join(render_field(f) for f in fields[4:])
        body=first+f'<div class="cb-account-fields cb-fields">{rest}</div><p id="cb-account-note" class="cb-inline-note" hidden>پنل مشتری در دامنه فعلی نیست؛ اگر بعداً اضافه شود، ورود و دسترسی اسناد دوباره بررسی می‌شود.</p>'+staff
    panels.append(f'<section class="cb-section" id="brief-{slug}"><details class="cb-panel"'+(' open' if i<=2 else '')+f'><summary><span class="cb-section-num">{i:02}</span><span class="cb-section-title"><strong>{title}</strong><small>{lead}</small></span><span class="cb-count" data-group="{slug}">۰ / {count}</span><span class="cb-chevron" aria-hidden="true">＋</span></summary><div class="cb-panel-body"><div class="cb-fields">{body}</div><a class="cb-related" href="{related}">گزارش مرتبط با این تصمیم ↗</a></div></details></section>')

nav_items=[('index.html','نقشه راه'),('competitors.html','رقبا'),('strategy.html','راهبرد'),('build-paths.html','مسیر ساخت'),('design.html','طراحی'),('templates.html','تمپلیت‌ها'),('woodmart-templates.html','وودمارت'),('security.html','امنیت'),('seo-roadmap.html','سئو'),('client-brief.html','اطلاعات کارفرما')]
nav=''.join(f'<a href="{url}"'+(' aria-current="page"' if url=='client-brief.html' else '')+f'>{label}</a>' for url,label in nav_items)
rail=''.join(f'<a href="#brief-{slug}"><span>{i:02}</span>{title}</a>' for i,(slug,title,*_) in enumerate(GROUPS,1))
total=sum(len(g[-1]) for g in GROUPS)
essential=sum(f['essential'] for g in GROUPS for f in g[-1])
html=f'''<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>اطلاعات موردنیاز کارفرما | طراحی فروشگاه کابل</title><meta name="description" content="پرسش‌نامه شروع طراحی فروشگاه کابل: تعداد محصولات، دسته‌بندی، برند، تماس، قیمت، فروش، پنل مشتری و برنامه اجرا."><link rel="stylesheet" href="reports-site.css"><link rel="stylesheet" href="client-brief.css?v=brief-1"></head><body class="client-brief-page">
<nav class="site-nav" aria-label="ناوبری اصلی"><div class="wrap"><a class="site-brand" href="index.html"><span class="brand-mark" aria-hidden="true">◎</span><span>پرونده بازار کابل</span></a><div class="nav-links">{nav}</div><div class="nav-actions"><button class="icon-btn" id="theme-toggle" type="button" aria-label="تغییر تم">☀</button></div></div><div class="reading-bar" id="reading-bar" aria-hidden="true"></div></nav>
<header class="cb-hero"><div class="wrap"><div><span class="eyebrow">قبل از انتخاب طرح و شروع اجرا</span><h1>سایت را با اطلاعات واقعی<br><em>کسب‌وکار شما طراحی کنیم.</em></h1><p>این پرسش‌نامه مشخص می‌کند چه چیزی می‌فروشید، مشتری چگونه خرید می‌کند و سایت باید چه امکاناتی داشته باشد. پاسخ تقریبی هم برای شروع مفید است؛ موارد نامشخص را «نیاز به تصمیم» بنویسید.</p><div class="hero-actions"><a class="primary" href="#questionnaire">شروع تکمیل اطلاعات ←</a><a class="secondary" href="index.html#client-inputs">بازگشت به نقشه راه</a></div></div><aside class="cb-hero-card"><span>خروجی این فرم</span><h2>شرح روشن پروژه</h2><p>ساختار کالاها + قواعد فروش + طرح منتخب + دامنه نسخه اول</p><div><b>{len(GROUPS)}</b><small>بخش کوتاه</small><b>{essential}</b><small>پاسخ مهم برای شروع</small></div></aside></div></header>
<main class="wrap page-main"><section class="cb-start" id="start-here"><div><span class="kicker">از اطلاعات پایه شروع کنیم</span><h2>لازم نیست همه جواب‌ها از قبل آماده باشند</h2><p>اول موارد «برای شروع» را کامل کنید؛ بعد جزئیات را با مسئول فروش، انبار و مدیر شرکت جمع‌بندی کنیم. علامت تکمیل فقط یعنی پاسخی نوشته شده و به معنی تأیید آن نیست.</p></div><aside><strong>پاسخ‌ها به سرور ارسال نمی‌شوند.</strong><p>با دکمه ذخیره، نسخه‌ای در همین مرورگر نگه می‌دارید. برای تحویل، خلاصه را دانلود و از مسیر هماهنگ‌شده ارسال کنید. رمز، کلید سرویس و اطلاعات محرمانه مشتریان در این فرم وارد نشود.</p></aside></section>
<div class="cb-layout" id="questionnaire"><aside class="cb-sidebar"><div class="cb-progress-head"><strong>اطلاعات پروژه</strong><span id="cb-percent">۰٪</span></div><progress id="cb-progress" max="{total}" value="0" aria-label="تعداد پاسخ‌های تکمیل‌شده"></progress><p id="cb-progress-label">۰ از {total} سؤال پاسخ دارد</p><p id="cb-essential-label">۰ از {essential} مورد شروع پاسخ دارد</p><nav aria-label="بخش‌های پرسش‌نامه">{rail}<a href="#brief-files"><span>＋</span>فایل‌های لازم</a><a href="#brief-summary"><span>↗</span>خلاصه و تحویل</a></nav><button type="button" class="btn btn-primary" id="cb-save">ذخیره در این مرورگر</button><span id="cb-save-status" role="status">هنوز ذخیره نشده است</span></aside>
<div class="cb-form-area"><div class="cb-form-tools"><span>برای تکمیل سریع‌تر:</span><button type="button" id="cb-starting-filter" aria-pressed="false">فقط سؤال‌های شروع</button></div><form id="client-brief-form" autocomplete="off"><noscript><p class="cb-inline-note">برای ذخیره پاسخ و تهیه خلاصه، جاوااسکریپت مرورگر فعال باشد.</p></noscript>{''.join(panels)}</form></div></div>
<section class="section" id="brief-files"><div class="section-head"><div><div class="kicker">چیزهایی که همراه پاسخ‌ها تحویل می‌دهیم</div><h2>فهرست فایل‌های موردنیاز</h2><p>فایل‌ها از مسیر هماهنگ‌شده ارسال شوند؛ این صفحه محل آپلود نیست.</p></div></div><div class="cb-files"><article><span>۰۱ / برند و شرکت</span><h3>لوگو و محتوای معرفی</h3><p>لوگوی اصلی، رنگ سازمانی، متن درباره شرکت، عکس دفتر/انبار و اطلاعات تماس تأییدشده.</p></article><article><span>۰۲ / اطلاعات کالا</span><h3>یک فهرست مرتب محصولات</h3><p>مدل، SKU، برند، دسته، ویژگی‌ها، واحد فروش، قیمت، موجودی و وضعیت عرضه. برای شروع ۵ کالای نمونه کامل کافی است.</p></article><article><span>۰۳ / مدارک و تصاویر</span><h3>عکس و دیتاشیت واقعی</h3><p>نام فایل مطابق SKU، دیتاشیت و گواهی، سند نمایندگی قابل نمایش و مجوز استفاده از عکس‌ها و لوگوها.</p></article><article><span>۰۴ / فرآیند فروش</span><h3>نمونه سند و قواعد</h3><p>سربرگ و پیش‌فاکتور بدون اطلاعات مشتری، قواعد ارسال، ضمانت و قیمت؛ مسئول و موعد تکمیل هر مورد.</p></article></div></section>
<section class="section cb-summary" id="brief-summary"><div class="section-head"><div><div class="kicker">جمع‌بندی قابل تحویل به تیم طراحی</div><h2>پاسخ‌ها را به شرح پروژه تبدیل کنیم</h2><p>خلاصه شامل پاسخ‌ها و موارد باقی‌مانده است؛ تأیید دامنه، هزینه و زمان اجرا در جلسه جمع‌بندی انجام می‌شود.</p></div></div><div class="cb-summary-actions"><button class="btn btn-primary" type="button" id="cb-download">دانلود خلاصه پاسخ‌ها</button><button class="btn btn-secondary" type="button" id="cb-copy">کپی خلاصه</button><button class="btn btn-secondary" type="button" id="cb-print">چاپ خلاصه</button><button class="cb-clear" type="button" id="cb-reset">پاک‌کردن پاسخ‌ها…</button></div><div id="cb-reset-confirm" hidden class="cb-reset-confirm"><p>همه پاسخ‌های فرم و نسخه ذخیره‌شده در این مرورگر پاک شوند؟</p><button type="button" class="btn btn-secondary" id="cb-reset-cancel">انصراف</button><button type="button" class="btn btn-secondary" id="cb-reset-yes">بله، پاک شود</button></div><p id="cb-export-status" role="status"></p><details class="cb-summary-preview"><summary>مشاهده خلاصه و سؤال‌های باقی‌مانده</summary><pre id="cb-summary-text">خلاصه پس از فعال‌شدن فرم نمایش داده می‌شود.</pre></details><div class="cb-next"><strong>بعد از دریافت اطلاعات</strong><p>دسته‌بندی‌ها و نمونه محصول تأیید می‌شوند؛ سپس طرح وودمارت، قواعد فروش و دامنه نسخه اول به برآورد و برنامه اجرا تبدیل می‌شوند.</p><a href="index.html#step-design">بازگشت به مرحله انتخاب طرح ←</a></div></section></main>
<footer class="site-footer"><div class="wrap"><strong>اطلاعات کارفرما · فروشگاه کابل</strong><span>۱۲ مهر ۱۴۰۵ · پرسش‌نامه شروع طراحی</span></div></footer><script src="reports-site.js"></script><script src="client-brief.js?v=brief-1"></script></body></html>'''
(ROOT/'client-brief.html').write_text(html,encoding='utf-8')
print(f'Client brief generated: {total} questions, {essential} starting items')
