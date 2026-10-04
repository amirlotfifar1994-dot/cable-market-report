(function () {
  'use strict';
  const form = document.getElementById('client-brief-form');
  if (!form) return;
  const controls = Array.from(form.querySelectorAll('input[name],textarea[name],select[name]'));
  const key = 'cable-client-brief-v1';
  const saveStatus = document.getElementById('cb-save-status');
  const exportStatus = document.getElementById('cb-export-status');
  const fa = value => String(value).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[digit]);
  let saved = false;
  function syncAccount() {
    const value = form.elements.account_need.value;
    form.querySelector('.cb-account-fields').hidden = value === 'خیر';
    document.getElementById('cb-account-note').hidden = value !== 'خیر';
  }
  function relevant(control) { return !control.closest('[hidden]'); }
  function answer(control) { return control.value.trim(); }
  function summary() {
    const lines = ['اطلاعات کارفرما | طراحی فروشگاه کابل', 'تاریخ تهیه خلاصه: ' + new Date().toLocaleDateString('fa-IR'), 'پاسخ‌ها برای بررسی و جمع‌بندی‌اند؛ موارد نامشخص نیاز به تصمیم دارند.', ''];
    form.querySelectorAll('.cb-section').forEach(section => {
      lines.push('── ' + section.querySelector('.cb-section-title strong').textContent + ' ──');
      section.querySelectorAll('[name]').forEach(control => {
        if (!relevant(control)) return;
        lines.push(control.dataset.label + ': ' + (answer(control) || 'هنوز پاسخ داده نشده') + '\n');
      });
    });
    const pending = controls.filter(control => relevant(control) && control.dataset.essential && !answer(control));
    lines.push('── موارد لازم برای شروع که هنوز پاسخ ندارند ──', pending.length ? pending.map(control => '• ' + control.dataset.label).join('\n') : 'همه موارد شروع پاسخ دارند؛ برای تأیید محتوا و دامنه پروژه جمع‌بندی شوند.');
    return lines.join('\n');
  }
  function update() {
    syncAccount();
    const applicable = controls.filter(relevant);
    const filled = applicable.filter(control => answer(control));
    const essential = applicable.filter(control => control.dataset.essential);
    const essentialFilled = essential.filter(control => answer(control));
    document.getElementById('cb-progress').max = applicable.length;
    document.getElementById('cb-progress').value = filled.length;
    document.getElementById('cb-percent').textContent = fa(Math.round(filled.length / applicable.length * 100)) + '٪';
    document.getElementById('cb-progress-label').textContent = fa(filled.length) + ' از ' + fa(applicable.length) + ' سؤال پاسخ دارد';
    document.getElementById('cb-essential-label').textContent = fa(essentialFilled.length) + ' از ' + fa(essential.length) + ' مورد شروع پاسخ دارد';
    form.querySelectorAll('.cb-section').forEach(section => {
      const items = Array.from(section.querySelectorAll('[name]')).filter(relevant);
      section.querySelector('.cb-count').textContent = fa(items.filter(answer).length) + ' / ' + fa(items.length);
    });
    document.getElementById('cb-summary-text').textContent = summary();
  }
  const startingFilter = document.getElementById('cb-starting-filter');
  function setStartingView(filtering) {
    if (!startingFilter) return;
    startingFilter.setAttribute('aria-pressed', String(filtering));
    startingFilter.textContent = filtering ? 'نمایش همه سؤال‌ها' : 'فقط سؤال‌های شروع';
    form.classList.toggle('cb-only-starting', filtering);
    form.querySelectorAll('.cb-section').forEach(section => {
      const panel = section.querySelector('.cb-panel');
      if (filtering && section.querySelector('[data-essential]')) panel.open = true;
      section.classList.toggle('cb-no-starting', filtering && !section.querySelector('[data-essential]'));
    });
    // This is a view filter; all relevant answers still count and export.
  }
  if (startingFilter) startingFilter.addEventListener('click', () => {
    setStartingView(startingFilter.getAttribute('aria-pressed') !== 'true');
  });
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.version === 1 && data.answers && typeof data.answers === 'object') {
        controls.forEach(control => {
          const value = data.answers[control.name];
          if (typeof value !== 'string') return;
          if (control.tagName === 'SELECT') {
            if (Array.from(control.options).some(option => option.value === value)) control.value = value;
          } else control.value = value.slice(0, control.maxLength);
        });
        saved = true;
        saveStatus.textContent = 'پاسخ‌های ذخیره‌شده این مرورگر بازیابی شد';
      }
    }
  } catch (_) { saveStatus.textContent = 'ذخیره مرورگر در دسترس نیست؛ خلاصه را دانلود کنید.'; }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => {
    update();
    saved = false;
    saveStatus.textContent = 'تغییرات جدید ذخیره نشده است';
  });
  document.getElementById('cb-save').addEventListener('click', () => {
    const answers = {};
    controls.forEach(control => { answers[control.name] = control.value; });
    try {
      localStorage.setItem(key, JSON.stringify({ version: 1, answers, updatedAt: new Date().toISOString() }));
      saved = true;
      saveStatus.textContent = 'در همین مرورگر ذخیره شد · ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    } catch (_) { saveStatus.textContent = 'ذخیره نشد؛ برای نگه‌داشتن پاسخ‌ها، خلاصه را دانلود کنید.'; }
  });
  document.getElementById('cb-download').addEventListener('click', () => {
    const blob = new Blob(['\ufeff' + summary()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'cable-client-brief.txt';
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    exportStatus.textContent = 'فایل خلاصه آماده شد؛ آن را از مسیر هماهنگ‌شده برای تیم طراحی بفرستید.';
  });
  document.getElementById('cb-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary());
      exportStatus.textContent = 'خلاصه کپی شد.';
    } catch (_) {
      document.querySelector('.cb-summary-preview').open = true;
      exportStatus.textContent = 'کپی خودکار در دسترس نیست؛ متن خلاصه را انتخاب و کپی کنید یا دانلود کنید.';
    }
  });
  document.getElementById('cb-print').addEventListener('click', () => {
    update(); document.querySelector('.cb-summary-preview').open = true; window.print();
  });
  const confirm = document.getElementById('cb-reset-confirm');
  document.getElementById('cb-reset').addEventListener('click', () => {
    confirm.hidden = false; document.getElementById('cb-reset-cancel').focus();
  });
  document.getElementById('cb-reset-cancel').addEventListener('click', () => {
    confirm.hidden = true; document.getElementById('cb-reset').focus();
  });
  document.getElementById('cb-reset-yes').addEventListener('click', () => {
    try { localStorage.removeItem(key); }
    catch (_) { exportStatus.textContent = 'نسخه مرورگر پاک نشد؛ داده سایت را در تنظیمات مرورگر حذف کنید.'; return; }
    form.reset(); saved = false; update(); confirm.hidden = true;
    saveStatus.textContent = 'پاسخ‌ها و نسخه ذخیره‌شده پاک شدند';
    exportStatus.textContent = 'فرم برای پروژه جدید خالی شد.';
    document.getElementById('cb-reset').focus();
  });
  document.querySelectorAll('.cb-sidebar a[href^="#brief-"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.hash.slice(1));
      if (target && target.classList.contains('cb-no-starting')) setStartingView(false);
      const panel = target && target.querySelector('details');
      if (panel) panel.open = true;
    });
  });
  function openHash() {
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.classList.contains('cb-no-starting')) setStartingView(false);
    const panel = target && target.querySelector('.cb-panel');
    if (panel) panel.open = true;
  }
  window.addEventListener('hashchange', openHash);
  window.addEventListener('beforeunload', event => {
    if (saved || !controls.some(answer)) return;
    event.preventDefault(); event.returnValue = '';
  });
  update(); openHash();
})();
