import fs from 'fs';

async function fetchFullJob() {
  const url = 'https://apply.workable.com/api/v2/accounts/bask-health-1/jobs/7431DDC44C';
  const res = await fetch(url, {
    headers: {
      'accept': 'application/json',
      'user-agent': 'Mozilla/5.0'
    }
  });
  const json = await res.json();
  fs.writeFileSync('workable_job_full.json', JSON.stringify(json, null, 2), 'utf8');
  console.log('Saved workable_job_full.json. Keys:', Object.keys(json));
}

fetchFullJob();
