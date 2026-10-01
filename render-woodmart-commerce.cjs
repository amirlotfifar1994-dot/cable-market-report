const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const output=path.join(__dirname,'assets/templates/woodmart-commerce');
fs.mkdirSync(output,{recursive:true});
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'});
  try{
    for(const theme of ['copper','atelier','depot']){
      for(const type of ['home','catalog','product']){
        for(const view of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
          const page=await browser.newPage({viewport:view,deviceScaleFactor:1});
          const url=pathToFileURL(path.join(__dirname,'woodmart-commerce-render.html'));
          url.searchParams.set('theme',theme);url.searchParams.set('page',type);
          await page.goto(url.href,{waitUntil:'load'});
          await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
          const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.naturalWidth).map(i=>i.src));
          const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
          if(broken.length||overflow)throw new Error(theme+'/'+type+'/'+view.name+' layout or asset error '+JSON.stringify(broken));
          await page.screenshot({path:path.join(output,theme+'-'+type+'-'+view.name+'.png'),fullPage:true,animations:'disabled'});
          console.log(theme+'/'+type+'/'+view.name);await page.close();
        }
      }
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
