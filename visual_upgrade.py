"""Apply shared visual treatments after running any report generator."""
from pathlib import Path
import re
ROOT=Path(__file__).parent
PAGES={'index.html':('roadmap','مسیر روشن از شناخت تا رشد'),'competitors.html':('competitors','مشاهده، مقایسه و کشف فرصت'),'strategy.html':('strategy','ساختار منسجم برای تصمیم‌های سایت'),'build-paths.html':('build','مسیر ساخت متناسب با نیاز فروش'),'design.html':('design','از نیاز واقعی تا تجربه خرید'),'templates.html':('templates','سبک‌های متفاوت، هویت منسجم'),'woodmart-templates.html':('woodmart','فروشگاه قابل طراحی و مدیریت'),'security.html':('security','دسترسی کنترل‌شده به حساب و سند'),'seo-roadmap.html':('seo','دیده‌شدن مدل‌ها و دانش فنی'),'client-brief.html':('brief','اطلاعات واقعی، نقطه شروع طراحی')}

def frame(slug,title):
    return f'<figure class="pv-frame"><div class="pv-image-window"><img src="assets/editorial-2026/{slug}-v1.webp" width="1536" height="1024" alt="تصویر مفهومی: {title}" fetchpriority="high" decoding="async"><span class="pv-light-line" aria-hidden="true"></span></div><figcaption><span>{title}</span><small>تصویر مفهومی · ساخته‌شده با AI</small></figcaption></figure>'

def upgrade_page(path):
    path=Path(path)
    if path.name not in PAGES:return
    slug,title=PAGES[path.name]
    if not (ROOT/f'assets/editorial-2026/{slug}-v1.webp').exists():return
    s=path.read_text(encoding='utf-8')
    if 'page-visuals.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="page-visuals.css?v=visual-1"></head>',1)
    if 'page-motion.js' not in s:s=s.replace('</body>','<script src="page-motion.js?v=visual-1"></script></body>',1)
    if not re.search(r'<body[^>]*\bvisual-page\b',s):
        if re.search(r'<body class="',s):s=s.replace('<body class="','<body class="visual-page ',1)
        else:s=s.replace('<body>','<body class="visual-page">',1)
    if 'id="page-motion-toggle"' not in s:
        s=s.replace('<div class="nav-actions">','<div class="nav-actions"><button class="icon-btn pv-motion-button" type="button" id="page-motion-toggle" aria-pressed="true" aria-label="توقف حرکت‌های نمایشی">حرکت فعال</button>',1)
    start=s.find('<header');end=s.find('</header>',start)+len('</header>')
    header=s[start:end]
    if path.name=='index.html':
        header=re.sub(r'(<div class="rm-photo-frame"><img )[^>]+>',r'\1src="assets/editorial-2026/roadmap-v1.webp" width="1536" height="1024" alt="تصویر مفهومی مسیر پروژه کابل" fetchpriority="high">',header,count=1)
        header=header.replace('<small>تصویر مفهومی</small>','<small>تصویر مفهومی · AI</small>')
    elif path.name=='client-brief.html':
        if 'pv-brief-art' not in header:
            header=header.replace('<aside class="cb-hero-card">','<div class="pv-brief-art">'+frame(slug,title)+'<aside class="cb-hero-card">',1)
            header=header.replace('</aside></div></header>','</aside></div></div></header>',1)
    elif 'pv-frame' not in header:
        header=re.sub(r'<img\b[^>]*>',frame(slug,title),header,count=1)
    s=s[:start]+header+s[end:]
    s=s.replace('index.html#reading-path','index.html#project-roadmap')
    path.write_text(s,encoding='utf-8')

if __name__=='__main__':
    for name in PAGES:upgrade_page(ROOT/name)
    print('Visual upgrade applied to 10 report pages')
