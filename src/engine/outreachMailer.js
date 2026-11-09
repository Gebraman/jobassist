// JobAssist AI Studio - Direct Client Outreach Mailer & Cold Email Dispatcher
// Generates high-converting client pitches and 1-click mail compose deep links

export function generateRecruiterOutreach({ recipientName, recipientRole, company, jobTitle, candidate, tone = 'value_add' }) {
  const cName = candidate?.name || 'Gebremedhin Endeshawe (Nexa Digital Team)';
  const cHeadline = candidate?.headline || 'Virtual Assistant & Data Entry Specialist';
  const cYears = candidate?.yearsBE || candidate?.yearsOfExperience || '3+';
  const targetCompany = company || 'Target Company';
  const targetRole = jobTitle || 'Virtual Assistant / Data Entry Specialist';
  const rName = recipientName || 'Hiring Team';
  const portfolioUrl = candidate?.portfolio || 'https://nexa-portfolio-theta.vercel.app/';

  let subject = '';
  let body = '';

  if (tone === 'value_add') {
    subject = `${targetRole} — Fast, 99.8% Accurate Operational Support (${cName})`;
    body = `Hi ${rName},\n\nI noticed the ${targetRole} opening at ${targetCompany} and wanted to reach out directly.\n\nAs a ${cHeadline} with ${cYears} years of experience supporting remote digital teams at Nexa Digital (${portfolioUrl}), I specialize in high-accuracy data entry (65+ WPM typing, 99.8% verified accuracy), Google Sheets/Excel organization (XLOOKUP, Pivot Tables), web research, and daily administrative support.\n\nI would love to help streamline your team's workflows and take operational tasks off your plate.\n\nWould you be open to a brief chat or letting me complete a small free test task this week?\n\nBest regards,\n${cName}\nPortfolio: ${portfolioUrl}\nEmail: ${candidate?.email || 'nexadigitalteamhq@gmail.com'} | Phone: ${candidate?.phone || '+251 90 985 8645'}`;
  } else if (tone === 'quick_intro') {
    subject = `Quick Question re: ${targetRole} at ${targetCompany}`;
    body = `Hi ${rName},\n\nHope your week is going well. I recently submitted my application for the ${targetRole} position at ${targetCompany} and wanted to personally introduce myself.\n\nI bring ${cYears} years of virtual assistance and high-accuracy data entry experience, with verified 65+ WPM typing and advanced spreadsheet skills. Our team portfolio is available at ${portfolioUrl}.\n\nI'd welcome the chance to connect.\n\nBest,\n${cName}\n${candidate?.email || 'nexadigitalteamhq@gmail.com'}`;
  } else {
    subject = `${cName} — Application for ${targetRole} at ${targetCompany}`;
    body = `Dear ${rName},\n\nI am writing to express my strong interest in the ${targetRole} role at ${targetCompany}.\n\nThroughout my work at Nexa Digital Team, I have consistently delivered reliable administrative execution, 99.8% accurate data entry, and prompt cross-timezone communication.\n\nI would be delighted to speak with you regarding how my operational skills can support ${targetCompany}.\n\nSincerely,\n${cName}`;
  }

  // Deep Links
  const encodedSub = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const recipientEmail = recipientRole ? `contact@${targetCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.com` : '';

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
