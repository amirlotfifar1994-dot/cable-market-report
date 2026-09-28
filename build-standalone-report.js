const fs = require('fs');
const path = require('path');

const root = __dirname;
const source = path.join(root, 'cable-market-report.html');
const output = path.join(root, 'cable-market-report-standalone.html');
let html = fs.readFileSync(source, 'utf8');
let embedded = 0;

html = html.replace(/(<img[^>]*?\bsrc=")(competitor-screenshots\/[^"\s]+\.jpg)(")/g, (match, before, file, after) => {
  const bytes = fs.readFileSync(path.join(root, ...file.split('/')));
  embedded += 1;
  return `${before}data:image/jpeg;base64,${bytes.toString('base64')}${after}`;
});

if (embedded !== 18) throw new Error(`Expected 18 screenshots, embedded ${embedded}`);
fs.writeFileSync(output, html, 'utf8');
console.log(`Embedded ${embedded} screenshots into ${path.basename(output)} (${Math.round(fs.statSync(output).size / 1024 / 1024 * 10) / 10} MB)`);
