(function () {
  var root = document.documentElement;
  var themeButton = document.getElementById('theme-toggle');
  var storedTheme;
  try { storedTheme = localStorage.getItem('cable-report-theme'); } catch (_) {}
  if (storedTheme === 'light' || storedTheme === 'dark') root.setAttribute('data-theme', storedTheme);
  function syncTheme() {
    if (!themeButton) return;
    var light = root.getAttribute('data-theme') === 'light';
    themeButton.textContent = light ? '☾' : '☀';
    themeButton.setAttribute('aria-label', light ? 'تغییر به تم تیره' : 'تغییر به تم روشن');
  }
  syncTheme();
  if (themeButton) themeButton.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('cable-report-theme', next); } catch (_) {}
    syncTheme();
  });

  var progress = document.getElementById('reading-bar');
  function updateProgress() {
    if (!progress) return;
    var range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0) + ')';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  var tocButton = document.getElementById('toc-fab');
  var tocPanel = document.getElementById('toc-panel');
  if (tocButton && tocPanel) {
    var headings = Array.prototype.slice.call(document.querySelectorAll('main section[id] > .section-head h2'));
    headings.forEach(function (heading) {
      var section = heading.closest('section');
      var link = document.createElement('a');
      link.href = '#' + section.id;
      link.textContent = heading.textContent.trim();
      tocPanel.appendChild(link);
    });
    tocButton.addEventListener('click', function () {
      var opening = tocPanel.hidden;
      tocPanel.hidden = !opening;
      tocButton.setAttribute('aria-expanded', opening ? 'true' : 'false');
    });
    tocPanel.addEventListener('click', function (event) {
      if (!event.target.closest('a')) return;
      tocPanel.hidden = true;
      tocButton.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      tocPanel.hidden = true;
      tocButton.setAttribute('aria-expanded', 'false');
    });
  }

  document.querySelectorAll('.filter[data-filter]').forEach(function (button) {
    button.addEventListener('click', function () {
      var tag = button.getAttribute('data-filter');
      document.querySelectorAll('.filter[data-filter]').forEach(function (item) {
        var active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      document.querySelectorAll('.competitor[data-tags]').forEach(function (card) {
        card.hidden = tag !== 'all' && card.getAttribute('data-tags').split(' ').indexOf(tag) < 0;
      });
    });
  });

  document.querySelectorAll('.atlas-analysis-links a[href^="#analysis-"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      var card = target && target.closest('.competitor');
      if (!card || !card.hidden) return;
      var allFilter = document.querySelector('.filter[data-filter="all"]');
      if (allFilter) allFilter.click();
    });
  });

  document.querySelectorAll('.atlas-item').forEach(function (item) {
    if (!item.querySelector('.shot-pair')) return;
    item.setAttribute('data-device', 'desktop');
    var controls = document.createElement('div');
    controls.className = 'atlas-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'انتخاب نمای تصویر');
    controls.innerHTML = '<button type="button" data-device="desktop" aria-pressed="true">دسکتاپ</button><button type="button" data-device="mobile" aria-pressed="false">گوشی</button>';
    item.querySelector('.atlas-item-head').after(controls);
    controls.querySelectorAll('button').forEach(function (button) {
      button.addEventListener('click', function () {
        item.setAttribute('data-device', button.getAttribute('data-device'));
        controls.querySelectorAll('button').forEach(function (candidate) {
          candidate.setAttribute('aria-pressed', candidate === button ? 'true' : 'false');
        });
      });
    });
  });

}());
