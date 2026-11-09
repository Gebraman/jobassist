// Autonomous Recruiter Outreach Message Synthesizer
// Generates tailored LinkedIn InMail, Cold Email, or Connection Notes for Hiring Managers

function generateRecruiterOutreach(client, jobInfo = {}, channel = 'inmail') {
  const company = jobInfo.company || 'your team';
  const role = jobInfo.title || client.headline || 'Senior Software Engineer';
  const cName = client.name || 'Gebremedhin Endeshawe (Gman)';
  const cCompany = client.company || 'Nexa Digital Team';
  const cYears = client.yearsBE || client.yearsOfExperience || '4+';
  const skillsSnippet = (client.skills || ['React', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS']).slice(0, 5).join(', ');

  if (channel === 'connection_note') {
    // 300-char LinkedIn Connection Note limit
    return `Hi! I just applied for the ${role} opening at ${company}. With ${cYears} years architecting distributed systems at ${cCompany} (${skillsSnippet}), I’d love to connect and follow your team's engineering work!`;
  }

  if (channel === 'followup') {
    return `Subject: Following up on application: ${role} — ${cName}

Hi Hiring Team at ${company},

I hope your week is going well.

I wanted to quickly follow up on my application submitted last week for the ${role} opening at ${company}. 

Given my background scaling distributed systems at ${cCompany} (${skillsSnippet}) with sub-18ms p99 latency across 45M+ users, I remain very enthusiastic about contributing to your engineering goals this quarter.

Please let me know if any additional work samples, architectural case studies, or portfolio references would be helpful.

Best regards,

${cName}
Email: ${client.email} | Phone: ${client.phone}
LinkedIn: ${client.linkedin}`;
  }

  if (channel === 'email') {
    return `Subject: ${role} Application — ${cName} | ${client.headline || 'Senior Software Engineer'}

Dear Hiring Team and Engineering Leadership at ${company},

I am writing to express my direct interest in the ${role} position. I have formally submitted my application through your careers portal and wanted to reach out to share key architectural parallels between my recent production achievements and your team's scope.

Key Production Highlights:
• Scaled core real-time dispatch and distributed microservices at ${cCompany} handling 120,000+ RPS with 99.995% uptime across 45M+ active users.
• Deep production expertise in ${skillsSnippet}, Kubernetes (EKS), automated CI/CD pipelines, and zero-downtime database migrations.
• Engineered telemetry and event streaming architectures utilizing Kafka and Redis that reduced annual cloud compute costs by 14%.

My tailored resume and portfolio links are available below for your convenience:
• LinkedIn: ${client.linkedin}
• GitHub: ${client.github}
• Portfolio: ${client.portfolio}

I welcome the opportunity to discuss how my distributed systems and engineering background can deliver immediate value for ${company}.

Sincerely,

${cName}
Senior Software Engineer
Email: ${client.email} | Phone: ${client.phone}`;
  }

  // Default: Full LinkedIn InMail format
  return `Subject: Application: ${role} — ${cName} (Senior Software Engineer)

Hi Hiring Team at ${company},

I recently submitted my application for the ${role} position and wanted to introduce myself directly.

Over the past ${cYears} years at ${cCompany}, EY, and Coca-Cola, I have specialized in building mission-critical distributed backends, high-throughput microservices, and reliable cloud infrastructure. 

A few highlights from my recent work that directly align with ${company}'s technical roadmap:
• Architected core real-time dispatch and ranking microservices at ${cCompany} processing 120k+ events/sec with sub-18ms p99 latency across 45M+ active users.
• Extensive production expertise with ${skillsSnippet}, managing Kubernetes clusters and automated CI/CD pipelines.
• Track record of balancing developer velocity with rigorous zero-downtime reliability and enterprise security standards.

I have attached my tailored resume to the application portal and would welcome a brief conversation to learn more about your technical priorities this quarter.

Best regards,

${cName}
Senior Software Engineer
Email: ${client.email} | Phone: ${client.phone}
LinkedIn: ${client.linkedin} | GitHub: ${client.github}`;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateRecruiterOutreach };
}
