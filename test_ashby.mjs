async function testNames() {
  const candidates = [
    'fields', 'elements', 'questions', 'items', 'formFields',
    'fieldRenders', 'fieldInstances', 'sectionFields', 'inputs',
    'fieldDefinitions', 'fieldConfigs', 'components', 'rows'
  ];

  for (const c of candidates) {
    const query = `query {
      jobPosting(organizationHostedJobsPageName: "bjakcareer", jobPostingId: "00f1597f-1059-4d3f-b20e-f2aeaa828278") {
        applicationForm {
          sections {
            title
            ${c} {
              __typename
            }
          }
        }
      }
    }`;

    const res = await fetch('https://jobs.ashbyhq.com/api/non-user-graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const json = await res.json();
    if (json.data) {
      console.log('SUCCESS with candidate:', c);
      console.log(JSON.stringify(json.data, null, 2));
      return;
    }
  }
  console.log('None of the simple candidates succeeded.');
}

testNames();
