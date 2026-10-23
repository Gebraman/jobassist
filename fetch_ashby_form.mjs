async function checkAshby() {
  const url = 'https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobPostingApplicationForm';
  const query = {
    operationName: "ApiJobPostingApplicationForm",
    variables: {
      organizationHostedJobsPageName: "bjakcareer",
      jobPostingId: "00f1597f-1059-4d3f-b20e-f2aeaa828278"
    },
    query: `query ApiJobPostingApplicationForm($organizationHostedJobsPageName: String!, $jobPostingId: String!) {
      jobPosting(organizationHostedJobsPageName: $organizationHostedJobsPageName, jobPostingId: $jobPostingId) {
        id
        title
        applicationForm {
          sections {
            title
            fieldRenders {
              title
              descriptionPlain
              isRequired
              field {
                type
                selectableValues {
                  label
                  value
                }
              }
            }
          }
        }
      }
    }`
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify(query)
    });
    const json = await res.json();
    console.log('Ashby form query result:', JSON.stringify(json, null, 2));
  } catch(e) {
    console.error('Error fetching Ashby API:', e.message);
  }
}

checkAshby();
