async function testW() {
  const r = await fetch('https://jobs.workable.com/api/v1/jobs?query=Engineer', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const d = await r.json();
  console.log('Sample Job Keys:', Object.keys(d.jobs[0]));
  console.log('Sample Job Data:', JSON.stringify(d.jobs[0], null, 2));
}
testW();
