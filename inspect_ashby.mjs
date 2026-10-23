import fs from 'fs';

const html = fs.readFileSync('ashby_page.html', 'utf8');
const urls = [...html.matchAll(/https:\/\/[^"'`\s,]+/g)].map(m => m[0]);
console.log('Ashby URLs:', [...new Set(urls)].filter(u => u.includes('ashby')));
