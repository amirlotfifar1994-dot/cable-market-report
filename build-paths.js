(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.path-tabs [role="tab"]'));
  var panels = { wp: document.getElementById('panel-wp'), code: document.getElementById('panel-code') };
  function activate(route, focus) {
    tabs.forEach(function (tab) {
      var selected = tab.getAttribute('data-route') === route;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    Object.keys(panels).forEach(function (key) { panels[key].hidden = key !== route; });
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { activate(tab.getAttribute('data-route'), false); });
    tab.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      var next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowLeft' ? 1 : -1) + tabs.length) % tabs.length;
      activate(tabs[next].getAttribute('data-route'), true);
    });
  });

  function showHashTarget() {
    if (window.location.hash !== '#ai-editorial') return;
    activate('code', false);
    window.requestAnimationFrame(function () {
      document.getElementById('ai-editorial').scrollIntoView({ block: 'start' });
    });
  }
  window.addEventListener('hashchange', showHashTarget);
  showHashTarget();

  var editorialStages = [
    { title: 'منابع معتبر و مجاز', copy: 'فهرست محدود از خوراک‌های RSS و API سازندگان، نهادهای استاندارد و رسانه‌های تخصصی تهیه می‌شود. نشانی منبع، تاریخ انتشار و اجازه استفاده از محتوا کنار هر مورد ثبت می‌شود.', output: 'خروجی: فهرست خبر و داده با لینک و تاریخ منبع' },
    { title: 'گردآوری با n8n', copy: 'اجرای زمان‌بندی‌شده، داده تازه را دریافت می‌کند؛ موارد تکراری، قدیمی یا بی‌ربط به سبد کابل را کنار می‌گذارد و موضوع‌های قابل بررسی را در صف محتوا قرار می‌دهد.', output: 'خروجی: صف موضوع‌های تازه و مرتبط' },
    { title: 'تحلیل عامل AI', copy: 'عامل AI موضوع را با خانواده‌های محصول و پرسش‌های خریدار ایرانی تطبیق می‌دهد، ادعاهای قابل استناد را استخراج می‌کند و خلأ محتوایی سایت را پیشنهاد می‌دهد. هر ادعا باید به منبع اصلی متصل بماند.', output: 'خروجی: بریف مقاله، زاویه اختصاصی و فهرست ادعاها' },
    { title: 'بازبینی فنی', copy: 'کارشناس کابل، مشخصات، استانداردها، کاربرد و ارتباط مدل‌ها را با دیتاشیت و منابع اصلی تطبیق می‌دهد. موارد نامطمئن یا فاقد سند حذف می‌شوند.', output: 'خروجی: بریف فنی تأییدشده یا رد موضوع' },
    { title: 'پیش‌نویس سئو', copy: 'از بریف تأییدشده، مقاله فارسی با پاسخ روشن، ساختار تیتر، جدول یا تصویر مفید، لینک به مدل‌های مرتبط، عنوان و توضیح متا ساخته می‌شود. تحلیل و مثال بومی باید ارزش تازه به منابع اضافه کند.', output: 'خروجی: پیش‌نویس در CMS، نه صفحه منتشرشده' },
    { title: 'تأیید و به‌روزرسانی', copy: 'ویراستار و مسئول فنی متن نهایی را تأیید می‌کنند؛ سپس منتشر می‌شود. تاریخ بازبینی و عملکرد صفحه در Search Console، اصلاح یا به‌روزرسانی بعدی را هدایت می‌کند.', output: 'خروجی: مقاله منتشرشده با مالک و تاریخ بازبینی' }
  ];
  var stageButtons = Array.prototype.slice.call(document.querySelectorAll('[data-editorial-stage]'));
  var stageTitle = document.getElementById('editorial-stage-title');
  var stageCopy = document.getElementById('editorial-stage-copy');
  var stageOutput = document.getElementById('editorial-stage-output');
  function selectEditorialStage(index) {
    var stage = editorialStages[index];
    if (!stage || !stageTitle) return;
    stageButtons.forEach(function (button, buttonIndex) {
      button.setAttribute('aria-pressed', buttonIndex === index ? 'true' : 'false');
    });
    stageTitle.textContent = stage.title;
    stageCopy.textContent = stage.copy;
    stageOutput.textContent = stage.output;
  }
  stageButtons.forEach(function (button, index) {
    button.addEventListener('click', function () { selectEditorialStage(index); });
  });
  selectEditorialStage(0);

  var form = document.getElementById('path-decision');
  if (!form) return;
  var labels = {
    speed: ['انتشار سریع‌تر کاتالوگ', 'تجربه کاملاً اختصاصی'],
    rfq: ['استعلام ساده و قابل ویرایش', 'قوانین چندمرحله‌ای استعلام'],
    integration: ['اتصال ساده در نسخه اول', 'اتصال ERP، CRM یا موجودی زنده'],
    editing: ['ویرایش مستقیم توسط تیم فروش', 'وجود تیم فنی یا پنل اختصاصی'],
    search: ['جست‌وجوی کد و فیلتر مشخص', 'تطبیق فنی و جست‌وجوی پیچیده']
  };
  function updateDecision() {
    var data = new FormData(form);
    var score = { wp: 0, code: 0 };
    var reasons = [];
    Object.keys(labels).forEach(function (name) {
      var value = data.get(name);
      if (value !== 'wp' && value !== 'code') return;
      score[value] += 1;
      reasons.push({ route: value, text: labels[name][value === 'wp' ? 0 : 1] });
    });
    var route = score.wp > score.code ? 'wp' : 'code';
    var close = Math.abs(score.wp - score.code) <= 1;
    document.getElementById('decision-title').textContent = close ? 'دو مسیر به هم نزدیک‌اند؛ یک نمونه فنی لازم است' : route === 'wp' ? 'وردپرس برای نسخه اول مناسب‌تر به نظر می‌رسد' : 'توسعه اختصاصی برای این دامنه مناسب‌تر به نظر می‌رسد';
    document.getElementById('decision-copy').textContent = close ? 'پیش از انتخاب، نمونه جست‌وجوی پارت‌نامبر و RFQ را با داده واقعی در هر دو راه ارزیابی کنید.' : route === 'wp' ? 'پاسخ‌ها بیشتر به انتشار و مدیریت کاتالوگ با سفارشی‌سازی محدود اشاره می‌کنند.' : 'پاسخ‌ها به منطق فنی، اتصال‌ها یا تجربه اختصاصی پررنگ‌تر اشاره می‌کنند.';
    document.getElementById('score-wp').textContent = String(score.wp).toLocaleString('fa-IR');
    document.getElementById('score-code').textContent = String(score.code).toLocaleString('fa-IR');
    document.getElementById('bar-wp').style.width = (score.wp * 20) + '%';
    document.getElementById('bar-code').style.width = (score.code * 20) + '%';
    var box = document.getElementById('decision-reasons');
    box.replaceChildren();
    reasons.filter(function (item) { return item.route === route; }).slice(0, 3).forEach(function (item) {
      var span = document.createElement('span');
      span.textContent = item.text;
      box.appendChild(span);
    });
  }
  form.addEventListener('change', updateDecision);
  updateDecision();
}());
