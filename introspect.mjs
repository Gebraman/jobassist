async function introspect() {
  const url = 'https://jobs.ashbyhq.com/api/non-user-graphql';
  const query = {
    query: `query {
      __type(name: "FormSectionRender") {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
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
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(query)
    });
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch(e) {
    console.error(e.message);
  }
}

introspect();
