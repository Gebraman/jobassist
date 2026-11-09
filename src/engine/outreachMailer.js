// JobAssist AI Studio - Direct Recruiter Outreach Mailer & Cold Email Dispatcher
// Generates high-converting recruiter pitches and 1-click mail compose deep links

export function generateRecruiterOutreach({ recipientName, recipientRole, company, jobTitle, candidate, tone = 'value_add' }) {
  const cName = candidate?.name || 'Gebremedhin Endeshawe (Nexa Digital Team)';
  const cHeadline = candidate?.headline || 'Founder & Full-Stack Developer';
  const cYears = candidate?.yearsBE || candidate?.yearsOfExperience || '4+';
  const targetCompany = company || 'Target Company';
  const targetRole = jobTitle || 'Senior Software Engineer';
  const rName = recipientName || 'Hiring Manager';

  let subject = '';
  let body = '';

  if (tone === 'value_add') {
    subject = `${targetRole} - Engineering Leadership & Scalability (${cName})`;
    body = `Hi ${rName},\n\nI noticed the ${targetRole} opening on ${targetCompany}'s engineering team and wanted to reach out directly.\n\nAs a ${cHeadline} with ${cYears} years of enterprise experience building high-throughput distributed systems and cloud APIs, I've previously led architectural initiatives that reduced backend latency by up to 45% and scaled services to handle 10k+ req/sec.\n\nI admire ${targetCompany}'s engineering trajectory and would love to share a few ideas on how my background aligns with your current technical roadmap.\n\nAre you open to a brief 10-minute introductory conversation this week?\n\nBest regards,\n${cName}\n${candidate?.phone || ''} | ${candidate?.linkedin || ''}`;
  } else if (tone === 'quick_intro') {
    subject = `Quick Question re: ${targetRole} at ${targetCompany}`;
    body = `Hi ${rName},\n\nHope your week is going well. I recently submitted my application for the ${targetRole} position at ${targetCompany} and wanted to personally introduce myself.\n\nI bring ${cYears} years of senior backend engineering experience focusing on scalable APIs, PostgreSQL optimization, and resilient microservices. I'm especially excited about what your team is building.\n\nI've attached my executive resume for reference and would welcome the chance to connect.\n\nBest,\n${cName}\n${candidate?.email || ''}`;
  } else {
    subject = `${cName} - Candidate for ${targetRole} at ${targetCompany}`;
    body = `Dear ${rName},\n\nI am writing to express my strong interest in the ${targetRole} role at ${targetCompany}.\n\nThroughout my career as a ${cHeadline}, I have consistently delivered robust software solutions, mentored engineering teams, and optimized mission-critical cloud infrastructure.\n\nI would be delighted to speak with you regarding how my technical skills and leadership can drive immediate value for ${targetCompany}.\n\nSincerely,\n${cName}`;
  }

  // Deep Links
  const encodedSub = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const recipientEmail = recipientRole ? `recruiting@${targetCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.com` : '';

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodedSub}&body=${encodedBody}`;
  const mailtoUrl = `mailto:${recipientEmail}?subject=${encodedSub}&body=${encodedBody}`;
  const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(recipientEmail)}&subject=${encodedSub}&body=${encodedBody}`;

  return {
    subject,
    body,
    recipientEmail,
    gmailUrl,
    mailtoUrl,
    outlookUrl,
    generatedAt: new Date().toISOString()
  };
}
