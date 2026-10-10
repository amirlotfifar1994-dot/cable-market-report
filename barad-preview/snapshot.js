(()=>{
 'use strict';
 const root=new URL(window.baradSnapshotRoot||'./',location.href),digits='۰۱۲۳۴۵۶۷۸۹',qs=new URLSearchParams(location.search);
 const normalize=s=>s.replace(/[۰-۹]/g,d=>String(digits.indexOf(d))).replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[\u200c\s]+/g,' ').replace(/(\d)\s*[*×xX]\s*(\d)/g,'$1x$2').replace(/افشار نژاد/g,'افشارنژاد').trim().toLowerCase();
 document.querySelectorAll('form').forEach(form=>{
  if(form.dataset.staticDisabled){form.addEventListener('submit',e=>e.preventDefault());return;}
  if(form.querySelector('[name=q]'))form.addEventListener('submit',e=>{e.preventDefault();const q=form.querySelector('[name=q]').value.trim(),url=new URL('catalog/index.html',root);if(q)url.searchParams.set('q',q);location.href=url.href;});
 });
 const term=qs.get('q');if(!term||!location.pathname.includes('/catalog/'))return;
 const queryInput=document.querySelector('#catalog-q');if(queryInput)queryInput.value=term;
 const section=document.createElement('section');section.className='w section barad-snapshot-results';section.id='barad-snapshot-search-results';
 const heading=document.createElement('h2');heading.textContent='نتایج جست‌وجو برای «'+term+'»';section.append(heading);
 const status=document.createElement('p');status.className='barad-snapshot-status';status.textContent='در حال جست‌وجو…';section.append(status);
 const target=document.querySelector('.barad-catalog-categories');if(target)target.replaceWith(section);else document.querySelector('main')?.append(section);
 fetch(new URL('search-index.json',root)).then(r=>{if(!r.ok)throw Error('search');return r.json();}).then(rows=>{
  const tokens=normalize(term).split(' ').filter(Boolean).slice(0,12),matches=rows.filter(row=>{const corpus=normalize(row.search);return tokens.every(token=>/^\d+(?:\.\d+)?x\d+(?:\.\d+)?(?:x\d+(?:\.\d+)?)?(?:\+\d+(?:\.\d+)?)?$/.test(token)?normalize(row.size||'').replace(/\s/g,'')===token:corpus.includes(token)||corpus.replace(/\s/g,'').includes(token.replace(/\s/g,'')));});
  matches.sort((a,b)=>Number(normalize(b.sku||'')===normalize(term))-Number(normalize(a.sku||'')===normalize(term)));
  const cats=matches.filter(r=>r.type==='category'),products=matches.filter(r=>r.type==='product');status.textContent=cats.length+' دسته و '+products.length+' کالا پیدا شد.';
  if(cats.length){const links=document.createElement('div');links.className='barad-topic-results';cats.forEach(row=>{const a=document.createElement('a');a.className='btn';a.href=new URL(row.path,root).href;a.textContent=row.title;links.append(a);});section.append(links);}
  const grid=document.createElement('div');grid.className='products';section.append(grid);let rendered=0;
  const more=document.createElement('button');more.type='button';more.className='btn barad-snapshot-more';more.textContent='نمایش کالاهای بیشتر';
  function render(){const slice=products.slice(rendered,rendered+24);slice.forEach(row=>{const card=document.createElement('article');card.className='product-card barad-enter';const picture=document.createElement('a');picture.className='product-image';picture.href=new URL(row.path,root).href;if(row.image){const img=document.createElement('img');img.src=new URL(row.image,root).href;img.alt=row.title;img.loading='lazy';picture.append(img);}card.append(picture);const body=document.createElement('div');body.className='card-body';const title=document.createElement('h3');const link=document.createElement('a');link.href=picture.href;link.textContent=row.title;title.append(link);body.append(title);const sku=document.createElement('bdi');sku.textContent=row.sku;body.append(sku);const price=document.createElement('p');price.className='product-price';price.textContent='تماس برای قیمت و تأمین';body.append(price);card.append(body);grid.append(card);});rendered+=slice.length;more.hidden=rendered>=products.length;}
  more.addEventListener('click',render);section.append(more);render();if(!matches.length)status.textContent='موردی پیدا نشد. نام دسته، کد، مدل یا سایز دیگری را امتحان کنید.';
 }).catch(()=>{status.textContent='فهرست جست‌وجو دریافت نشد. صفحه را تازه کنید.';});
})();
