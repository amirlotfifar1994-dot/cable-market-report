(function(){
  const host=document.getElementById('price-demo');
  if(!host)return;
  const initial=[
    {id:'CTRL-4G25',name:'کابل کنترل انعطاف‌پذیر',type:'گزینه ۲٫۵ mm²',unit:'متر',regular:128000,sale:119000,mode:'public'},
    {id:'CTRL-4G15',name:'کابل کنترل انعطاف‌پذیر',type:'گزینه ۱٫۵ mm²',unit:'متر',regular:95000,sale:null,mode:'public'},
    {id:'NET-CAT6-305',name:'کابل شبکه Cat6',type:'محصول ساده',unit:'بسته ۳۰۵ متری',regular:8750000,sale:null,mode:'public'},
    {id:'PWR-3X25',name:'کابل قدرت مسی',type:'محصول ساده',unit:'متر',regular:185000,sale:null,mode:'public'},
    {id:'IC-2P15',name:'کابل ابزار دقیق شیلددار',type:'تأمین سفارشی',unit:'متر',regular:null,sale:null,mode:'quote'}
  ];
  const copy=value=>JSON.parse(JSON.stringify(value));
  let saved=copy(initial),draft=copy(initial),previous=null;
  const selected=new Set();
  const format=value=>new Intl.NumberFormat('fa-IR').format(value);
  host.innerHTML='<div class="price-demo-banner"><div><small>INTERACTIVE CONCEPT / WOOCOMMERCE</small><h3>میز قیمت مسئول فروش</h3></div><span>نمونه نمایشی · بدون اتصال به فروشگاه واقعی</span></div><div class="price-demo-toolbar"><label>پیدا کردن کالا<input id="price-search" type="search" placeholder="نام محصول یا SKU"></label><label>مسیر خرید<select id="price-filter"><option value="all">همه اقلام</option><option value="public">خرید مستقیم</option><option value="quote">استعلامی</option></select></label><div><b id="price-count">۰ قلم انتخاب شده</b><button type="button" id="price-select-visible">انتخاب / لغو همه نتایج</button><small>قیمت‌ها: تومان نمونه / واحد فروش هر ردیف</small></div></div><div class="price-bulk"><label>تغییر درصدی<input type="number" id="price-percent" value="5" min="-99" max="1000" step="0.1"></label><label class="price-check"><input id="price-sale-bulk" type="checkbox" checked>قیمت ویژه هم تغییر کند</label><button type="button" id="price-bulk-apply">اعمال به اقلام انتخاب‌شده</button><small>عدد منفی برای کاهش؛ نتیجه تا ذخیره در پیش‌نویس می‌ماند.</small></div><div class="price-table-scroll"><table class="price-table"><caption class="visually-hidden">ویرایش قیمت‌های نمونه</caption><thead><tr><th><input id="price-select-all" type="checkbox" aria-label="انتخاب همه اقلام نمایان"></th><th>محصول / کد</th><th>واحد فروش</th><th>قیمت عادی</th><th>قیمت ویژه</th><th>مسیر خرید</th></tr></thead><tbody id="price-rows"></tbody></table></div><div class="price-savebar"><button type="button" id="price-save">ذخیره و نمایش نتیجه نمونه</button><button type="button" id="price-undo" disabled>برگشت آخرین ذخیره</button><button type="button" id="price-export">خروجی CSV قیمت‌های ذخیره‌شده</button><button type="button" id="price-reset">بازنشانی نمونه</button></div><p id="price-message" class="price-message" role="status" aria-live="polite">یک قیمت را تغییر بدهید و نتیجه را در پیش‌نمایش پایین ببینید. اطلاعات فقط در همین صفحه نگه‌داری می‌شود.</p><div class="price-preview-head"><div><small>STOREFRONT PREVIEW</small><h3>آنچه خریدار بعد از ذخیره می‌بیند</h3></div><span>یک قیمت در کارت، محصول و سبد خرید</span></div><div id="price-preview" class="price-preview"></div><p class="price-demo-footnote">این پنل طرح پیشنهادی یک افزونه مدیریتی است. تغییر حالت استعلام، به پنهان‌سازی قیمت و غیرفعال کردن خرید در سمت سرور نیاز دارد و جزو ویرایش سریع پیش‌فرض ووکامرس نیست. CSV این نمونه فقط قیمت اقلام قابل خرید را صادر می‌کند.</p>';
  const $=selector=>host.querySelector(selector);
  function visible(){const q=$('#price-search').value.trim().toLowerCase();const filter=$('#price-filter').value;return draft.filter(p=>(p.name+' '+p.id).toLowerCase().includes(q)&&(filter==='all'||p.mode===filter));}
  function message(text,error=false){$('#price-message').textContent=text;$('#price-message').classList.toggle('error',error);}
  function counter(){const all=visible();$('#price-count').textContent=format(selected.size)+' قلم انتخاب شده';$('#price-select-all').checked=!!all.length&&all.every(p=>selected.has(p.id));$('#price-select-all').indeterminate=all.some(p=>selected.has(p.id))&&!$('#price-select-all').checked;}
  function renderRows(){
    const rows=visible();
    $('#price-rows').innerHTML=rows.length?rows.map(p=>'<tr data-id="'+p.id+'"><td><input type="checkbox" data-field="selected" '+(selected.has(p.id)?'checked':'')+' aria-label="انتخاب '+p.id+'"></td><td><b>'+p.name+'</b><code dir="ltr">'+p.id+'</code><small>'+p.type+'</small></td><td>'+p.unit+'</td><td><input type="number" min="1" step="1" inputmode="numeric" data-field="regular" value="'+(p.regular??'')+'" '+(p.mode==='quote'?'disabled':'')+' aria-label="قیمت عادی '+p.id+'"></td><td><input type="number" min="1" step="1" inputmode="numeric" data-field="sale" value="'+(p.sale??'')+'" '+(p.mode==='quote'?'disabled':'')+' placeholder="بدون تخفیف" aria-label="قیمت ویژه '+p.id+'"></td><td><select data-field="mode" aria-label="مسیر خرید '+p.id+'"><option value="public" '+(p.mode==='public'?'selected':'')+'>خرید مستقیم</option><option value="quote" '+(p.mode==='quote'?'selected':'')+'>استعلامی</option></select></td></tr>').join(''):'<tr><td colspan="6">کالایی با این جست‌وجو پیدا نشد.</td></tr>';
    counter();
  }
  function renderPreview(){
    $('#price-preview').innerHTML=saved.map(p=>'<article><small dir="ltr">'+p.id+'</small><h4>'+p.name+'</h4><span>'+p.type+' · '+p.unit+'</span>'+(p.mode==='quote'?'<strong class="quote">استعلام قیمت</strong><b>درخواست تأمین ↗</b>':(p.sale?'<del>'+format(p.regular)+'</del>':'')+'<strong>'+format(p.sale??p.regular)+' <small>تومان / '+p.unit+'</small></strong><b>افزودن به سبد +</b>')+'</article>').join('');
    $('#price-undo').disabled=!previous;
  }
  host.addEventListener('input',event=>{
    const input=event.target, row=input.closest('tr[data-id]');
    if(!row)return;
    const p=draft.find(item=>item.id===row.dataset.id);
    if(['regular','sale'].includes(input.dataset.field))p[input.dataset.field]=input.value===''?null:Number(input.value);
  });
  host.addEventListener('change',event=>{
    const input=event.target,row=input.closest('tr[data-id]');
    if(!row)return;
    const p=draft.find(item=>item.id===row.dataset.id);
    if(input.dataset.field==='selected'){input.checked?selected.add(p.id):selected.delete(p.id);counter();}
    if(input.dataset.field==='mode'){p.mode=input.value;renderRows();message('مسیر خرید در پیش‌نویس تغییر کرد؛ برای اعمال در پیش‌نمایش ذخیره کنید.');}
  });
  $('#price-select-visible').addEventListener('click',()=>{const all=visible();const clear=all.length&&all.every(p=>selected.has(p.id));all.forEach(p=>clear?selected.delete(p.id):selected.add(p.id));renderRows();});
  $('#price-search').addEventListener('input',renderRows);
  $('#price-filter').addEventListener('change',renderRows);
  $('#price-select-all').addEventListener('change',event=>{visible().forEach(p=>event.target.checked?selected.add(p.id):selected.delete(p.id));renderRows();});
  $('#price-bulk-apply').addEventListener('click',()=>{
    const raw=$('#price-percent').value,percent=Number(raw);
    if(raw===''||!Number.isFinite(percent)||percent<=-100||percent>1000)return message('درصد باید بیشتر از منفی ۱۰۰ و حداکثر ۱۰۰۰ باشد.',true);
    const candidates=draft.filter(p=>selected.has(p.id)&&p.mode==='public');
    if(!candidates.length)return message('حداقل یک قلم قابل خرید را انتخاب کنید. اقلام استعلامی قیمت‌گذاری گروهی نمی‌شوند.',true);
    if(candidates.some(p=>!Number.isFinite(p.regular)||p.regular<=0))return message('ابتدا قیمت عادی معتبر را برای اقلام انتخاب‌شده وارد کنید.',true);
    candidates.forEach(p=>{p.regular=Math.max(1,Math.round(p.regular*(1+percent/100)));if($('#price-sale-bulk').checked&&p.sale!==null)p.sale=Math.max(1,Math.round(p.sale*(1+percent/100)));});
    renderRows();message('پیش‌نویس قیمت '+format(candidates.length)+' قلم تغییر کرد. برای نمایش نتیجه، ذخیره کنید.');
  });
  $('#price-save').addEventListener('click',()=>{
    for(const p of draft){
      if(p.mode==='quote')continue;
      if(!Number.isFinite(p.regular)||p.regular<=0||!Number.isInteger(p.regular))return message('قیمت عادی '+p.id+' باید عدد صحیح و بیشتر از صفر باشد.',true);
      if(p.sale!==null&&(!Number.isFinite(p.sale)||p.sale<=0||!Number.isInteger(p.sale)||p.sale>=p.regular))return message('قیمت ویژه '+p.id+' باید مثبت و کمتر از قیمت عادی باشد؛ برای حذف تخفیف فیلد را خالی کنید.',true);
    }
    previous=copy(saved);saved=copy(draft);renderPreview();message('قیمت‌های نمونه ذخیره شدند و پیش‌نمایش فروشگاه به‌روز شد. هیچ فروشگاه واقعی تغییر نکرده است.');
  });
  $('#price-undo').addEventListener('click',()=>{if(!previous)return;saved=copy(previous);draft=copy(saved);previous=null;renderRows();renderPreview();message('آخرین ذخیره نمونه برگشت داده شد.');});
  $('#price-reset').addEventListener('click',()=>{saved=copy(initial);draft=copy(initial);previous=null;selected.clear();$('#price-percent').value='5';$('#price-sale-bulk').checked=true;$('#price-search').value='';$('#price-filter').value='all';renderRows();renderPreview();message('نمونه به قیمت‌های اولیه برگشت.');});
  $('#price-export').addEventListener('click',()=>{
    const csv='SKU,Regular price,Sale price\r\n'+saved.filter(p=>p.mode==='public').map(p=>[p.id,p.regular,p.sale??''].join(',')).join('\r\n')+'\r\n';
    const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='sample-woocommerce-price-update.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    message('CSV نمونه صادر شد. در فروشگاه واقعی، SKUها و واحد پول باید دقیقاً مطابق داده‌های همان فروشگاه باشند؛ قیمت‌های ذخیره‌شده صادر می‌شوند.');
  });
  renderRows();renderPreview();
})();
