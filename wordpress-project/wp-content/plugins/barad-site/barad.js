(() => {
  'use strict';
  document.body.classList.add('barad-js-ready');
  if (window.baradFrontend?.locale === 'fa-IR') {
    const digits = '۰۱۲۳۴۵۶۷۸۹';
    const localize = root => {
      const change = node => {
        if (node.parentElement?.closest('script,style,textarea')) return;
        const value = node.data.replace(/[0-9]/g, digit => digits[Number(digit)]);
        if (node.data !== value) node.data = value;
      };
      if (root.nodeType === Node.TEXT_NODE) { change(root); return; }
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) change(walker.currentNode);
    };
    localize(document.body);
    new MutationObserver(records => records.forEach(record => {
      if (record.type === 'characterData') localize(record.target);
      else record.addedNodes.forEach(localize);
    })).observe(document.body, {childList: true, characterData: true, subtree: true});
  }
  const toggle = document.querySelector('.barad-menu-toggle');
  const nav = document.querySelector('#barad-main-nav');
  function menu(open) { nav?.classList.toggle('is-open', open); toggle?.setAttribute('aria-expanded', String(open)); }
  toggle?.addEventListener('click', () => menu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { menu(false); toggle.focus(); } });
  document.querySelector('#barad-list-style')?.addEventListener('change', event => document.querySelector('#barad-catalog')?.classList.toggle('view-list', event.target.value === 'list'));
  document.querySelectorAll('[data-barad-view]').forEach(button => button.addEventListener('click', () => {
    document.querySelector('#barad-catalog')?.classList.toggle('view-list', button.dataset.baradView === 'list');
    document.querySelectorAll('[data-barad-view]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const arrivals = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('barad-enter'); arrivals.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.product-card,.barad-category-card,.brand-door').forEach(card => arrivals.observe(card));
  }
  document.querySelector('#barad-print')?.addEventListener('click', () => window.print());
  const quantity = document.querySelector('#barad-quantity');
  const total = document.querySelector('#barad-live-total');
  function updateTotal() {
    if (!quantity || !total) return;
    const number = Number(quantity.value);
    if (!Number.isInteger(number) || number < 1 || number > 100000) { total.textContent = window.baradFrontend?.invalidQuantity || 'Invalid quantity'; return; }
    const decimals = Number(total.dataset.decimals) || 0;
    total.textContent = (Number(total.dataset.price) * number).toLocaleString(window.baradFrontend?.locale || 'fa-IR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + ' ' + total.dataset.currency;
  }
  quantity?.addEventListener('input', updateTotal);
  updateTotal();
})();
