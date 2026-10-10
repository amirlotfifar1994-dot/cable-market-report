(() => {
  const root=document.getElementById('barad-pricing');if(!root)return;
  const cfg=window.baradPricing, $=id=>document.getElementById(id), states=new Map();let busy=false;
  const digits=s=>String(s).replace(/[۰-۹٠-٩]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.includes(c)?'۰۱۲۳۴۵۶۷۸۹'.indexOf(c):'٠١٢٣٤٥٦٧٨٩'.indexOf(c));
  const normalize=s=>digits(s).toLowerCase().replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/(\d)\s*[*×X]\s*(?=\d)/g,'$1x').trim();
  const decimal=(value,optional=false)=>{
    let s=digits(value).trim().replace(/٬/g,',').replace(/٫/g,'.');if(s===''&&optional)return '';
    if(!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(s))throw new Error('قیمت را به شکل عدد مثبت وارد کنید.');
    s=s.replace(/,/g,'');const parts=s.split('.');if(parts[0].replace(/^0+/,'').length>12||(parts[1]||'').length>cfg.decimals)throw new Error('تعداد رقم یا رقم اعشار مجاز نیست.');
    if(!Number.isFinite(Number(s))||Number(s)<=0)throw new Error('قیمت باید بیشتر از صفر باشد.');return Number(s).toFixed(cfg.decimals);
  };
  const num=n=>new Intl.NumberFormat('fa-IR').format(n);
  const el=(tag,props={},children=[])=>{const n=document.createElement(tag);Object.assign(n,props);children.forEach(c=>n.append(typeof c==='string'?document.createTextNode(c):c));return n;};
  const notice=(text,error=false)=>{const n=$('bp-notice');n.textContent=text;n.className='bp-notice '+(error?'bp-notice-error':'bp-notice-success');n.hidden=false;};
  const originalValues=o=>({regular:o.regular===''?'':Number(o.regular).toFixed(cfg.decimals),sale:o.sale===''?'':Number(o.sale).toFixed(cfg.decimals),contact:o.contact});
  const values=s=>s.contact.checked?{regular:'',sale:'',contact:true}:{regular:decimal(s.regular.value),sale:decimal(s.sale.value,true),contact:false};
  const changed=s=>{try{return JSON.stringify(values(s))!==JSON.stringify(originalValues(s.original));}catch{return true;}};
  const validate=s=>{if(s.contact.checked)return '';try{const v=values(s);return v.sale!==''&&Number(v.sale)>=Number(v.regular)?'قیمت ویژه باید از قیمت پایه کمتر باشد.':'';}catch(e){return e.message;}};
  const sync=s=>{const dirty=changed(s);s.row.classList.toggle('bp-changed',dirty);s.regular.disabled=busy;s.sale.disabled=busy||s.contact.checked||s.original.scheduled;s.contact.disabled=busy||s.original.scheduled;s.badge.textContent=dirty?'ذخیره نشده':(s.contact.checked?'استعلامی':'قیمت‌دار');s.badge.className='bp-badge '+(dirty?'bp-badge-dirty':'');};
  const refresh=()=>{
    const q=normalize($('bp-search').value),cat=$('bp-category').value,brand=$('bp-brand').value,mode=$('bp-price-filter').value;let shown=0,selected=0,dirty=0,hiddenDirty=0;
    for(const s of states.values()){
      const d=changed(s);if(d)dirty++;
      const visible=(!q||s.search.includes(q))&&(!cat||s.original.categories.some(t=>String(t.id)===cat))&&(!brand||s.original.brands.some(t=>String(t.id)===brand))&&(!mode||(mode==='dirty'?d:mode==='contact'?s.contact.checked:!s.contact.checked));
      s.row.hidden=!visible;if(!visible)s.selected.checked=false;else{shown++;if(s.selected.checked)selected++;}sync(s);
      if(d&&!visible)hiddenDirty++;
    }
    $('bp-count').textContent=num(shown)+' کالا از '+num(states.size);$('bp-empty').hidden=shown!==0;
    $('bp-selected').textContent=num(selected)+' کالا انتخاب شده';$('bp-select-all').checked=shown>0&&selected===shown;$('bp-select-all').indeterminate=selected>0&&selected<shown;
    $('bp-dirty').textContent=dirty?num(dirty)+' تغییر ذخیره‌نشده'+(hiddenDirty?'؛ '+num(hiddenDirty)+' مورد خارج از فیلتر':''):'همه قیمت‌ها ذخیره‌اند';
    $('bp-save').disabled=busy||!dirty;$('bp-reset').disabled=busy||!dirty;$('bp-apply').disabled=busy||!selected;
    $('bp-save').textContent=busy?'در حال ذخیره…':dirty?'ذخیره '+num(dirty)+' تغییر':'ذخیره تغییرات';
  };
  const resetRow=(s,item=s.original)=>{s.original=item;s.regular.value=item.regular;s.sale.value=item.sale;s.contact.checked=item.contact;s.error.textContent='';s.updated.textContent=item.updated?'آخرین ذخیره: '+item.updated:'';sync(s);};
  for(const item of JSON.parse($('bp-data').textContent)){
    const row=el('tr');row.dataset.id=item.id;
    const selected=el('input',{type:'checkbox'});selected.setAttribute('aria-label','انتخاب '+item.name);
    const product=el('td',{className:'bp-product'},[el('a',{href:item.url,target:'_blank',rel:'noopener',className:'bp-name'},[item.name]),el('bdi',{className:'bp-sku'},[item.sku]),el('span',{className:'bp-category-label'},[item.categories.map(t=>t.name).join('، ')]),el('a',{href:item.edit,className:'bp-edit'},['ویرایش محصول'])]);
    const regular=el('input',{type:'text',inputMode:'decimal',className:'bp-price-input',value:item.regular,id:'bp-regular-'+item.id,placeholder:'مثلاً ۱۲۵٬۰۰۰'});
    const sale=el('input',{type:'text',inputMode:'decimal',className:'bp-price-input',value:item.sale,id:'bp-sale-'+item.id,placeholder:'اختیاری'});
    const error=el('small',{className:'bp-row-error'});error.setAttribute('role','alert');
    const priceCell=el('td',{className:'bp-prices'},[el('span',{className:'bp-unit'},['هر '+item.unit+' · '+cfg.currency]),el('div',{className:'bp-price-fields'},[el('label',{htmlFor:regular.id},['قیمت پایه',regular]),el('label',{htmlFor:sale.id},['قیمت ویژه',sale])]),error]);
    const contact=el('input',{type:'checkbox',checked:item.contact,id:'bp-contact-'+item.id});const badge=el('span',{className:'bp-badge'}),updated=el('small',{className:'bp-updated'});
    const status=el('td',{className:'bp-status'},[el('label',{htmlFor:contact.id},[contact,' تماس برای قیمت']),badge,updated]);
    if(item.scheduled)status.append(el('small',{className:'bp-scheduled'},['تخفیف زمان‌بندی‌شده؛ تغییر وضعیت و تخفیف از ویرایش محصول']));
    row.append(el('td',{className:'bp-check'},[selected]),product,priceCell,status);$('bp-rows').append(row);
    const s={row,original:item,regular,sale,contact,selected,error,badge,updated,search:normalize([item.name,item.sku,item.size,item.model].join(' '))};states.set(item.id,s);
    for(const input of [regular,sale,contact])input.addEventListener(input===contact?'change':'input',()=>{if(input===regular&&regular.value.trim()!=='')s.contact.checked=false;s.error.textContent='';refresh();});selected.addEventListener('change',refresh);resetRow(s);
  }
  for(const id of ['bp-search','bp-category','bp-brand','bp-price-filter'])$(id).addEventListener(id==='bp-search'?'input':'change',refresh);
  $('bp-select-all').addEventListener('change',()=>{for(const s of states.values())if(!s.row.hidden)s.selected.checked=$('bp-select-all').checked;refresh();});
  $('bp-operation').addEventListener('change',()=>{const op=$('bp-operation').value;$('bp-bulk-value').hidden=op==='contact';$('bp-bulk-value').placeholder=op==='percent'?'مثل ۱۰ یا ‎-۵':'قیمت پایه هر واحد';});
  $('bp-apply').addEventListener('click',()=>{
    const selected=[...states.values()].filter(s=>s.selected.checked&&!s.row.hidden),op=$('bp-operation').value;let amount,count=0,skipped=0;
    try{
      if(op==='set')amount=decimal($('bp-bulk-value').value);
      if(op==='percent'){const raw=digits($('bp-bulk-value').value).trim().replace(/٫/g,'.');if(!/^-?\d+(?:\.\d+)?$/.test(raw)||Number(raw)<=-100||Number(raw)>10000)throw new Error('درصد باید بیشتر از ‎-۱۰۰ باشد؛ برای کاهش، عدد منفی وارد کنید.');amount=Number(raw);}
      const prepared=[];
      for(const s of selected){
        if((op!=='percent'&&s.original.scheduled)||(op==='percent'&&s.contact.checked)){skipped++;continue;}
        const regular=op==='contact'?'':op==='set'?amount:decimal((Number(decimal(s.regular.value))*(1+amount/100)).toFixed(cfg.decimals));
        if(op!=='contact'&&s.sale.value!==''&&Number(decimal(s.sale.value,true))>=Number(regular))throw new Error('قیمت پایه جدید از قیمت ویژه بعضی کالاها کمتر است؛ ابتدا قیمت ویژه را اصلاح کنید.');
        prepared.push({s,regular});
      }
      for(const {s,regular} of prepared){s.contact.checked=op==='contact';if(op!=='contact')s.regular.value=regular;s.error.textContent='';count++;}
      refresh();notice(num(count)+' کالا آمادهٔ ذخیره شد.'+(skipped?' '+num(skipped)+' کالای استعلامی یا دارای تخفیف زمان‌بندی‌شده تغییر نکرد.':''));
    }catch(e){notice(e.message,true);}
  });
  $('bp-reset').addEventListener('click',()=>{for(const s of states.values())resetRow(s);$('bp-notice').hidden=true;refresh();});
  $('bp-save').addEventListener('click',async()=>{
    const dirty=[...states.values()].filter(changed);let first;
    for(const s of dirty){s.error.textContent=validate(s);if(s.error.textContent&&!first)first=s;}
    if(first){notice('قیمت‌های مشخص‌شده را اصلاح کنید؛ چیزی ذخیره نشد.',true);$('bp-price-filter').value='dirty';$('bp-search').value='';$('bp-category').value='';$('bp-brand').value='';refresh();first.regular.focus();return;}
    const changes=dirty.map(s=>({id:s.original.id,version:s.original.version,...values(s)}));
    if(!changes.length)return;busy=true;root.querySelectorAll('input,select,button').forEach(n=>n.disabled=true);refresh();
    try{
      const response=await fetch(cfg.ajax,{method:'POST',credentials:'same-origin',body:new URLSearchParams({action:'barad_save_prices',nonce:cfg.nonce,changes:JSON.stringify(changes)})});
      const result=await response.json();if(!result||!result.data)throw new Error('پاسخ معتبر دریافت نشد؛ تغییرات محفوظ است، دوباره تلاش کنید.');
      for(const item of result.data.items||[])if(states.has(item.id))resetRow(states.get(item.id),item);
      for(const err of result.data.errors||[])if(states.has(err.id))states.get(err.id).error.textContent=err.message;
      notice(result.data.message||'ذخیره انجام نشد.',!result.success);
    }catch(e){notice('ارتباط یا ذخیره ناموفق بود؛ تغییرات این صفحه محفوظ است. '+e.message,true);}
    finally{busy=false;root.querySelectorAll('input,select,button').forEach(n=>n.disabled=false);refresh();}
  });
  window.addEventListener('beforeunload',e=>{if([...states.values()].some(changed)){e.preventDefault();e.returnValue='';}});
  // Keep unrelated WordPress notices accessible without displacing the price editor.
  window.addEventListener('load',()=>{
    const notices=[...document.querySelectorAll('#wpbody-content .notice,#wpbody-content div.error,#wpbody-content div.updated,#wpbody-content .update-nag')].filter(n=>!n.closest('.bp-wordpress-notices')&&!n.parentElement.closest('.notice,.error,.updated,.update-nag'));
    if(!notices.length)return;
    const details=el('details',{className:'bp-wordpress-notices'},[el('summary',{},['پیام‌های وردپرس ('+num(notices.length)+')'])]);
    notices.forEach(n=>details.append(n));root.querySelector('.bp-heading').after(details);
  },{once:true});
  refresh();
})();
