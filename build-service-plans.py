"""Render the Persian service proposal from one structured, editable source."""
from pathlib import Path
from html import escape as esc
import copy
import json

ROOT=Path(__file__).parent
D=json.loads((ROOT/'service-plans.json').read_text(encoding='utf-8'))
P=D['plans']
FA=str.maketrans('0123456789','۰۱۲۳۴۵۶۷۸۹')
def fa(value):return str(value).translate(FA)
def ul(items):return '<ul>'+''.join('<li>'+esc(x)+'</li>' for x in items)+'</ul>'
def section(id,title,body,kicker='شرح خدمات'):
    return f'<section class="section" id="{id}"><div class="section-head"><div><div class="kicker">{kicker}</div><h2>{title}</h2></div></div>{body}</section>'

for p in P:
    if sum(row[1] for row in p['breakdown'])!=p['price']:raise ValueError('Price breakdown does not reconcile: '+p['id'])
    s=p['seo']
    if s['products']+s['categories']+s['brands']!=s['pages']:raise ValueError('SEO scope does not reconcile: '+p['id'])

def features(p):
    f=copy.deepcopy(p['features'])
    if p['id'] in ['seo','growth']:
        inherited=copy.deepcopy(P[1]['features'])
        inherited['حساب و کارکنان']=[x for x in inherited['حساب و کارکنان'] if not x.startswith('قیمت‌گذاری دستی یا')]
        for k,v in f.items():inherited.setdefault(k,[]).extend(v)
        f=inherited
    if p['id']=='growth':
        for k,v in P[2]['features'].items():
            f.setdefault(k,[]).extend(x for x in v if not x.startswith('تمام ') and not x.startswith('حساب‌ها و نقش‌ها'))
    return f

def acceptance_for(p):
    items=copy.deepcopy(p['acceptance'])
    if p['id'] in ['seo','growth']:items=P[1]['acceptance'][:5]+items
    if p['id']=='growth':items+=P[2]['acceptance'][1:3]
    return items

def detail(p,i):
    s=p['seo']
    fields={**D['common'],**features(p)}
    blocks=''.join(f'<details class="sp-detail"'+(' open' if k in ['فروش و استعلام','حساب و کارکنان'] else '')+f'><summary>{esc(k)}</summary>{ul(v)}</details>' for k,v in fields.items())
    costs=''.join(f'<tr><td>{esc(label)}</td><td>{fa(value)}</td></tr>' for label,value in p['breakdown'])
    acceptance=acceptance_for(p)
    return f'''<article class="sp-plan-detail" id="plan-{p['id']}" data-plan="{p['id']}">
<div class="sp-detail-head"><div><span class="kicker">پلن {fa(i)} / {esc(p['name'])}</span><h2>{esc(p['subtitle'])}</h2><p>{esc(p['fit'])}</p></div><div class="sp-total"><b>{fa(p['price'])}</b><span>میلیون تومان · ساخت اولیه</span><small>{p['days']} روز کاری</small></div></div>
<div class="sp-design-note"><strong>دامنه دقیق طراحی</strong><p>{esc(p['design'])}</p></div>
<div class="sp-seo-scope"><div><span class="kicker">سئوی داخل همین مبلغ</span><h3>{fa(s['pages'])} صفحه منتخب + {fa(s['articles'])} مقاله آغاز</h3><p>{esc(s['description'])}</p></div><div class="sp-seo-counts"><span><b>{fa(s['products'])}</b>مدل</span><span><b>{fa(s['categories'])}</b>دسته</span><span><b>{fa(s['brands'])}</b>برند</span><span><b>{fa(s['clusters'])}</b>خوشه</span></div><small>{esc(s['followup'])}؛ پیگیری فنی اولیه داخل هزینه ساخت است، تولید و بهینه‌سازی ماهانه جداست.</small></div>
<div class="sp-detail-columns"><div>{blocks}<details class="sp-detail"><summary>خدمات خارج از این پلن</summary>{ul(p['excluded'])}<p>هزینه‌های مشترک خارج از قرارداد در <a href="#boundaries">مرز تعهدات</a> آمده‌اند.</p></details></div><aside><div class="sp-cost"><h3>این مبلغ چگونه تقسیم شده؟</h3><table><thead><tr><th>کار</th><th>میلیون</th></tr></thead><tbody>{costs}</tbody><tfoot><tr><th>جمع دقیق</th><th>{fa(p['price'])}</th></tr></tfoot></table><p>سهم هر بخش برای شفافیت پکیج است؛ قیمت خرید تکیِ همان ماژول محسوب نمی‌شود.</p></div><div class="sp-acceptance"><h3>چه چیزی مبنای تحویل است؟</h3>{ul(acceptance)}</div></aside></div>
<div class="sp-plan-actions"><a class="btn btn-secondary" href="service-plan-{p['id']}.txt" download>دانلود شرح کامل این پلن ↓</a><a class="btn btn-secondary" href="client-brief.html#brief-catalog">اطلاعات لازم از کارفرما</a><a class="btn btn-primary" href="#budget" data-budget-plan="{p['id']}">محاسبه بودجه این پلن ←</a></div></article>'''

