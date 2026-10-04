(function () {
  'use strict';
  const root = document.documentElement;
  const button = document.getElementById('page-motion-toggle');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let observer;
  let heroObserver;
  let scrollScheduled = false;
  try { paused = localStorage.getItem('cable-report-motion') === 'off'; } catch (_) {}
  const reveals = Array.from(document.querySelectorAll('main .section-head,main .rm-step,main .rm-client-inputs,main .rm-directory>a,main .ir-card,main .finding,main .cb-section,main .cb-files>article,main .wm-concept,main .template-option,main .premium-template'));
  reveals.forEach((element, index) => { element.classList.add('pv-reveal'); element.style.setProperty('--pv-delay', (index % 3) * 60 + 'ms'); });
  const heroes = Array.from(document.querySelectorAll('header .pv-frame,header .rm-photo-frame'));
  function revealAll() {
    reveals.forEach(element => element.classList.add('pv-visible'));
  }
  function scrollEffect() {
    scrollScheduled = false;
    if (paused || preference.matches || document.hidden) return;
    heroes.forEach(element => {
      const bounds = element.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > innerHeight) return;
      element.style.setProperty('--pv-scroll', Math.max(-10, Math.min(10, scrollY * .018)) + 'px');
    });
  }
  function sync() {
    const off = paused || preference.matches;
    root.dataset.motion = off ? 'off' : 'on';
    if (button) {
      button.textContent = off ? 'حرکت خاموش' : 'حرکت فعال';
      button.setAttribute('aria-pressed', String(!off));
      button.setAttribute('aria-label', off ? 'فعال‌کردن حرکت‌های نمایشی' : 'توقف حرکت‌های نمایشی');
      button.disabled = preference.matches;
      button.title = preference.matches ? 'مطابق تنظیم کاهش حرکت دستگاه' : 'کنترل حرکت‌های نمایشی این گزارش';
    }
    if (observer) observer.disconnect();
    if (heroObserver) heroObserver.disconnect();
    if (off || !('IntersectionObserver' in window)) {
      root.classList.remove('pv-motion-ready'); revealAll();
      heroes.forEach(element => { element.classList.remove('pv-in-view'); element.style.removeProperty('--pv-scroll'); });
      return;
    }
    root.classList.add('pv-motion-ready');
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('pv-visible'); observer.unobserve(entry.target); }
    }), { rootMargin: '0px 0px 60px 0px', threshold: .05 });
    reveals.forEach(element => {
      if (element.getBoundingClientRect().top < innerHeight + 30) element.classList.add('pv-visible');
      else if (!element.classList.contains('pv-visible')) observer.observe(element);
    });
    heroObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('pv-in-view', entry.isIntersecting)));
    heroes.forEach(element => heroObserver.observe(element));
    scrollEffect();
  }
  if (button) button.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('cable-report-motion', paused ? 'off' : 'on'); } catch (_) {}
    sync();
  });
  preference.addEventListener('change', sync);
  window.addEventListener('scroll', () => {
    if (scrollScheduled || paused || preference.matches) return;
    scrollScheduled = true; requestAnimationFrame(scrollEffect);
  }, { passive: true });
  document.addEventListener('visibilitychange', () => root.classList.toggle('pv-tab-hidden', document.hidden));
  document.addEventListener('focusin', event => {
    const target = event.target.closest('.pv-reveal');
    if (target) target.classList.add('pv-visible');
  });
  window.addEventListener('beforeprint', revealAll);
  sync();
})();
