(function () {
  const themes = [
    { id:'technical', name:'تکنیکال', tag:'فنی و مدل‌محور', desc:'جست‌وجوی کد، مشخصات و دیتاشیت در مرکز تجربه؛ مناسب سبد صنعتی و خریدار مهندسی.', color:'teal' },
    { id:'brands', name:'براندا', tag:'واردات و نمایندگی', desc:'مرور سریع خانواده‌ها و برندها؛ مناسب شرکتی که واردات و بخشی از نمایندگی داخلی را هم‌زمان معرفی می‌کند.', color:'clay' },
    { id:'project', name:'پروژه', tag:'خرید و استعلام B2B', desc:'مسیر خرید پروژه، مقدار و لیست اقلام را برجسته می‌کند؛ مناسب فروش عمده و ارتباط با واحد تدارکات.', color:'blue' }
  ];
  const pages = [
    { id:'home', name:'صفحه اصلی', role:'صفحه معمولی وردپرس + المنتور' },
    { id:'catalog', name:'لیست همه کالاها', role:'WoodMart → Layouts → Products archive' },
    { id:'product', name:'صفحه محصول', role:'WoodMart → Layouts → Single product' }
  ];
  const root = document.getElementById('woodmart-gallery');
  root.innerHTML = themes.map((theme, index) => '<article class="wm-concept" id="wm-'+theme.id+'" data-tone="'+theme.color+'"><div class="wm-concept-head"><div><small>0'+(index+1)+' / WOODMART CONCEPT</small><h3>'+theme.name+'</h3><p>'+theme.desc+'</p></div><span class="wm-concept-tag">'+theme.tag+'</span></div><div class="wm-tabs" role="group" aria-label="انتخاب صفحه '+theme.name+'">'+pages.map((page,i)=>'<button type="button" data-page="'+page.id+'" aria-pressed="'+(i===0)+'">'+page.name+'</button>').join('')+'</div>'+pages.map((page,i)=>'<div class="wm-page" data-view="'+page.id+'" '+(i?'hidden':'')+'><div class="wm-page-meta"><strong>'+page.name+'</strong><span>'+page.role+'</span></div><div class="wm-frames"><figure><div class="wm-scroll wm-scroll-desktop"><img src="assets/templates/woodmart/'+theme.id+'-'+page.id+'-desktop.png" alt="نمای دسکتاپ '+page.name+' طرح '+theme.name+'" decoding="async"></div><figcaption>دسکتاپ · تصویر را در همین قاب اسکرول کنید</figcaption></figure><figure><div class="wm-scroll wm-scroll-mobile"><img src="assets/templates/woodmart/'+theme.id+'-'+page.id+'-mobile.png" alt="نمای گوشی '+page.name+' طرح '+theme.name+'" decoding="async"></div><figcaption>گوشی · تصویر را در همین قاب اسکرول کنید</figcaption></figure></div><div class="wm-downloads"><a href="assets/templates/woodmart/'+theme.id+'-'+page.id+'-desktop.png" download>دریافت تصویر دسکتاپ ↓</a><a href="assets/templates/woodmart/'+theme.id+'-'+page.id+'-mobile.png" download>دریافت تصویر گوشی ↓</a></div></div>').join('')+'</article>').join('');
  root.querySelectorAll('.wm-concept').forEach(concept => {
    concept.querySelectorAll('.wm-tabs button').forEach(button => button.addEventListener('click', () => {
      concept.querySelectorAll('.wm-tabs button').forEach(item => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
      concept.querySelectorAll('.wm-page').forEach(view => { view.hidden = view.dataset.view !== button.dataset.page; });
    }));
  });
})();