nav='<div class="nav-links">'+(ROOT/'build-paths.html').read_text('utf-8').split('<div class="nav-links">',1)[1].split('</div>',1)[0]+'</div>'
nav=nav.replace(' aria-current="page"','')
if 'service-plans.html' not in nav:nav=nav.replace('<a href="design.html"','<a href="service-plans.html" aria-current="page">پلن‌ها و قیمت</a><a href="design.html"',1)
else:nav=nav.replace('<a href="service-plans.html"','<a href="service-plans.html" aria-current="page"',1)

cards=''.join(f'''<a class="sp-plan-card {'sp-recommended' if p['recommended'] else ''}" href="#plan-{p['id']}" data-plan-select="{p['id']}"><span class="sp-card-label">پلن {fa(i+1)}{' · پیشنهاد شروع' if p['recommended'] else ''}</span><h2>{esc(p['name'])}</h2><p>{esc(p['subtitle'])}</p><div class="sp-card-price"><b>{fa(p['price'])}</b><span>میلیون تومان</span></div><div class="sp-card-facts"><span>{p['days']} روز کاری</span><span>{fa(p['seo']['pages'])} صفحه سئو</span><span>{fa(p['seo']['articles'])} مقاله آغاز</span></div><strong>شرح کامل و معیار تحویل ←</strong></a>''' for i,p in enumerate(P))
rows=[('قیمت ساخت اولیه',[fa(p['price'])+' میلیون' for p in P]),('روش طراحی',['شخصی‌سازی Layout آماده','یک طرح منتخب با المنتور','همان طرح حرفه‌ای','همان طرح + داشبورد']),('داده و کالا',['۱۵۰ SKU آماده']*4),('خرید و استعلام',['استعلام؛ بدون درگاه','خرید + استعلام','خرید + استعلام','خرید + استعلام']),('ورود مشتری',['ایمیل/گذرواژه','ایمیل + OTP پیامک','ایمیل + OTP پیامک','ایمیل + OTP پیامک']),('قیمت‌گذاری',['دستی / CSV','دستی / گروهی با سابقه','سه خانواده فرمول کنترل‌شده','همان موتور پلن سوم']),('پیش‌فاکتور',['PDF خصوصی پایه','نسخه، اعتبار و گردش سند','همان گردش حرفه‌ای','همان گردش حرفه‌ای']),('سئوی فنی پایه',['شامل']*4),('صفحات منتخب با اصلاح اختصاصی',[fa(p['seo']['pages']) for p in P]),('راهنما/مقاله اولیه',[fa(p['seo']['articles']) for p in P]),('سئوی ماهانه',['قرارداد جدا']*4),('زبان دوم',['گزینه اضافه']*4),('n8n و AI',['گزینه جدا','گزینه جدا','گزینه جدا','سه گردش با بازبینی انسانی'])]
matrix='<div class="sp-table"><table><thead><tr><th>خروجی قابل مقایسه</th>'+''.join('<th>'+esc(p['name'])+'</th>' for p in P)+'</tr></thead><tbody>'+''.join('<tr><th>'+esc(label)+'</th>'+''.join('<td>'+esc(value)+'</td>' for value in values)+'</tr>' for label,values in rows)+'</tbody></table></div>'
seo_graph=''.join(f'<div class="sp-scope-row"><span>{esc(p["name"])}</span><div><i style="width:{p["seo"]["pages"]*2}%"></i></div><b>{fa(p["seo"]["pages"])} صفحه</b></div>' for p in P)
seo_layers='''<div class="sp-layers"><article><span>01 / زیرساخت</span><h3>در همه پلن‌ها</h3><p>فنی، URL، sitemap، متا، schema معتبر، سیاست ایندکس، تصویر و کش، Search Console و سنجش استعلام. قالب متادیتا برای تمام ۱۵۰ SKU.</p></article><article><span>02 / صفحات منتخب</span><h3>۱۰، ۲۰، ۳۵ یا ۵۰ صفحه</h3><p>انتخاب بر اساس سبد واقعی و قصد خرید؛ اصلاح متن و داده، عنوان و متا و لینک داخلی. در پلن‌های بالاتر ۲، ۴ یا ۶ راهنما برای آغاز.</p></article><article><span>03 / رشد پس از انتشار</span><h3>قرارداد ماهانه</h3><p>استفاده از داده گوگل و فروش، اصلاح صفحات، تولید راهنمای تازه، افزایش پوشش و گزارش استعلام‌های واجد شرایط؛ خرید رسانه با بودجه جدا.</p></article></div>'''
monthly_cards=''.join(f'<article class="sp-monthly-card"><span class="kicker">خدمات ماهانه</span><h3>{esc(m["name"])}</h3><b>{fa(m["price"])} <small>میلیون / ماه</small></b><div class="sp-monthly-counts"><span>{fa(m["pages"])} صفحه</span><span>{fa(m["articles"])} راهنما</span><span>{fa(m["hours"])} ساعت اصلاح فنی</span></div><p>{esc(m["scope"])}</p></article>' for m in D['monthly'][1:])
addons=''.join(f'<article class="sp-addon"><div><h3>{esc(a["name"])}</h3><b>{fa(a["price"])} میلیون</b></div><p>{esc(a["description"])}</p></article>' for a in D['addons'])
payment=''.join(f'<article><b>{fa(percent)}٪</b><h3>{esc(label)}</h3></article>' for label,percent in D['payments'])
steps=[('۱ · نیاز و داده','تأیید یک طرح، نوع فروش، سقف SKU، دامنه نقش‌ها و ورودی محتوا؛ نهایی‌شدن پیشنهاد و پرداخت شروع.'),('۲ · طرح و کاتالوگ','طرح منتخب و یک محصول/دسته نمونه تأیید می‌شوند؛ ورود CSV، مسیر استعلام و صفحات هدف آماده می‌شوند.'),('۳ · قابلیت و سئو','حساب و سند، پرداخت و قیمت طبق پلن ساخته می‌شوند؛ صفحات منتخب، محتوا و چک‌لیست سئوی فنی تکمیل می‌شوند.'),('۴ · پذیرش و انتشار','شاهد سناریوهای هر پلن، اصلاحات، پشتیبان و بازیابی، اتصال ابزار سنجش، انتشار و آموزش تحویل می‌شوند.')]
timeline='<div class="sp-timeline">'+''.join('<article><span>'+esc(title)+'</span><p>'+esc(text)+'</p></article>' for title,text in steps)+'</div>'
budget=f'''<div class="sp-budget"><form id="sp-budget-form"><div class="sp-budget-fields"><label>پلن ساخت<select name="plan">{''.join('<option value="'+p['id']+'"'+(' selected' if p['id']=='commerce' else '')+'>'+esc(p['name'])+' · '+fa(p['price'])+' میلیون</option>' for p in P)}</select></label><label>خدمات ماهانه<select name="monthly">{''.join('<option value="'+m['id']+'">'+esc(m['name'])+' · '+fa(m['price'])+' میلیون</option>' for m in D['monthly'])}</select></label><label>دوره بودجه‌بندی<select name="months">{''.join('<option value="'+str(n)+'"'+(' selected' if n==6 else '')+'>'+fa(n)+' ماه</option>' for n in [3,6,12])}</select></label><label>بودجه رسانه ماهانه<select name="media"><option value="0">بدون تخصیص فعلی</option><option value="10">۱۰ میلیون</option><option value="20">۲۰ میلیون</option><option value="30">۳۰ میلیون</option></select></label><label>SKU آماده اضافه<select name="sku"><option value="0">همان سقف ۱۵۰ SKU</option>{''.join('<option value="'+str(n)+'">'+fa(n*50)+' SKU اضافه · '+fa(n*3)+' میلیون</option>' for n in [1,2,3])}</select></label></div><div class="sp-budget-checks"><label><input type="checkbox" name="language">زبان دوم با ترجمه آماده · ۱۵ میلیون</label><label><input type="checkbox" name="pdf">یک قالب PDF اضافه · ۵ میلیون</label><label><input type="checkbox" name="maintenance">فقط نگهداری مستقل · ۵ میلیون در ماه</label></div><p id="sp-maintenance-note">در انتخاب خدمات سئوی ماهانه، نگهداری پایه داخل همان مبلغ است.</p></form><aside class="sp-budget-result" aria-live="polite" aria-atomic="true"><span>برآورد دامنه انتخاب‌شده</span><div><b id="sp-budget-total">۶۵</b><small>میلیون تومان</small></div><dl><dt>ساخت و گزینه‌های یک‌باره</dt><dd id="sp-budget-setup">۶۵</dd><dt>دستمزد ماهانه</dt><dd id="sp-budget-monthly">۰</dd><dt>رسانه ماهانه</dt><dd id="sp-budget-media">۰</dd><dt>دوره</dt><dd id="sp-budget-period">۶ ماه</dd></dl><p id="sp-budget-equation">۶۵ + ۶ × (۰ + ۰) = ۶۵</p><small>هاست، مجوز، پیامک، API، ترجمه انسانی و مالیات احتمالی جدا هستند. این محاسبه پیشنهاد بودجه است و خرید یا ارسال اطلاعات انجام نمی‌دهد.</small></aside></div><noscript><p class="sp-note">محاسبه نمونه: پلن حرفه‌ای ۶۵ + شش ماه رشد حرفه‌ای ۳۵ = ۲۷۵ میلیون؛ رسانه و هزینه سرویس‌ها جدا.</p></noscript>'''

