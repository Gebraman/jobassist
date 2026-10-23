import fs from 'fs';

const html = fs.readFileSync('workable_page.html', 'utf8');
const apis = [...html.matchAll(/\/api\/[a-zA-Z0-9_\-\/]+/g)].map(m => m[0]);
console.log('APIs found in workable_page.html:', [...new Set(apis)]);
