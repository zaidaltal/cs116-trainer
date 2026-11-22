// Stamps ?v=<timestamp> onto every local css/js link in index.html so browsers fetch fresh files
// after each deploy (GitHub Pages caches files for 10 minutes). Run before committing: node tools/bump-version.js
const fs = require('fs'), path = require('path');
const f = path.join(__dirname, '..', 'index.html');
const v = new Date().toISOString().replace(/\D/g, '').slice(0, 12);
const out = fs.readFileSync(f, 'utf8').replace(/((?:src|href)="(?:css|js)\/[^"?]+)(\?v=\d+)?"/g, `$1?v=${v}"`);
fs.writeFileSync(f, out);
console.log('index.html assets stamped with v=' + v);
