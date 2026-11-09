// Builds www/ (the folder Capacitor packs into the app) from src/index.html.
// Everything the app needs is copied in, so it works fully offline.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const nm = (...p) => path.join(root, 'node_modules', ...p);
const out = path.join(root, 'www');

function must(cond, msg) { if (!cond) { console.error('build-www: ' + msg); process.exit(1); } }
function copyDir(from, to) { fs.cpSync(from, to, { recursive: true }); }

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'vendor'), { recursive: true });
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });

// libraries (the legacy PDF.js build runs on older Android WebViews too)
const legacy = nm('pdfjs-dist', 'legacy', 'build');
fs.copyFileSync(path.join(legacy, 'pdf.min.js'), path.join(out, 'vendor', 'pdf.min.js'));
fs.copyFileSync(path.join(legacy, 'pdf.worker.min.js'), path.join(out, 'vendor', 'pdf.worker.min.js'));
fs.copyFileSync(nm('page-flip', 'dist', 'js', 'page-flip.browser.js'), path.join(out, 'vendor', 'page-flip.browser.js'));
copyDir(nm('pdfjs-dist', 'cmaps'), path.join(out, 'vendor', 'cmaps'));
copyDir(nm('pdfjs-dist', 'standard_fonts'), path.join(out, 'vendor', 'standard_fonts'));

// fonts
const faces = [
  ['Literata', 'literata', 400], ['Literata', 'literata', 600],
  ['Instrument Sans', 'instrument-sans', 400], ['Instrument Sans', 'instrument-sans', 500], ['Instrument Sans', 'instrument-sans', 600]
];
let css = '';
for (const [family, pkg, weight] of faces) {
  const file = `${pkg}-latin-${weight}-normal.woff2`;
  fs.copyFileSync(nm('@fontsource', pkg, 'files', file), path.join(out, 'fonts', file));
  css += `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:swap;src:url("${file}") format("woff2");}\n`;
}
fs.writeFileSync(path.join(out, 'fonts', 'fonts.css'), css);

// page
let html = fs.readFileSync(path.join(root, 'src', 'index.html'), 'utf8');
function swap(from, to) {
  must(html.split(from).length === 2, 'expected exactly one match for: ' + from.slice(0, 70));
  html = html.replace(from, () => to);
}
const links = html.match(/<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>\s*/g) || [];
must(links.length === 3, 'expected 3 Google Fonts links, found ' + links.length);
links.forEach((l) => { html = html.replace(l, () => ''); });
swap('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'vendor/pdf.min.js');
swap('https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js', 'vendor/page-flip.browser.js');
swap('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js', 'vendor/pdf.worker.min.js');

const head = [
  '<!doctype html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
  '<meta name="theme-color" content="#1a1510">',
  '<link rel="stylesheet" href="fonts/fonts.css">',
  '<script>window.TURNLEAF_APP = true;</script>',
  '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>',
  ''
].join('\n');
fs.writeFileSync(path.join(out, 'index.html'), head + html + '\n</body>\n</html>\n');
console.log('www/ is ready');
