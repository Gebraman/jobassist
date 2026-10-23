import fs from 'fs';

const html = fs.readFileSync('jazzhr_page.html', 'utf8');

// Find all inputs, selects, textareas, and file inputs
const inputRegex = /<(input|select|textarea)[^>]*>/g;
let match;
const elements = [];
while ((match = inputRegex.exec(html)) !== null) {
  elements.push(match[0]);
}

console.log('Total form elements in JazzHR:', elements.length);
elements.forEach((el, i) => {
  if (!el.includes('type="hidden"')) {
    console.log(`[${i}] ${el}`);
  }
});
