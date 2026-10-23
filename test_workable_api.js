async function testWorkableAshby() {
  try {
    const res = await fetch('https://jobs.workable.com/api/v1/jobs?query=Bookkeeper&location=Remote', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    console.log('Workable API status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Workable Keys:', Object.keys(data));
      console.log('Workable Data preview:', JSON.stringify(data).slice(0, 300));
    }
  } catch(e) {
    console.log('Workable err:', e.message);
  }
}
testWorkableAshby();
