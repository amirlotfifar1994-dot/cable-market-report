(function () {
  'use strict';
  const root = document.documentElement;
  const prepared = new WeakSet();
  const pending = new Set();
  const frames = '.pv-image-window,.rm-photo-frame,.wm-scroll,.premium-scroll,.preview,.template-images a,.template-teaser-images a,.rm-peek-image';
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) start(entry.target); });
  }, {rootMargin:'180px 0px', threshold:0}) : null;

  window.ReportMedia = {
    attributes(source) {
      const item = (window.ReportMediaMap || {})[source];
      if (!item) return 'src="'+source+'" loading="lazy" decoding="async"';
      const variants = item.variants;
      const sizes = item.width <= 650 ? '(max-width:650px) 260px, 390px' : '(max-width:650px) calc(100vw - 40px), (max-width:1100px) 80vw, 1100px';
      return 'data-media-source="'+source+'" data-src="'+variants[variants.length-1].path+'" data-srcset="'+variants.map(v=>v.path+' '+v.width+'w').join(', ')+'" data-sizes="'+sizes+'" width="'+item.width+'" height="'+item.height+'" loading="lazy" decoding="async" fetchpriority="low"';
    }
  };

  function visible(img) { return !!img.getClientRects().length; }
  function start(img) {
    if (!img.dataset.src || !visible(img)) return;
    if (observer) observer.unobserve(img);
    pending.delete(img);
    // The observer already decides when to fetch: native lazy deferral is no longer needed.
    img.loading = 'eager';
    const renderedWidth = Math.ceil(img.getBoundingClientRect().width);
    if (renderedWidth > 0) img.sizes = renderedWidth + 'px';
    else if (img.dataset.sizes) img.sizes = img.dataset.sizes;
    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
    delete img.dataset.src;
    delete img.dataset.srcset;
    delete img.dataset.sizes;
  }

  function prepare(img) {
    if (prepared.has(img) || img.closest('noscript')) return;
    prepared.add(img);
    const frame = img.parentElement.matches(frames) ? img.parentElement : null;
    let indicator;
    if (frame) {
      frame.classList.add('pl-media');
      // Do not show a loading badge before a deferred image is actually requested.
      indicator = document.createElement('span');
      indicator.className = 'pl-indicator';
      indicator.textContent = 'در حال آماده‌سازی تصویر';
      indicator.hidden = true;
      frame.append(indicator);
    }
    function waiting() {
      if (!frame) return;
      frame.classList.remove('pl-ready','pl-error');frame.classList.add('pl-pending');
      indicator.hidden = false;
      indicator.textContent = 'در حال آماده‌سازی تصویر';
      frame.setAttribute('aria-busy','true');
    }
    function ready() {
      if (!frame) return;
      function finish() {
        frame.classList.remove('pl-pending','pl-error');frame.classList.add('pl-ready');
        indicator.hidden = true;frame.removeAttribute('aria-busy');
      }
      if (img.decode) img.decode().then(finish,finish);
      else finish();
    }
    function failed() {
      if (!frame) return;
      frame.classList.remove('pl-pending');frame.classList.add('pl-error');
      frame.removeAttribute('aria-busy');indicator.hidden = false;
      indicator.textContent = 'تصویر دریافت نشد';
      const retry = document.createElement('button');
      retry.type='button';retry.className='pl-retry';retry.textContent='تلاش دوباره';
      retry.setAttribute('aria-label','تلاش دوباره برای '+(img.alt || 'دریافت تصویر'));
      retry.addEventListener('click',()=>{
        const src=img.currentSrc || img.src;
        waiting();
        // Retry the selected derivative once per explicit click, bypassing a cached error.
        img.removeAttribute('srcset');
        const url=new URL(src,location.href);url.searchParams.set('retry',String(Date.now()));img.src=url.href;
      });
      indicator.append(retry);
    }
    img.addEventListener('load',ready);
    img.addEventListener('error',failed);
    if (img.dataset.src) {
      pending.add(img);
      if(observer)observer.observe(img);
      else if(visible(img))start(img);
    } else if (img.complete && img.naturalWidth) ready();
    else if (img.hasAttribute('src')) waiting();
    // Starting a deferred request must enable only its own placeholder.
    const sourceObserver = new MutationObserver(() => {
      if (img.hasAttribute('src')) {if(!img.complete)waiting();sourceObserver.disconnect();}
    });
    if (img.dataset.src)sourceObserver.observe(img,{attributes:true,attributeFilter:['src']});
  }

  function scan(container) {
    if(container.matches && container.matches('img'))prepare(container);
    container.querySelectorAll?.('img').forEach(prepare);
  }
  scan(document);
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
    if(node.nodeType===1)scan(node);
  }))).observe(document.body,{childList:true,subtree:true});
  // Hidden tabs/details become observable automatically; the fallback needs an explicit wake-up.
  if(!observer)document.addEventListener('click',()=>requestAnimationFrame(()=>pending.forEach(img=>{if(visible(img))start(img);})));
  document.addEventListener('toggle',event=>{
    if(!observer && event.target.open)pending.forEach(img=>{if(visible(img))start(img);});
  },true);
  window.addEventListener('beforeprint',()=>pending.forEach(img=>{if(visible(img))start(img);}));

  // Indeterminate navigation feedback reflects real navigation, never a made-up percentage.
  const line=document.createElement('div');line.className='pl-nav-feedback';line.setAttribute('aria-hidden','true');document.body.append(line);
  let navigationTimeout;
  document.addEventListener('click',event=>{
    const a=event.target.closest('a[href]');
    if(!a || event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || a.hasAttribute('download') || (a.target && a.target!=='_self'))return;
    const url=new URL(a.href,location.href);
    if(url.origin!==location.origin || !url.pathname.endsWith('.html') || (url.pathname===location.pathname && url.search===location.search))return;
    root.classList.add('pl-navigating');clearTimeout(navigationTimeout);
    navigationTimeout=setTimeout(()=>root.classList.remove('pl-navigating'),8000);
  });
  window.addEventListener('pageshow',()=>{root.classList.remove('pl-navigating');clearTimeout(navigationTimeout);});
})();
