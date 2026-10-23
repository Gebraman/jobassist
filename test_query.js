const fs = require('fs');
const html = fs.readFileSync('ashby_page.html', 'utf8');
const scriptRegex = /<script[^>]+src="([^">]+)"/g;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  console.log('Script:', match[1]);
}