body=section('choose','چهار پلن، با مرز کار و خروجی مشخص','<div class="sp-status"><strong>پیشنهاد قابل ارائه · ۱۳ مهر ۱۴۰۵</strong><span>قیمت‌ها پس از تأیید اطلاعات واقعی کارفرما نهایی می‌شوند.</span></div><div class="sp-plan-grid">'+cards+'</div>','انتخاب سطح اجرا')
body+=section('compare','تفاوت‌ها را در یک جدول ببینید',matrix+'<p class="sp-note">قیمت ساخت یک‌باره است. سئوی اولیه در همین مبلغ انجام می‌شود؛ رتبه، ایندکس تمام صفحات یا درآمد تضمین نمی‌شود. نصب Multisite یا افزونه خاص معیار گران‌ترشدن پلن نیست.</p>','مقایسه دامنه')
body+=section('seo-in-design','در طراحی سایت، دقیقاً چقدر سئو انجام می‌شود؟',seo_layers+'<div class="sp-scope-chart">'+seo_graph+'</div><details class="sp-detail"><summary>سئوی فنی مشترک؛ چک‌لیست داخل تمام پلن‌ها</summary>'+ul(D['common']['سئوی فنی مشترک'])+'</details><p class="sp-note"><strong>صفحه منتخب یعنی کار دستی مشخص روی یک URL.</strong> تعدادهای هر پلن مجموع نهایی‌اند؛ ۲۰ صفحه پلن دوم با ۱۰ صفحه پلن اول جمع نمی‌شود. مقالات اولیه جدا از این شمارش‌اند. صفحات فاقد داده کافی برای ایندکس آماده اعلام نمی‌شوند؛ داده ناقص در گزارش تحویل ثبت می‌شود.</p><div class="sp-related"><a href="seo-roadmap.html#keyword-playbook">نقشه کلمه به صفحه ↗</a><a href="competitors.html#competitors">فرصت‌های رقبا ↗</a><a href="seo-roadmap.html#measurement">معیارهای سنجش ↗</a></div>','سه لایه سئو')
body+=section('details','شرح کامل هر پلن','<div class="sp-detail-toolbar"><p>یک پلن را از کارت‌ها انتخاب کنید؛ تمام جزئیات و مرزهای همان پلن اینجا آمده است.</p><button class="btn btn-secondary" type="button" id="sp-show-all" hidden>نمایش جزئیات همه پلن‌ها</button></div>'+''.join(detail(p,i+1) for i,p in enumerate(P)),'تعهدات و پذیرش')
body+=section('monthly','بعد از تحویل، چه کارهایی ماهانه انجام می‌شود؟','<div class="sp-monthly-grid">'+monthly_cards+'</div><details class="sp-detail" open><summary>مرز خدمات ماهانه و روش گزارش</summary>'+ul(D['monthlyNotes'])+'</details><p class="sp-note">نگهداری مستقل بدون خرید سئو: <strong>۵ میلیون در ماه</strong>؛ همان نگهداری پایه با سقف سه ساعت اصلاح فنی کوچک، بدون تولید محتوا یا توسعه قابلیت جدید. منابع و کیفیت اطلاعات فنی باید توسط کارفرما یا کارشناس معرفی‌شده تأیید شوند.</p>','هزینه مستمر')
body+=section('addons','گزینه‌های اضافه و هزینه‌های بیرونی','<div class="sp-addon-grid">'+addons+'</div><p class="sp-note">زبان دوم امتیاز خودکار سئو ایجاد نمی‌کند. انتخاب ابزار چندزبانه با نیاز و سازگاری تعیین می‌شود؛ Multisite به‌طور پیش‌فرض دیتابیس کاملاً مستقل یا سرعت تضمینی برای هر زبان نمی‌سازد.</p>','دامنه اختیاری')
body+=section('budget','بودجه ساخت و چند ماه خدمات را کنار هم حساب کنید',budget,'محاسبه تعاملی')
body+=section('delivery','مراحل اجرا، پرداخت و مسئول هر ورودی',timeline+'<div class="sp-payment">'+payment+'</div><div class="sp-note"><strong>تحویل قابل سنجش:</strong> معیارهای عمومی و معیارهای هر پلن در نسخه آزمایشی ثبت می‌شوند. تصمیم نهایی درباره انتشار با کارفرماست. شروع روزهای کاری به دریافت داده و تأیید دامنه وابسته است؛ تأخیر و تغییر نیاز در برنامه مشترک ثبت می‌شود.</div>','برنامه تحویل')
body+=section('boundaries','پیش از قرارداد، این موارد باید روشن شوند','<div class="sp-boundary-grid"><details class="sp-detail" open><summary>فرض‌های قیمت</summary>'+ul(D['assumptions'])+'</details><details class="sp-detail" open><summary>هزینه‌ها و پروژه‌های خارج از قیمت</summary>'+ul(D['outside'])+'</details></div><div class="sp-note">نصب افزونه جای معیار پذیرش نیست. در همه پلن‌ها اطلاعات خصوصی باید با کنترل مجوز محافظت شوند؛ noindex یا مخفی‌کردن منو حفاظت دسترسی نیست. ارتقای پلن پیش از شروع با اختلاف قیمت انجام می‌شود؛ پس از شروع، کار انجام‌شده و نیاز به بازسازی جدا برآورد می‌شوند.</div>','تعریف مرزها')
body+=section('references','مبنای فنی و فایل‌های قابل تحویل','<div class="sp-related">'+''.join('<a href="'+url+'" target="_blank" rel="noopener">'+esc(title)+' ↗</a>' for title,url in D['sources'])+'</div><p class="sp-note">این‌ها منابع اصول فنی‌اند؛ قیمت‌ها برآورد پیشنهادی همین پروژه هستند و تعرفه رسمی وردپرس یا گوگل محسوب نمی‌شوند. ادعای پیشی‌گرفتن از رقبا یا رتبه قطعی در پیشنهاد نیست.</p><div class="sp-related"><a href="service-plans-proposal.md" download>دانلود شرح تمام پلن‌ها ↓</a><a href="service-plans.json" download>فایل ساختاریافته پلن‌ها ↓</a><a href="client-brief.html">تکمیل اطلاعات کارفرما ←</a><a href="build-paths.html#compare">بازگشت به مسیر ساخت ←</a></div>','منابع و خروجی')
doc=f'''<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="چهار پلن دقیق اجرای فروشگاه کابل با وردپرس، وودمارت و المنتور؛ قیمت، سئوی داخل طراحی، امکانات فروش، معیار تحویل و بودجه ماهانه."><title>پلن‌ها، قیمت و دامنه سئو | گزارش سایت کابل</title><link rel="stylesheet" href="reports-site.css"><link rel="stylesheet" href="service-plans.css?v=plans-1"></head><body class="service-plans"><nav class="site-nav" aria-label="ناوبری اصلی"><div class="wrap"><a class="site-brand" href="index.html"><span class="brand-mark" aria-hidden="true">◎</span><span>پرونده بازار کابل</span></a>{nav}<div class="nav-actions"><button class="icon-btn print-btn" type="button" id="sp-print">چاپ شرح پلن‌ها</button><button class="icon-btn" id="theme-toggle" type="button" aria-label="تغییر تم">☀</button></div></div><div class="reading-bar" id="reading-bar" aria-hidden="true"></div></nav><header class="hero sp-hero"><div class="wrap"><div><span class="eyebrow">پیشنهاد اجرایی · وردپرس / وودمارت / المنتور</span><h1>هر مبلغ، <em>چه خروجی‌ای دارد؟</em></h1><p>دامنه طراحی، امکانات فروش، سئوی زمان ساخت و کار ماهانه را برای هر سطح دقیق ببینید؛ یک پلن برای شروع و مسیر روشن برای توسعه.</p><div class="hero-actions"><a class="primary" href="#compare">مقایسه چهار پلن ←</a><a class="secondary" href="#seo-in-design">سئو داخل طراحی</a><a class="secondary" href="#budget">بودجه کل</a></div></div><div class="hero-art"><img src="assets/editorial-2026/build-v1.webp" fetchpriority="high" width="1536" height="1024" alt="تصویر مفهومی مسیر ساخت سایت کابل"></div></div></header><main class="wrap page-main">{body}</main><footer class="site-footer"><div class="wrap"><strong>پلن‌ها و دامنه اجرای سایت کابل</strong><span>۵ اکتبر ۲۰۲۶ · پیشنهاد برای تصمیم؛ پس از تکمیل داده‌ها نهایی می‌شود</span></div></footer><button class="toc-fab" id="toc-fab" type="button" aria-expanded="false" aria-controls="toc-panel">فهرست بخش‌ها</button><nav class="toc-panel" id="toc-panel" aria-label="فهرست همین صفحه" hidden><strong>در این صفحه</strong></nav><script src="reports-site.js"></script><script id="sp-data" type="application/json">{json.dumps(D,ensure_ascii=False).replace('<','\\u003c')}</script><script src="service-plans.js?v=plans-1"></script></body></html>'''
(ROOT/'service-plans.html').write_text(doc,encoding='utf-8')

