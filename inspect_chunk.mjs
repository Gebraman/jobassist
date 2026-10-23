import fs from 'fs';

const html = fs.readFileSync('jazzhr_page.html', 'utf8');
const idx = html.indexOf('resumator-questionnaire-q2819206');
if (idx !== -1) {
  console.log('Surrounding HTML:\n', html.substring(idx - 300, idx + 800));
}
