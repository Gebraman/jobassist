async function fetchQuestions() {
  const endpoints = [
    'https://apply.workable.com/api/v2/accounts/bask-health-1/jobs/7431DDC44C/application',
    'https://apply.workable.com/api/v2/accounts/bask-health-1/jobs/7431DDC44C/form',
    'https://apply.workable.com/api/v2/accounts/bask-health-1/jobs/7431DDC44C/questions',
    'https://apply.workable.com/api/v2/accounts/bask-health-1/jobs/7431DDC44C/custom-questions',
    'https://apply.workable.com/api/v1/accounts/bask-health-1/jobs/7431DDC44C/application'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, { headers: { 'accept': 'application/json', 'user-agent': 'Mozilla/5.0' } });
      console.log(ep, res.status);
      if (res.status === 200) {
        const json = await res.json();
        console.log(JSON.stringify(json, null, 2));
      }
    } catch(e) {}
  }
}

fetchQuestions();
