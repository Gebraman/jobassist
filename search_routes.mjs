async function searchApplicationForm() {
  const url = 'https://dcvxs6ggqztsa.cloudfront.net/candidate/releases/careers.6901cd820c44d775.js';
  const res = await fetch(url);
  const text = await res.text();
  const idx = text.indexOf('/application');
  if (idx !== -1) {
    console.log(text.substring(idx - 100, idx + 400));
  }
  const idx2 = text.indexOf('application_form');
  if (idx2 !== -1) {
    console.log('application_form found at:', idx2);
    console.log(text.substring(idx2 - 100, idx2 + 400));
  } else {
    console.log('application_form not found');
  }
}

searchApplicationForm();
