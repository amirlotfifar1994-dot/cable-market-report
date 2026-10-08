from pathlib import Path
root=Path(__file__).resolve().parent
for name in ['index.html','templates.html','design.html']:
    p=root/name
    s=p.read_text(encoding='utf-8')
    if 'id="barad-current"' in s:continue
    banner='<section class="barad-banner" id="barad-current"><div class="kicker">تمپلیت‌های تازه پروژه</div><h2>طراحی اختصاصی ایده‌آفرینان باراد</h2><p>سه هویت هماهنگ برای خانه، تمام کالاها، محصول، پیش‌فاکتور مهمان، درباره ما و تماس؛ با افشارنژاد خراسان و شهید قندی و نقشه اجرای وودمارت و المنتور.</p><a href="barad-templates.html">دیدن طرح‌های باراد ←</a></section>'
    # Place after the existing main opening, including any attributes.
    import re
    s=re.sub(r'(<main\b[^>]*>)',lambda m:m.group(1)+banner,s,count=1)
    if 'href="barad-templates.css"' not in s:s=s.replace('</head>','<link rel="stylesheet" href="barad-templates.css"></head>',1)
    p.write_text(s,encoding='utf-8')
p=root/'woodmart-templates.html'
s=p.read_text(encoding='utf-8')
if 'id="legacy-woodmart"' not in s:
    s=s.replace('<!-- barad-current-end -->','<!-- barad-current-end --><details class="wm-archive" id="legacy-woodmart"><summary>آرشیو کانسپت‌های عمومی و نمونه‌های قبلی وودمارت</summary>',1)
    s=s.replace('</main>','</details></main>',1)
s=s.replace('<span>۹ کانسپت · ۷۸ تصویر</span><span>۳ پیش‌نمایش اسلایدری</span><span>نمونه تعاملی مدیریت قیمت</span>','<span>۳ هویت تازه باراد · ۳۶ تصویر</span><span>۶ صفحه در هر هویت</span><span>پیش‌فاکتور بدون حساب</span>')
s=s.replace('href="#pricing">مدیریت قیمت‌ها','href="barad-templates.html#quote-flow">پیش‌فاکتور و مدیریت قیمت',1)
s=s.replace('href="woodmart-slider-images.zip" download>بسته اسلایدری ↓','href="barad-templates.html#implementation">نقشه اجرای المنتور ←',1)
p.write_text(s,encoding='utf-8')
print('Linked the Barad studio from roadmap, design and template pages')
