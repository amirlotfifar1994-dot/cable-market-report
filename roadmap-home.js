(function () {
  const steps = Array.from(document.querySelectorAll('.rm-step'));
  const links = Array.from(document.querySelectorAll('[data-roadmap-link]'));
  const label = document.getElementById('rm-reading-label');
  if (!steps.length || !links.length) return;
  let active = '';
  function setActive(step) {
    const slug = step.id.replace('step-', '');
    if (slug === active) return;
    active = slug;
    steps.forEach(item => item.classList.toggle('is-reading', item === step));
    links.forEach(link => {
      if (link.dataset.roadmapLink === slug) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const link = links.find(item => item.dataset.roadmapLink === slug);
    if (label && link) label.textContent = 'در حال مشاهده: ' + link.querySelector('b').textContent;
  }
  function refresh() {
    const line = Math.min(260, innerHeight * .3);
    let selected = steps[0];
    for (const step of steps) {
      if (step.getBoundingClientRect().top <= line) selected = step;
    }
    setActive(selected);
  }
  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; refresh(); });
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', refresh);
  refresh();
})();
