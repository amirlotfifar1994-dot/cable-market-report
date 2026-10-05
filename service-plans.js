(function () {
  'use strict';
  const source=document.getElementById('sp-data');
  if(!source)return;
  const data=JSON.parse(source.textContent);
  const number=new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2});
  const form=document.getElementById('sp-budget-form');
  const details=[...document.querySelectorAll('.sp-plan-detail')];
  const allButton=document.getElementById('sp-show-all');
  let all=false;
  function syncDetails(id) {
    details.forEach(panel=>{panel.hidden=!all && panel.dataset.plan!==id;});
    document.querySelectorAll('[data-plan-select]').forEach(a=>{
      const current=a.dataset.planSelect===id;
      if(current)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
    });
    allButton.textContent=all?'فقط جزئیات پلن انتخاب‌شده':'نمایش جزئیات همه پلن‌ها';
    allButton.setAttribute('aria-pressed',String(all));
  }
  function calculate() {
    const p=data.plans.find(p=>p.id===form.elements.plan.value)||data.plans[1];
    const m=data.monthly.find(m=>m.id===form.elements.monthly.value)||data.monthly[0];
    const months=[3,6,12].includes(Number(form.elements.months.value))?Number(form.elements.months.value):6;
    const media=[0,10,20,30].includes(Number(form.elements.media.value))?Number(form.elements.media.value):0;
    const sku=[0,1,2,3].includes(Number(form.elements.sku.value))?Number(form.elements.sku.value):0;
    const language=form.elements.language.checked?15:0;
    const pdf=form.elements.pdf.checked?5:0;
    const maintenance=form.elements.maintenance;
    maintenance.disabled=m.price>0;
    if(maintenance.disabled)maintenance.checked=false;
    document.getElementById('sp-maintenance-note').textContent=m.price>0?'نگهداری پایه در دستمزد سئوست؛ مبلغ جدا برای همان دامنه اضافه نمی‌شود.':'بدون خدمات ماهانه، مسئول نگهداری و بازبینی محتوا باید از طرف کارفرما مشخص شود. نگهداری مستقل اختیاری است.';
    const setup=p.price+language+pdf+sku*3;
    const monthly=m.price+(!maintenance.disabled && maintenance.checked?data.maintenanceOnly:0);
    const total=setup+months*(monthly+media);
    [['total',total],['setup',setup],['monthly',monthly],['media',media]].forEach(([key,value])=>document.getElementById('sp-budget-'+key).textContent=number.format(value));
    document.getElementById('sp-budget-period').textContent=number.format(months)+' ماه';
    document.getElementById('sp-budget-equation').textContent=number.format(setup)+' + '+number.format(months)+' × ('+number.format(monthly)+' + '+number.format(media)+') = '+number.format(total);
    let summary=document.getElementById('sp-budget-selection');
    if(!summary){summary=document.createElement('p');summary.id='sp-budget-selection';document.querySelector('.sp-budget-result').append(summary);}
    summary.textContent=p.name+'؛ '+m.name+(language?'؛ زبان دوم':'')+(pdf?'؛ PDF اضافه':'')+(sku?'؛ '+number.format(sku*50)+' SKU آماده اضافه':'')+(maintenance.checked?'؛ نگهداری مستقل':'')+((sku && ['seo','growth'].includes(p.id))?' — سقف موتور فرمول همچنان ۱۵۰ SKU است.':'');
    syncDetails(p.id);
  }
  function choose(id) {
    if(!data.plans.some(p=>p.id===id))return;
    form.elements.plan.value=id;calculate();
  }
  document.querySelectorAll('[data-plan-select]').forEach(a=>a.addEventListener('click',()=>choose(a.dataset.planSelect)));
  document.querySelectorAll('[data-budget-plan]').forEach(a=>a.addEventListener('click',()=>choose(a.dataset.budgetPlan)));
  window.addEventListener('hashchange',()=>{const match=location.hash.match(/^#plan-(catalog|commerce|seo|growth)$/);if(match)choose(match[1]);});
  form.addEventListener('change',calculate);
  form.addEventListener('submit',event=>event.preventDefault());
  allButton.hidden=false;allButton.addEventListener('click',()=>{all=!all;calculate();});
  const hash=location.hash.match(/^#plan-(catalog|commerce|seo|growth)$/);
  if(hash)form.elements.plan.value=hash[1];
  calculate();
  // Printing expands every scope and restores exactly the prior on-screen state.
  let printState;
  function preparePrint() {
    if(printState)return;
    printState=[...document.querySelectorAll('details')].map(element=>[element,element.open]);
    printState.forEach(([element])=>element.open=true);
  }
  function restorePrint() {
    if(!printState)return;
    printState.forEach(([element,open])=>element.open=open);printState=null;
  }
  window.addEventListener('beforeprint',preparePrint);
  window.addEventListener('afterprint',restorePrint);
  document.getElementById('sp-print').addEventListener('click',()=>{preparePrint();window.print();});
})();
