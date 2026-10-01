(function(){
  const q=new URLSearchParams(location.search);
  const theme=['wave','pulse','orbit'].includes(q.get('theme'))?q.get('theme'):'wave';
  const page=['home','catalog','product','about','contact','account','login'].includes(q.get('page'))?q.get('page'):'home';
  const preview=q.get('preview')==='1';
  const {items,money,cards,title,catalog,product}=window.CableCommerceParts;
  const asset='assets/woodmart-studio/';
  const t={wave:{name:'موج',en:'WAVE / CABLE COLLECTION',sub:'انتخاب فنی، نگاه متفاوت'},pulse:{name:'پالس',en:'PULSE / CABLE SHOP',sub:'کابل‌های منتخب، خرید مستقیم'},orbit:{name:'مدار',en:'ORBIT / BRANDS & CABLES',sub:'برند، کاربرد و مدل در یک مسیر'}}[theme];
  let sliderId=0;
  const slide=(body,key)=>({body,key});
  function slider(slides,kind,caption){
    const id='m-slider-'+theme+'-'+(++sliderId);
    return '<section class="m-slider '+kind+'" data-slider tabindex="0" aria-roledescription="اسلایدر" aria-label="'+caption+'"><div class="m-stage" id="'+id+'">'+slides.map((s,i)=>'<article class="m-slide" data-slide data-slide-key="'+s.key+'" aria-roledescription="اسلاید" aria-label="'+(i+1)+' از '+slides.length+'" '+(i?'hidden':'')+'>'+s.body+'</article>').join('')+'</div><div class="m-controls"><button type="button" data-prev aria-controls="'+id+'" aria-label="اسلاید قبلی">→</button><div class="m-dots">'+slides.map((s,i)=>'<button type="button" data-index="'+i+'" aria-label="نمایش اسلاید '+(i+1)+'" aria-current="'+(i===0)+'"><span></span></button>').join('')+'</div><span data-counter>۰۱ / '+String(slides.length).padStart(2,'0')+'</span><button type="button" data-next aria-controls="'+id+'" aria-label="اسلاید بعدی">←</button><button type="button" class="m-play" data-play aria-pressed="false">پخش خودکار ▷</button></div></section>';
  }
  const mainHeader='<div class="c-notice"><div class="c-wrap"><span>کانسپت قابل اجرای وودمارت · عکس و قیمت نمونه</span><span>فروشگاه آنلاین + تأمین سفارشی</span></div></div><header class="c-header m-header"><div class="c-wrap c-header-main"><div class="c-brand"><span>'+({wave:'≋',pulse:'↯',orbit:'⊙'}[theme])+'</span><div><b>'+t.name+'</b><small>'+t.en+'</small></div></div><div class="c-search"><span>جست‌وجوی نام، مدل یا برند کابل</span><b>⌕</b></div><div class="c-account">حساب کاربری <b>سبد خرید <i>۰</i></b></div></div><nav class="c-wrap"><b>☰ همه دسته‌ها</b><span>فروشگاه</span><span>برندها</span><span>واردات و نمایندگی</span><span>دانش فنی</span><a>خرید پروژه ←</a></nav></header>';
  const footer='<footer class="c-footer"><div class="c-wrap"><div class="c-brand"><span>'+({wave:'≋',pulse:'↯',orbit:'⊙'}[theme])+'</span><div><b>'+t.name+'</b><small>'+t.en+'</small></div></div><p>کانسپت تصویری و تعاملی؛ نام‌ها، قیمت‌ها، مدل‌ها و مدارک نمونه‌اند.</p><div>واردات کابل · فروشگاه · تماس با فروش</div></div></footer>';
  const features='<div class="m-feature-bar"><div><small>01 / CHOOSE</small><b>انتخاب بر اساس مدل</b><span>کد و ویژگی‌های فنی</span></div><div><small>02 / BUY</small><b>خرید با قیمت روشن</b><span>قیمت و واحد فروش کنار کالا</span></div><div><small>03 / SUPPLY</small><b>تأمین سفارشی</b><span>استعلام برای اقلام خاص</span></div></div>';
  const categoryTiles='<div class="m-categories"><a href="woodmart-slider-render.html?theme='+theme+'&page=catalog"><span>01</span><h3>کابل‌های کنترل</h3><p>انتخاب برای اتوماسیون و صنعت</p><b>↗</b></a><a href="woodmart-slider-render.html?theme='+theme+'&page=catalog"><span>02</span><h3>شبکه و ارتباطات</h3><p>برای زیرساخت انتقال داده</p><b>↗</b></a><a href="woodmart-slider-render.html?theme='+theme+'&page=catalog"><span>03</span><h3>قدرت و تأسیسات</h3><p>برای ساختمان و زیرساخت برق</p><b>↗</b></a></div>';
  const button=(label,pageType='catalog')=>'<a class="m-button" href="woodmart-slider-render.html?theme='+theme+'&page='+pageType+'">'+label+' ←</a>';
  function heroWave(){
    return slider([
      slide('<img class="m-backdrop" src="'+asset+'copper-hero.webp" alt="جزئیات مفهومی کابل"><div class="m-wave-copy"><small>ENGINEERED CONNECTION / 01</small><h1>جزئیات بزرگ.<br><em>انتخاب دقیق.</em></h1><p>کابل‌های تخصصی را با مشخصات، شناسه مدل و مسیر خرید روشن انتخاب کنید.</p>'+button('دیدن مجموعه')+'<span class="m-hero-note">کنترل · قدرت · ابزار دقیق</span></div>','copper'),
      slide('<img class="m-backdrop" src="'+asset+'depot-hero.webp" alt="انبار مفهومی کابل"><div class="m-wave-copy"><small>PROJECT SUPPLY / 02</small><h1>برای هر پروژه،<br><em>یک مسیر تأمین.</em></h1><p>اقلام آماده را آنلاین بخرید و نیازهای وارداتی خاص را با فروش هماهنگ کنید.</p>'+button('کاتالوگ پروژه')+'<span class="m-hero-note">خرید مستقیم + استعلام تخصصی</span></div>','depot'),
      slide('<img class="m-backdrop" src="'+asset+'atelier-hero.webp" alt="چیدمان مفهومی کابل"><div class="m-wave-copy"><small>CABLE COLLECTION / 03</small><h1>مدل مناسب،<br><em>برای کاربرد شما.</em></h1><p>خانواده کابل، واحد فروش و ویژگی‌های هر محصول را یکجا ببینید.</p>'+button('مرور خانواده‌ها')+'<span class="m-hero-note">اطلاعات کالا از ووکامرس</span></div>','atelier')
    ],'m-wave-slider','اسلایدر تمام‌عرض موج');
  }
  function heroPulse(){
    return '<div class="m-pulse-layout c-wrap"><aside class="m-pulse-menu"><small>SHOP BY APPLICATION</small><h2>برای چه کاری<br>کابل می‌خواهید؟</h2><a href="woodmart-slider-render.html?theme=pulse&page=catalog">اتوماسیون و کنترل <b>←</b></a><a href="woodmart-slider-render.html?theme=pulse&page=catalog">برق و تأسیسات <b>←</b></a><a href="woodmart-slider-render.html?theme=pulse&page=catalog">شبکه و دیتا <b>←</b></a><p>فیلترهای فروشگاه، انتخاب دقیق‌تری به شما می‌دهند.</p></aside>'+slider(items.slice(0,3).map((p,i)=>slide('<div class="m-pulse-copy"><small>FEATURED CABLE / 0'+(i+1)+'</small><h1>'+p.name+'</h1><p>'+p.attrs+' · مدل نمونه</p><code dir="ltr">'+p.code+'</code><div class="m-featured-price">'+money(p)+'</div>'+button('مشاهده محصول','product')+'<span class="m-hero-note">قیمت نمونه / '+p.unit+'</span></div><div class="m-pulse-photo"><span>SELECTED / 0'+(i+1)+'</span><img src="'+p.image+'" alt="تصویر مفهومی کابل"><b>کابل‌های منتخب</b></div>',p.code)),'m-pulse-slider','اسلایدر محصولات شاخص پالس')+'</div>';
  }
  function heroOrbit(){
    const body='<div class="m-orbit-bento c-wrap"><div>'+slider([
      slide('<div class="m-orbit-copy"><small>ONE STORE / MANY CONNECTIONS</small><h1>کابل‌ها را<br><em>به هم وصل کنیم.</em></h1><p>خرید آنلاین، مرور برندها و تأمین تخصصی، در یک فروشگاه.</p>'+button('ورود به فروشگاه')+'</div><img src="'+asset+'atelier-hero.webp" alt="کابل‌های مفهومی فروشگاهی">','collection'),
      slide('<div class="m-orbit-copy"><small>PRECISE PRODUCT DATA</small><h1>از نام برند<br><em>تا کد محصول.</em></h1><p>گزینه‌های هر کالا را با قیمت، ویژگی و واحد فروش مقایسه کنید.</p>'+button('پیدا کردن مدل')+'</div><img src="'+asset+'cable-coil.webp" alt="حلقه کابل مفهومی">','model')
    ],'m-orbit-slider','اسلایدر دسته‌ها و برندهای مدار')+'</div><aside><a class="m-orbit-tile" href="woodmart-slider-render.html?theme=orbit&page=catalog"><small>INDUSTRIAL CABLES</small><b>صنعتی و تخصصی</b><span>کنترل و ابزار دقیق ↗</span><img src="'+asset+'copper-hero.webp" alt="کابل مفهومی صنعتی"></a><a class="m-orbit-tile m-orbit-tile-light" href="woodmart-slider-render.html?theme=orbit&page=catalog"><small>PROJECT SUPPLY</small><b>لیست اقلام دارید؟</b><span>شروع خرید پروژه ↗</span><i>↗</i></a></aside></div>';
    return body;
  }
  function brandCarousel(){
    const names=[['برند داخلی ۰۱','وارداتی ۰۱','برند داخلی ۰۲','وارداتی ۰۲'],['وارداتی ۰۳','برند داخلی ۰۳','وارداتی ۰۴','برند داخلی ۰۴']];
    return '<div class="m-brands-intro"><small>BRANDS / SAMPLE IDENTITIES</small><h2>از برند به مدل برسید.</h2><p>نام و وضعیت نمایندگی برندهای واقعی پس از تأیید شرکت درج می‌شود.</p></div>'+slider(names.map((group,i)=>slide('<div class="m-brand-row">'+group.map((name,n)=>'<div><span>'+['⊙','∿','≋','◇'][n]+'</span><b>'+name+'</b><small>نمونه نمایشی</small></div>').join('')+'</div>','brand-'+i)),'m-brand-slider','کاروسل برندهای نمونه مدار');
  }
  function productCarousel(){
    return slider([slide(cards(items.slice(0,3)),'products-a'),slide(cards([items[2],items[3],items[0]]),'products-b')],'m-product-slider','کاروسل کالاهای منتخب');
  }
  function homeIntro(){if(theme==='wave')return heroWave();if(theme==='pulse')return heroPulse();return heroOrbit()+'<section class="m-brands c-wrap">'+brandCarousel()+'</section>';}
  function home(){
    const hero=homeIntro();
    if(preview)return hero;
    if(theme==='wave')return hero+'<main class="c-wrap">'+features+title('SHOP BY FAMILY','کابل‌ها، دسته به دسته')+categoryTiles+title('CURATED CABLES','کالاهای منتخب')+productCarousel()+'<section class="m-editorial"><div><small>IMPORTS & DOMESTIC REPRESENTATION</small><h2>انتخاب امروز.<br>زیرساخت فردا.</h2><p>برند، مدل و مدارک تأییدشده کنار مسیر واقعی فروش قرار می‌گیرند.</p>'+button('کاتالوگ کابل')+'</div><img src="'+asset+'depot-hero.webp" alt="تصویر مفهومی کابل و انبار"></section></main>';
    if(theme==='pulse')return hero+'<main class="c-wrap">'+features+title('QUICK SELECTION','مرور سریع خانواده‌ها')+categoryTiles+title('READY TO BUY','قیمت روشن، خرید مستقیم')+cards(items)+'<div class="m-pulse-strip"><div><small>PROJECT ORDER</small><h2>بیش از یک قلم می‌خواهید؟</h2><p>مدل و مقدار اقلام پروژه را برای فروش بفرستید.</p></div>'+button('مرور کاتالوگ')+'</div>'+title('DISCOVER MORE','مدل‌های مرتبط با خرید شما')+productCarousel()+'</main>';
    return hero+'<main class="c-wrap">'+title('PRODUCT FAMILIES','از کاربرد شروع کنید')+categoryTiles+title('FOR YOUR NEXT CONNECTION','کالاهای منتخب فروشگاه')+productCarousel()+features+'<section class="m-orbit-bottom"><img src="'+asset+'depot-hero.webp" alt="انبار مفهومی کابل"><div><small>FROM ONE MODEL TO A PROJECT</small><h2>از یک مدل،<br>تا یک پروژه کامل.</h2><p>کالاهای با قیمت مشخص را آنلاین بخرید؛ برای تأمین مدل خاص با فروش هماهنگ کنید.</p>'+button('انتخاب کالا')+'</div></section></main>';
  }
  function catalogPage(){
    let body=catalog();
    body=body.replace('همه مدل‌ها. همه جزئیات.',theme==='wave'?'مجموعه کابل‌های موج':theme==='pulse'?'فروشگاه کابل پالس':'کاتالوگ برند و مدل');
    if(theme==='orbit')body=body.replace('<div class="c-chips">','<div class="m-mini-banner"><b>برندهای وارداتی + داخلی</b><span>جست‌وجوی مدل و خرید در یک کاتالوگ</span></div><div class="c-chips">');
    return body;
  }
  function productPage(){
    let body=product();
    if(theme==='pulse')body=body.replace('<div class="c-product-layout">','<div class="m-product-highlight"><b>SELECTED CABLE / نمونه</b><span>قیمت و مشخصات از همان محصول ووکامرس</span></div><div class="c-product-layout">');
    return body;
  }
  const root=document.getElementById('store');root.className='commerce theme-'+theme+' page-'+page+(preview?' m-preview':'');
  const content=page==='home'?home():page==='catalog'?catalogPage():page==='product'?productPage():window.CableCustomerPages.render(theme,page);
  root.innerHTML=(preview?'':mainHeader)+content+(preview?'':footer);
  if(!preview){
    const nav=root.querySelector('.c-header nav');nav.classList.add('m-site-nav');nav.innerHTML=[['catalog','همه کالاها'],['home','خانه'],['about','درباره ما'],['contact','تماس با ما'],['account','حساب مشتری'],['login','ورود / ثبت‌نام']].map(([key,name])=>'<a href="woodmart-slider-render.html?theme='+theme+'&page='+key+'" '+(key===page?'aria-current="page"':'')+'>'+name+'</a>').join('');
    root.querySelector('.c-account').innerHTML='<a href="woodmart-slider-render.html?theme='+theme+'&page=account">حساب مشتری</a> <b>سبد نمونه <i>۰</i></b>';
    root.querySelector('.c-footer .c-wrap>div:last-child').innerHTML='<nav class="u-footer-links"><a href="woodmart-slider-render.html?theme='+theme+'&page=about">درباره ما</a><a href="woodmart-slider-render.html?theme='+theme+'&page=contact">تماس</a><a href="woodmart-slider-render.html?theme='+theme+'&page=account">پیش‌فاکتورها</a></nav>';
    if(['about','contact','account','login'].includes(page))window.CableCustomerPages.init(theme,page);
  }
  root.querySelectorAll('[data-slider]').forEach(el=>{
    const slides=[...el.querySelectorAll('[data-slide]')],dots=[...el.querySelectorAll('[data-index]')];
    const play=el.querySelector('[data-play]');let index=0,playing=false,timer=null,startX=null,hovering=false,visible=true;
    const count=number=>String(number).padStart(2,'0').replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
    function syncTimer(){clearInterval(timer);timer=null;const focused=el.contains(document.activeElement)&&document.activeElement!==play;if(playing&&visible&&!hovering&&!document.hidden&&!focused)timer=setInterval(()=>go(index+1),5000);}
    function go(next){index=(next+slides.length)%slides.length;slides.forEach((s,i)=>{s.hidden=i!==index;s.inert=i!==index;});dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===index)));el.querySelector('[data-counter]').textContent=count(index+1)+' / '+count(slides.length);el.dataset.active=String(index);}
    el.querySelector('[data-next]').addEventListener('click',()=>{go(index+1);syncTimer();});el.querySelector('[data-prev]').addEventListener('click',()=>{go(index-1);syncTimer();});dots.forEach(d=>d.addEventListener('click',()=>{go(Number(d.dataset.index));syncTimer();}));
    play.addEventListener('click',()=>{playing=!playing;play.setAttribute('aria-pressed',String(playing));play.textContent=playing?'توقف پخش Ⅱ':'پخش خودکار ▷';syncTimer();});
    const stage=el.querySelector('.m-stage');stage.addEventListener('mouseenter',()=>{hovering=true;syncTimer();});stage.addEventListener('mouseleave',()=>{hovering=false;syncTimer();});el.addEventListener('focusin',syncTimer);el.addEventListener('focusout',()=>setTimeout(syncTimer,0));document.addEventListener('visibilitychange',syncTimer);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncTimer();}).observe(el);
    el.addEventListener('keydown',e=>{if(e.target.closest('input,select,textarea'))return;if(e.key==='ArrowLeft'){e.preventDefault();go(index+1);}if(e.key==='ArrowRight'){e.preventDefault();go(index-1);}});
    el.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;startX=e.clientX;});el.addEventListener('pointerup',e=>{if(startX===null)return;const diff=e.clientX-startX;startX=null;if(Math.abs(diff)>45){go(index+(diff>0?1:-1));syncTimer();}});el.addEventListener('pointercancel',()=>{startX=null;});el.addEventListener('pointerleave',()=>{startX=null;});go(0);
  });
  root.querySelectorAll('.c-thumbs img').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','نمایش این تصویر محصول');const activate=()=>{root.querySelector('.c-main-image>img').src=img.src;};img.addEventListener('click',activate);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});});
  if(preview&&window.parent!==window){const sendSize=()=>parent.postMessage({type:'woodmart-preview-height',height:Math.ceil(root.getBoundingClientRect().height)},location.protocol==='file:'?'*':location.origin);new ResizeObserver(sendSize).observe(root);document.fonts.ready.then(sendSize);window.addEventListener('load',sendSize);}
})();
