async function fetchWorkableApi() {
  const urls = [
    'https://apply.workable.com/api/v1/jobs/7431DDC44C',
    'https://apply.workable.com/api/v2/accounts/bask-health-1/jobs/7431DDC44C',
    'https://apply.workable.com/api/v3/accounts/bask-health-1/jobs/7431DDC44C'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'user-agent': 'Mozilla/5.0'
        }
      });
      console.log(url, res.status);
      if (res.status === 200) {
        const json = await res.json();
        console.log('Keys:', Object.keys(json));
        if (json.application_form || json.questions) {
          console.log('Questions found:', json.questions || json.application_form);
        }
      }
    } catch(e) {
      console.error(e.message);
    }
  }
}

fetchWorkableApi();
