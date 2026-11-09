// Autonomous Recruiter & Client Outreach Message Synthesizer — Nexa Digital Team
// Generates tailored Upwork Proposals, Formal SOW Agreements, Cold Email Pitches,
// LinkedIn Connection Notes, and Follow-ups specifically designed for Remote Agency clients.

function generateRecruiterOutreach(client, jobInfo = {}, channel = 'upwork_bid') {
  const company = jobInfo.company || 'your business';
  const role = jobInfo.title || client.headline || client.targetRole || 'Virtual Assistant / Data Entry Specialist';
  const cName = client.name || 'Gebremedhin Endeshawe (Gman)';
  const cCompany = client.company || 'Nexa Digital Team';
  const cYears = client.yearsBE || client.yearsOfExperience || '3+';
  const portfolioUrl = client.portfolio || 'https://nexa-portfolio-theta.vercel.app/';

  // 1. UPWORK / FREELANCER TOP-RATED AGENCY PROPOSAL
  if (channel === 'upwork_bid' || channel === 'proposal') {
    return `Hi ${company} Hiring Team,

I can take full ownership of this ${role} assignment and deliver clean, verified, 99.8% accurate results starting today.

Most remote administrative and data entry projects fail because of three common pain points: high typo rates, lack of proactive communication, and missed deadlines. At Nexa Digital Team (${portfolioUrl}), we eliminate all three through systematic quality control and dedicated team backup.

Why our team is the ideal partner for your project:
• Speed & Verified Precision: 65+ WPM typing speed with an audited 99.8% data accuracy SLA.
• Advanced Spreadsheet Operations: Daily mastery of Google Sheets and MS Excel—including dynamic XLOOKUP, INDEX/MATCH, Pivot Tables, automated conditional formatting, deduplication, and multi-tab reconciliation.
• Comprehensive Digital Support: Experienced across web research, verified lead generation, customer inbox management (Inbox Zero), and Canva Pro visual design.
• Guaranteed Continuity: Backed by Nexa Digital Team, meaning your workflows never stall or miss a deadline.

Our 3-Phase Execution Roadmap:
1. Alignment & Pilot Sample (Hours 1–2): We review your source data and complete a complimentary 50-record pilot test for your immediate inspection and formatting approval.
2. Production Execution: Rapid processing with automated formula checks and formatting validations.
3. Multi-Point Quality Assurance: Final manual spot-audit (15% random sample) before final delivery to ensure zero errors.

We work seamless overlapping hours across US (EST/CST/PST), UK, and European timezones, with prompt Slack/Teams communication.

Are you available for a quick chat to discuss your formatting guidelines, or should I begin with a small test batch right now?

Warm regards,

${cName}
Virtual Assistant & Data Operations Lead | ${cCompany}
Portfolio & Case Studies: ${portfolioUrl}
Direct Email: ${client.email} | Telegram/WhatsApp: ${client.phone}`;
  }

  // 2. FORMAL SCOPE OF WORK (SOW) & SERVICE LEVEL AGREEMENT (SLA)
  if (channel === 'sow' || channel === 'sow_agreement') {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `================================================================================
SERVICE LEVEL AGREEMENT & SCOPE OF WORK (SOW)
Provider: Nexa Digital Team (${portfolioUrl})
Lead Specialist: ${cName} (${client.email})
Client / Organization: ${company}
Project Title: ${role} Operational Support
Effective Date: ${today}
================================================================================

1. EXECUTIVE ENGAGEMENT OBJECTIVE
Nexa Digital Team will provide dedicated remote operational support, high-accuracy data entry, and spreadsheet administration to streamline daily business processes for ${company}.

2. DELIVERABLES & CORE SCOPE
• High-Precision Data Entry: Systematic entry, transcript verification, and database updating at 65+ WPM with a guaranteed 99.8% accuracy SLA.
• Spreadsheet Optimization: Structuring, deduplication, and formula implementation (XLOOKUP, Pivot Tables, conditional rules) in Google Sheets & MS Excel.
• Web Research & Lead Generation: Sourcing verified business contact records with syntax-validated emails and direct phone numbers.
• Inbox & Calendar Management: Daily email triage (Inbox Zero), scheduling meetings across overlapping US/EU time zones, and drafting client correspondence.
• Creative Asset Support: High-CTR visual graphics, YouTube thumbnails, and presentation formatting in Canva Pro.

3. QUALITY ASSURANCE & SERVICE LEVEL AGREEMENT (SLA)
• Accuracy Guarantee: 99.8% verified error-free rate across all processed data batches.
• Turnaround Time: Standard turnaround within 12–24 business hours from receipt of source materials.
• Free Pilot Sample: 50-row quality verification sample completed prior to milestone funding.
• Business Continuity: Nexa Digital Team provides continuous backup coverage, ensuring zero project pauses due to illness or personal absence.

4. DATA SECURITY & CONFIDENTIALITY
• Strict adherence to mutual non-disclosure (NDA) standards.
• All data accessed exclusively via encrypted 2FA credentials; zero unauthorized local file retention.
• Immediate post-engagement credential handover and data purging upon written client confirmation.

5. COMMERCIAL TERMS & BILLING
• Standard Rate: ${client.salary || '$12 - $18 / hr USD'} (or agreed monthly retainer).
• Time Tracking & Reporting: Transparent daily time logging with end-of-day milestone summaries.
• Invoicing: Bi-weekly or monthly via Upwork, Escrow, Bank Wire, or preferred platform.

Prepared & Authorized by:
${cName} — Operations Lead, Nexa Digital Team
Contact: ${client.email} | ${client.phone}
Portfolio: ${portfolioUrl}`;
  }

  // 3. COLD EMAIL / DIRECT B2B CLIENT PITCH
  if (channel === 'email' || channel === 'cold_pitch') {
    return `Subject: Dedicated Operations & Data Entry Support for ${company} — Nexa Digital Team

Dear ${company} Leadership Team,

I came across ${company} and wanted to reach out directly with a simple way to help streamline your daily operations and eliminate administrative overhead.

At Nexa Digital Team (${portfolioUrl}), we serve as a dedicated, fractional remote operations department for busy founders, e-commerce brands, and digital agencies.

How we provide immediate leverage for your team:
• High-Accuracy Data Operations: 65+ WPM typing speed with a verified 99.8% data accuracy SLA.
• Spreadsheet Optimization: Google Sheets & Excel data cleaning, XLOOKUP modeling, Pivot Tables, deduplication, and reporting dashboards.
• Web Research & Lead Generation: Sourcing and cleaning verified B2B prospect lists for targeted outbound campaigns.
• Executive Inbox & Scheduling: Managing daily inboxes (Inbox Zero) and calendar coordination across US/UK/EU time zones.
• Creative Visual Assets: Designing high-converting presentation slides, social media graphics, and YouTube thumbnails in Canva Pro.

We offer flexible hourly arrangements ($12 - $18 / hr) or structured monthly retainers with immediate onboarding availability.

Would you be open to a brief 5-minute introductory conversation or letting our team complete a small free test sample (50 records) to demonstrate our speed and quality?

Best regards,

${cName}
Virtual Assistant & Operations Lead
Nexa Digital Team
Portfolio: ${portfolioUrl}
Email: ${client.email} | Phone: ${client.phone}
LinkedIn: ${client.linkedin}`;
  }

  // 4. LINKEDIN CONNECTION NOTE (< 300 CHARACTERS)
  if (channel === 'connection_note') {
    return `Hi! I saw your ${role} opening. With ${cYears} yrs experience in high-accuracy data entry (65+ WPM, 99.8% accuracy), Excel/Sheets, and remote admin support at Nexa Digital (${portfolioUrl}), I’d love to connect and help your team!`;
  }

  // 5. APPLICATION FOLLOW-UP
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

  // 6. DEFAULT: LINKEDIN INMAIL / DIRECT MESSAGE
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
