const fs = require('fs');
const path = require('path');

const root = __dirname;
const source = path.join(root, 'model-first-site-concept.html');
const image = path.join(root, 'industrial-cable-hero.png');
const output = path.join(root, 'model-first-site-concept-standalone.html');
const html = fs.readFileSync(source, 'utf8');
const marker = 'src="industrial-cable-hero.png"';
if (!html.includes(marker)) throw new Error('Hero image reference missing');
const imageData = fs.readFileSync(image).toString('base64');
let standalone = html.replace(marker, `src="data:image/png;base64,${imageData}"`);
['Regular', 'Medium', 'Bold'].forEach(weight => {
  const fontPath = `assets/fonts/Vazirmatn-${weight}.ttf`;
  if (!standalone.includes(fontPath)) throw new Error(`Font reference missing: ${fontPath}`);
  const fontData = fs.readFileSync(path.join(root, fontPath)).toString('base64');
  standalone = standalone.replace(fontPath, `data:font/ttf;base64,${fontData}`);
});
fs.writeFileSync(output, standalone, 'utf8');
console.log(`Built ${path.basename(output)} with embedded image and fonts`);
