(function () {
  'use strict';
  try { document.documentElement.dataset.theme=localStorage.getItem('cable-report-theme')==='light'?'light':'dark'; } catch (_) {}
  const form=document.getElementById('sp-lock-form');
  const password=document.getElementById('sp-lock-password');
  const submit=document.getElementById('sp-lock-submit');
  const error=document.getElementById('sp-lock-error');
  const reveal=document.getElementById('sp-lock-reveal');
  const source=document.getElementById('sp-encrypted');
  if(!form || !source)return;
  const decode=value=>Uint8Array.from(atob(value),character=>character.charCodeAt(0));
  const normalize=value=>value.trim().replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)));
  reveal.addEventListener('click',()=>{
    const visible=password.type==='password';password.type=visible?'text':'password';
    reveal.textContent=visible?'پنهان':'نمایش';reveal.setAttribute('aria-pressed',String(visible));
    reveal.setAttribute('aria-label',visible?'پنهان کردن رمز':'نمایش رمز');
  });
  password.addEventListener('input',()=>{error.textContent='';password.removeAttribute('aria-invalid');});
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(submit.disabled)return;
    if(!window.crypto || !window.crypto.subtle){error.textContent='گزارش را با مرورگر به‌روز و از نشانی HTTPS سایت باز کنید.';return;}
    submit.disabled=true;submit.textContent='در حال باز کردن…';error.textContent='';
    try {
      const envelope=JSON.parse(source.textContent);
      const keyMaterial=await crypto.subtle.importKey('raw',new TextEncoder().encode(normalize(password.value)),'PBKDF2',false,['deriveKey']);
      const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:decode(envelope.salt),iterations:envelope.iterations,hash:'SHA-256'},keyMaterial,{name:'AES-GCM',length:256},false,['decrypt']);
      const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(envelope.iv),additionalData:new TextEncoder().encode('cable-service-plans-v1')},key,decode(envelope.ciphertext));
      const payload=JSON.parse(new TextDecoder().decode(clear));
      password.value='';
      const downloads=payload.downloads;
      // The encrypted HTML is the project's own compiled report, never external input.
      document.open();document.write(payload.html);document.close();
      function attachDownloads() {
        const urls=[];
        document.querySelectorAll('a[download]').forEach(anchor=>{
          const name=anchor.getAttribute('href');
          if(!Object.prototype.hasOwnProperty.call(downloads,name))return;
          const type=name.endsWith('.json')?'application/json;charset=utf-8':name.endsWith('.md')?'text/markdown;charset=utf-8':'text/plain;charset=utf-8';
          const url=URL.createObjectURL(new Blob([name.endsWith('.txt')?'\ufeff':'',downloads[name]],{type}));
          urls.push(url);anchor.href=url;anchor.download=name;
        });
        const actions=document.querySelector('.nav-actions');
        if(actions){const lock=document.createElement('button');lock.type='button';lock.className='icon-btn';lock.textContent='قفل کردن';lock.addEventListener('click',()=>{urls.forEach(url=>URL.revokeObjectURL(url));location.reload();});actions.prepend(lock);}
      }
      if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attachDownloads,{once:true});else attachDownloads();
    } catch (_) {
      error.textContent='رمز درست نیست. دوباره وارد کنید.';password.setAttribute('aria-invalid','true');password.focus();password.select();
      submit.disabled=false;submit.textContent='باز کردن گزارش ←';
    }
  });
})();
