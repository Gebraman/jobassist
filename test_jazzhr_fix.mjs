import fs from 'fs';

const html = fs.readFileSync('jazzhr_page.html', 'utf8');

// Candidate data
const CLIENT = {
  name: 'Raymond Wong',
  first: 'Raymond',
  last: 'Wong',
  email: 'raymond1994.glo@outlook.com',
  phone: '510-340-2070',
  headline: 'Senior Integrations & Back-End Software Engineer',
  addr: '215 Piedmont Ave NE APT 1206',
  city: 'Atlanta',
  state: 'GA',
  zip: '30308',
  loc: 'Atlanta, GA, United States',
  salary: '$95,000', // Within the $85k - $105k range advertised by 1406 Consulting
  yearsBE: '8',
  sponsorship: 'No',
  workAuth: 'Yes'
};

// Test how we resolve each field
const fieldsToTest = [
  'resumator-firstname-value',
  'resumator-lastname-value',
  'resumator-email-value',
  'resumator-phone-value',
  'resumator-address-value',
  'resumator-city-value',
  'resumator-state-value',
  'resumator-postal-value',
  'resumator-resume-value',
  'resumator-resumetext-value',
  'resumator-questionnaire-q2819206',
  'resumator-questionnaire-q2819209',
  'resumator-questionnaire-q2819216',
  'resumator-questionnaire-q2819221',
  'resumator-questionnaire-q2977578',
  'resumator-questionnaire-q2819234'
];

function resolveFieldValue(id, label, options = []) {
  const i = id.toLowerCase();
  const q = label.toLowerCase();

  // 1. First Name
  if (i.includes('firstname') || q.includes('first name')) return CLIENT.first;
  // 2. Last Name
  if (i.includes('lastname') || q.includes('last name')) return CLIENT.last;
  // 3. Email (STRICT check: only if id/name is email or type is email)
  if (i.includes('email') || (q.includes('email') && !q.includes('address line') && !q.includes('salary'))) return CLIENT.email;
  // 4. Phone
  if (i.includes('phone') || q.includes('phone') || q.includes('mobile')) return CLIENT.phone;
  // 5. City
  if (i.includes('city') || q.includes('city')) return CLIENT.city;
  // 6. State
  if (i.includes('state') || q.includes('state') || q.includes('province')) return CLIENT.state;
  // 7. Postal / Zip
  if (i.includes('postal') || i.includes('zip') || q.includes('postal') || q.includes('zip')) return CLIENT.zip;
  // 8. Address
  if ((i.includes('address') || q.includes('address') || q.includes('street')) && !i.includes('email')) return CLIENT.addr;
  // 9. Target Salary (CRITICAL FIX)
  if (q.includes('salary') || q.includes('compensation') || i.includes('salary')) {
    return '$95,000'; // or advertised range
  }

  // 10. Questionnaire Dropdowns (JazzHR)
  if (options.length > 0) {
    // A. Where are you based?
    if (q.includes('based') || q.includes('location')) {
      const opt = options.find(o => o.value === 'US' || o.text.includes('US') || o.text.includes('United States'));
      if (opt) return opt.value;
    }
    // B. HubSpot certifications/platform
    if (q.includes('hubspot') && (q.includes('certification') || q.includes('developer platform'))) {
      const opt = options.find(o => o.value.includes('Yes') || o.text.includes('Yes'));
      if (opt) return opt.value;
    }
    // C. Integration tools (Zapier, Workato, Mulesoft)
    if (q.includes('zapier') || q.includes('workato') || q.includes('mulesoft') || q.includes('integration tool')) {
      const opt = options.find(o => o.value === 'Yes' || o.text === 'Yes');
      if (opt) return opt.value;
    }
    // D. Years of API integration experience
    if (q.includes('years') && q.includes('api')) {
      const opt = options.find(o => o.value.includes('More than 5') || o.text.includes('More than 5') || o.value.includes('5+'));
      if (opt) return opt.value;
    }
    // E. HubSpot Marketing/Sales/CRM understanding
    if (q.includes('crm') || q.includes('hubspot') || q.includes('ecosystem')) {
      const opt = options.find(o => o.value === 'Yes' || o.text === 'Yes');
      if (opt) return opt.value;
    }
  }

  return 'NO_MATCH';
}

console.log('Testing JazzHR Form Resolution:');
fieldsToTest.forEach(id => {
  // Extract label and options from HTML for this id
  let label = id;
  const lblMatch = html.match(new RegExp(`<label[^>]*for=['"]${id}['"][^>]*>([\\s\\S]*?)<\\/label>`)) ||
                   html.match(new RegExp(`<label[^>]*id=['"]${id}-label['"][^>]*>([\\s\\S]*?)<\\/label>`));
  if (lblMatch) label = lblMatch[1].replace(/<[^>]+>/g, '').trim();

  let options = [];
  const selIdx = html.indexOf(`id="${id}"`) !== -1 ? html.indexOf(`id="${id}"`) : html.indexOf(`id='${id}'`);
  if (selIdx !== -1) {
    const chunk = html.slice(selIdx, selIdx + 1200);
    options = [...chunk.matchAll(/<option[^>]*value=['"]([^'"]*)['"][^>]*>([\s\S]*?)<\/option>/g)].map(o => ({ value: o[1], text: o[2].trim() }));
  }

  const res = resolveFieldValue(id, label, options);
  console.log(`[${id}] -> "${label.slice(0, 40)}..."\n  => RESULT: "${res}"\n`);
});
