(function () {
  const scopes = {
    quote: {
      title: 'کاتالوگ و استعلام',
      intro: 'کالا عمومی است؛ درخواست، فایل مشتری و پیش‌فاکتور خصوصی‌اند. پرداخت فقط در صورت اضافه‌شدن واقعی آن وارد دامنه می‌شود.',
      groups: [
        ['داده حساس', ['حساب و راه تماس مشتری', 'BOM، شرایط پروژه و مبلغ خصوصی سند']],
        ['P0 برای شروع', ['ورود و بازیابی کنترل‌شده + MFA کارکنان', 'مالکیت هر سند، فایل خصوصی و خروج از کش عمومی']],
        ['نیاز توسعه', ['افزونه RFQ با قواعد مالکیت و نسخه یا توسعه همان بخش', 'نقش فروش محدود و ثبت قیمت/نسخه سند']],
        ['خروجی تحویل', ['دو مشتری با دسترسی مستقل و مسیر پیگیری', 'اثبات بازیابی DB و فایل سند + محدودیت OTP']]
      ]
    },
    hybrid: {
      title: 'فروشگاه و استعلام',
      intro: 'اقلام آماده با WooCommerce فروخته می‌شوند و اقلام خاص استعلامی‌اند؛ هر SKU روش فروش مشخص دارد.',
      groups: [
        ['داده حساس', ['حساب، نشانی و سفارش مشتری', 'قیمت مرجع، نسخه پیش‌فاکتور و وضعیت پرداخت']],
        ['P0 برای شروع', ['همه کنترل‌های استعلام + مجوز تغییر قیمت', 'محاسبه مبلغ در سرور، تأیید پرداخت و کنترل درخواست تکراری']],
        ['نیاز توسعه', ['افزونه درگاه معتبر + RFQ سازگار با حساب و کش', 'میز قیمت محدود با ثبت تغییر و کنترل هم‌زمانی']],
        ['خروجی تحویل', ['خرید و استعلام دو قیف جدا با مالکیت یکسان', 'سند تغییرناپذیر پس از صدور، سفارش یکتا و بازیابی هماهنگ']]
      ]
    },
    company: {
      title: 'مشتری شرکتی و اتصال ERP',
      intro: 'علاوه بر فروشگاه/استعلام، اعضای شرکت، سقف تأیید و پیام‌های سیستم بیرونی دامنه مستقل می‌خواهند.',
      groups: [
        ['داده حساس', ['اسناد سازمانی، اعضا و نقش هر نماینده', 'قیمت قراردادی، سقف تأیید و اطلاعات همگام‌سازی']],
        ['P0 برای شروع', ['company_id تأییدشده، عضویت فعال و مجوز هر عملیات', 'کلید محدود API، کنترل پیام تکراری و لغو فوری دسترسی عضو']],
        ['نیاز توسعه', ['افزونه اختصاصی/راهکار B2B با مجوز سمت سرور', 'صف اتصال ERP، سیاست اختلاف داده و لاگ تغییر']],
        ['خروجی تحویل', ['مشاهده‌گر، تأییدکننده و عضو حذف‌شده با رفتار مستقل', 'retry کنترل‌شده، سند نسخه‌دار و تطبیق بعد از بازیابی']]
      ]
    }
  };
  const result = document.getElementById('security-scope-result');
  const choices = document.getElementById('security-scope-choices');
  let current = 'hybrid';
  function renderScope() {
    const scope = scopes[current];
    choices.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.securityScope === current)));
    result.innerHTML = '<span class="ir-pill">دامنه پیشنهادی اجرا</span><h3>' + scope.title + '</h3><p class="ir-route-sub">' + scope.intro + '</p><div class="ir-route-detail">' + scope.groups.map(g => '<div><h4>' + g[0] + '</h4><ul>' + g[1].map(item => '<li>' + item + '</li>').join('') + '</ul></div>').join('') + '</div><a href="#acceptance">مشاهده معیارهای پذیرش ←</a>';
  }
  choices.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { if (Object.hasOwn(scopes, b.dataset.securityScope)) { current = b.dataset.securityScope; renderScope(); } }));
  renderScope();

  const tasks = [
    ['host', 'P0', 'مالکیت دامنه/هاست/ایمیل + MFA و بازیابی', 'مالک + میزبان', 'layers'],
    ['versions', 'P0', 'فهرست نسخه، مجوز و محیط staging محافظت‌شده', 'مجری فنی', 'layers'],
    ['staff', 'P0', 'نقش شخصی کارکنان و TOTP بدون دسترسی مشترک', 'مدیر فنی', 'roles'],
    ['identity', 'P0', 'شناسه تأییدشده، اتصال و بازیابی مشتری', 'مجری + پشتیبانی', 'login'],
    ['otp', 'P0', 'انقضا، مصرف یک‌بار و محدودیت OTP سمت سرور', 'مجری OTP', 'login'],
    ['ownership', 'P0', 'مجوز و مالکیت سند/شرکت در هر درخواست', 'توسعه‌دهنده', 'quotes'],
    ['files', 'P0', 'فایل خصوصی، سیاست کش و پیوست مجاز', 'مجری + میزبان', 'quotes'],
    ['snapshots', 'P0', 'snapshot، نسخه/اعتبار و سفارش یکتا', 'توسعه‌دهنده + فروش', 'quotes'],
    ['prices', 'P0', 'تغییر قیمت محدود و رویداد قبل/بعد', 'مجری + فروش', 'roles'],
    ['services', 'P0', 'کلیدهای محدود و سرویس‌های فعال در دامنه سایت', 'مجری', 'integrations'],
    ['backup', 'P0', 'نسخه هماهنگ DB/فایل و شاهد بازیابی', 'هاست + نگه‌داری', 'operations'],
    ['incident', 'P0', 'مسئول رخداد، راه تماس و بازه پوشش', 'مالک + نگه‌داری', 'operations'],
    ['alerts', 'P1', 'هشدار لاگ/هزینه و بازنگری محدودیت‌ها', 'نگه‌داری', 'operations'],
    ['review', 'P1', 'تقویم بازبینی دسترسی، نسخه و نگه‌داری داده', 'مالک + مجری', 'delivery']
  ];
  const states = [['unknown', 'ثبت نشده'], ['planned', 'در برنامه اجرا'], ['delivered', 'شاهد تحویل ثبت شده']];
  const storageKey = 'cable-security-handover-notes-v1';
  let notes = {};
  try { const saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); if (saved && typeof saved === 'object' && !Array.isArray(saved)) { for (const t of tasks) { if (states.some(s => s[0] === saved[t[0]])) notes[t[0]] = saved[t[0]]; } } } catch (_) {}
  const mount = document.getElementById('security-task-list');
  mount.innerHTML = tasks.map(t => '<article class="sec-task"><span class="ir-pill">' + t[1] + '</span><div><h3><a href="#' + t[4] + '">' + t[2] + '</a></h3><p>مسئول: ' + t[3] + '</p></div><label><span class="sec-state-label">یادداشت وضعیت</span><select data-security-task="' + t[0] + '" aria-label="وضعیت ' + t[2] + '">' + states.map(s => '<option value="' + s[0] + '"' + ((notes[t[0]] || 'unknown') === s[0] ? ' selected' : '') + '>' + s[1] + '</option>').join('') + '</select></label></article>').join('');
  function update() {
    let count = 0;
    mount.querySelectorAll('select').forEach(s => { notes[s.dataset.securityTask] = s.value; s.closest('.sec-task').dataset.state = s.value; if (s.value === 'delivered') count++; });
    document.getElementById('security-progress-label').textContent = count.toLocaleString('fa-IR') + ' از ' + tasks.length.toLocaleString('fa-IR') + ' مورد با یادداشت شاهد تحویل';
    try { localStorage.setItem(storageKey, JSON.stringify(notes)); } catch (_) {}
  }
  mount.addEventListener('change', update);
  document.getElementById('security-reset-notes').addEventListener('click', () => { mount.querySelectorAll('select').forEach(s => s.value = 'unknown'); update(); });
  update();
})();
