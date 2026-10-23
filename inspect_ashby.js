import fs from 'fs';

const js = fs.readFileSync('ashby_data_1.json', 'utf8');
const matches = [...js.matchAll(/https:\/\/[^"'\s,]+/g)];
const urls = [...new Set(matches.map(m => m[0]))];
console.log('URLs in appData:', urls);
