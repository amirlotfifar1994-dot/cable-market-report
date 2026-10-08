document.querySelectorAll('.br-gallery').forEach(g=>{
  const buttons=[...g.querySelectorAll('[role=tab]')],panels=[...g.querySelectorAll('[role=tabpanel]')];
  function activate(i,focus=false){buttons.forEach((b,j)=>{b.setAttribute('aria-selected',String(i===j));b.tabIndex=i===j?0:-1});panels.forEach((p,j)=>{p.hidden=i!==j;if(i===j)p.querySelectorAll('img[data-src]').forEach(img=>{img.src=img.dataset.src;img.removeAttribute('data-src')})});if(focus)buttons[i].focus();g.querySelector('.br-live').href=buttons[i].dataset.live;}
  buttons.forEach((b,i)=>{b.addEventListener('click',()=>activate(i));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowLeft'?1:-1)+buttons.length)%buttons.length;activate(n,true)})});activate(0);
});
