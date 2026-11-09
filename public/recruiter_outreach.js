// Autonomous Recruiter & Client Outreach Message Synthesizer — Nexa Digital Team
// Generates tailored Upwork Proposals, Cold Email Pitches, LinkedIn Connection Notes,
// and Follow-ups specifically designed for Virtual Assistant, Data Entry, and Remote Agency clients.

function generateRecruiterOutreach(client, jobInfo = {}, channel = 'upwork_bid') {
  const company = jobInfo.company || 'your business';
  const role = jobInfo.title || client.headline || client.targetRole || 'Virtual Assistant / Data Entry Specialist';
  const cName = client.name || 'Gebremedhin Endeshawe (Gman)';
  const cCompany = client.company || 'Nexa Digital Team';
  const cYears = client.yearsBE || client.yearsOfExperience || '3+';
  const skillsSnippet = (client.skills || ['Virtual Assistant', 'Data Entry', 'Google Sheets', 'Excel Data Cleaning', 'Web Research']).slice(0, 5).join(', ');
  const portfolioUrl = client.portfolio || 'https://nexa-portfolio-theta.vercel.app/';

  // 1. UPWORK / FREELANCER WINNING PROPOSAL
  if (channel === 'upwork_bid' || channel === 'proposal') {
    return `Hi ${company} team,

I can take this ${role} project off your plate immediately and deliver clean, organized, 99.8% accurate results.

Why I am a strong fit for your project:
• High-Speed & Precision: 65+ WPM typing speed with verified 99.8% data accuracy.
• Spreadsheets & Data Organization: Expert in Google Sheets and MS Excel (VLOOKUP, XLOOKUP, Pivot Tables, conditional formatting, deduplication, and data cleaning).
• Reliable Daily Support: Experienced in web research, lead generation, customer inbox management, and administrative workflows.
• Nexa Digital Backup: Backed by Nexa Digital Team (${portfolioUrl}), ensuring 100% uninterrupted continuity and fast turnaround.

My 3-Step Action Plan:
1. Review your exact requirements and clarify any formatting guidelines within the first hour.
2. Process an initial test sample (50-100 rows / records) for your immediate approval.
3. Complete the full batch with double-check quality verification before the deadline.

I am available to start immediately and work flexible hours across US/UK/European timezones.

Best regards,

${cName}
Virtual Assistant & Data Operations Lead | ${cCompany}
Portfolio: ${portfolioUrl}
Email: ${client.email} | WhatsApp/Telegram: ${client.phone}`;
  }

  // 2. LINKEDIN CONNECTION NOTE (< 300 CHARACTERS)
  if (channel === 'connection_note') {
    return `Hi! I saw your ${role} opening. With ${cYears} yrs experience in high-accuracy data entry (65+ WPM, 99.8% accuracy), Excel/Sheets, and remote admin support at Nexa Digital (${portfolioUrl}), I’d love to connect and help your team!`;
  }

  // 3. POLITE APPLICATION FOLLOW-UP
  if (channel === 'followup') {
    return `Subject: Following up on application: ${role} — ${cName}

Hi Hiring Team at ${company},

I hope you are having a productive week!

I wanted to quickly follow up on my recent application for the ${role} position. 

With my background in virtual assistance, spreadsheet data cleaning, and fast data entry (65+ WPM, 99.8% accuracy) at ${cCompany}, I am very excited about the opportunity to support your daily operations and free up your team's time.

Our portfolio and client work samples are available here: ${portfolioUrl}

Please let me know if you would like me to complete a brief test sample or if any additional information is needed.

Warm regards,

${cName}
${client.headline || 'Virtual Assistant & Data Entry Specialist'} | ${cCompany}
Email: ${client.email} | Phone: ${client.phone}
LinkedIn: ${client.linkedin}`;
  }

  // 4. COLD EMAIL / DIRECT CLIENT PITCH
  if (channel === 'email' || channel === 'cold_pitch') {
    return `Subject: Quick question regarding your data & administrative operations — ${cName}

Dear ${company} Team,

I came across your business and wanted to reach out directly with a simple way to help streamline your daily operations.

At Nexa Digital Team (${portfolioUrl}), we help founders, e-commerce stores, and busy teams eliminate administrative bottlenecks through fast, reliable, and error-free support.

How we can help your team right away:
• High-Accuracy Data Entry (65+ WPM typing, verified 99.8% accuracy).
• Spreadsheet Optimization (Google Sheets & Excel data cleaning, VLOOKUP, Pivot Tables, formatting).
• Web Research & Lead Generation (Building clean, verified prospect contact lists).
• Inbox & Calendar Management (Inbox Zero, appointment scheduling across US/EU timezones).
• Canva Graphics & YouTube Thumbnails (High-converting visual assets).

We offer flexible hourly or monthly retainer arrangements with immediate start availability.

Would you be open to a quick 5-minute chat or letting me complete a small free test sample to show our quality?

Best regards,

${cName}
Virtual Assistant & Operations Specialist
${cCompany}
Portfolio: ${portfolioUrl}
Email: ${client.email} | Phone: ${client.phone}
LinkedIn: ${client.linkedin}`;
  }

  // 5. DEFAULT: LINKEDIN INMAIL / DIRECT MESSAGE
  return `Subject: Application: ${role} — ${cName} (Virtual Assistant & Data Specialist)

Hi Hiring Team at ${company},

I recently submitted my application for the ${role} position and wanted to introduce myself directly.

Over the past ${cYears} years at ${cCompany}, I have specialized in virtual assistance, spreadsheet organization, high-speed data entry, and remote operations support.

A few highlights from my work that directly align with your needs:
• Delivered 65+ WPM typing with 99.8% verified accuracy across high-volume data cleaning and transcription projects.
• Daily expertise with Google Sheets, Excel (VLOOKUP, formulas, Pivot Tables), Notion, Trello, and Canva.
• Self-driven, reliable communicator with full availability across US/UK/European time zones.
• View our portfolio and digital workflows: ${portfolioUrl}

I would welcome a brief conversation to discuss how I can take administrative and data tasks off your plate this week.

Warm regards,

${cName}
Virtual Assistant & Data Entry Specialist
${cCompany}
Email: ${client.email} | Phone: ${client.phone}
LinkedIn: ${client.linkedin}`;
}

if (typeof globalThis !== 'undefined') {
  globalThis.generateRecruiterOutreach = generateRecruiterOutreach;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateRecruiterOutreach };
}