def plain(p):
    s=p['seo']
    lines=[f"پلن {p['name']} — {fa(p['price'])} میلیون تومان",D['status'],f"زمان پیشنهادی: {p['days']} روز کاری",'','دامنه طراحی',p['design'],'',f"سئوی داخل ساخت: {fa(s['pages'])} صفحه منتخب، {fa(s['articles'])} مقاله آغاز، {fa(s['clusters'])} خوشه",s['description'],s['followup'],'']
    for k,v in {**D['common'],**features(p)}.items():lines.extend([k,*['- '+x for x in v],''])
    lines.extend(['معیارهای پذیرش',*['- '+x for x in acceptance_for(p)],'','اجزای قیمت',*['- '+label+': '+fa(value)+' میلیون' for label,value in p['breakdown']],f"جمع: {fa(p['price'])} میلیون",'','خارج از این پلن',*['- '+x for x in p['excluded']],'','فرض‌های مشترک',*['- '+x for x in D['assumptions']],'','هزینه‌های بیرونی',*['- '+x for x in D['outside']],'','مراحل پرداخت',*['- '+label+': '+fa(percent)+'٪' for label,percent in D['payments']],'','خدمات ماهانه (جدا از ساخت)'])
    for m in D['monthly'][1:]:lines.extend([m['name']+': '+fa(m['price'])+' میلیون در ماه',m['scope']])
    lines.extend(['',*['- '+x for x in D['monthlyNotes']],'','گزینه‌های اضافه'])
    for a in D['addons']:lines.extend([a['name']+': '+fa(a['price'])+' میلیون',a['description']])
    lines.extend(['','نگهداری مستقل بدون سئو: ۵ میلیون در ماه؛ داخل پلن ماهانه دوباره دریافت نمی‌شود.','منابع',*[title+': '+url for title,url in D['sources']]])
    return '\n'.join(lines)+'\n'
for p in P:(ROOT/f"service-plan-{p['id']}.txt").write_text(plain(p),encoding='utf-8-sig')
(ROOT/'service-plans-proposal.md').write_text('# پیشنهاد تفصیلی اجرای فروشگاه کابل\n\n'+ '\n\n---\n\n'.join(plain(p) for p in P),encoding='utf-8')
from visual_upgrade import upgrade_page
upgrade_page(ROOT/'service-plans.html')
print('Created four detailed plans, SEO scope, monthly services and proposal files.')
