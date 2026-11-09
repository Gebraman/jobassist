// JobAssist AI Studio - Autonomous Interview Copilot & Question Predictor Engine
// Tailored specifically for Virtual Assistant, Data Entry, Spreadsheet Management, and Remote Support roles

export function generateInterviewPrep({ jobTitle, company, keywords = [], salaryRange = '', candidate }) {
  const role = jobTitle || 'Virtual Assistant & Data Entry Specialist';
  const org = company || 'Target Company';
  const skills = (keywords && keywords.length > 0) ? keywords : ['DATA ENTRY', 'GOOGLE SHEETS', 'EXCEL', 'WEB RESEARCH', 'CUSTOMER SUPPORT', 'ADMINISTRATIVE'];
  const name = candidate?.name || 'Gebremedhin Endeshawe (Nexa Digital Team)';
  const years = candidate?.yearsBE || candidate?.yearsOfExperience || '3+';
  const headline = candidate?.headline || 'Virtual Assistant & Data Entry Specialist';
  const portfolioUrl = candidate?.portfolio || 'https://nexa-portfolio-theta.vercel.app/';

  // 1. 30-Second Elevator Pitch
  const elevatorPitch = `I am a ${headline} with ${years} years of dedicated experience supporting digital businesses, founders, and e-commerce stores with high-accuracy data entry, spreadsheet management, and remote operations. I type at 65+ WPM with a verified 99.8% accuracy rate, and I specialize in ${skills.slice(0, 4).join(', ')}. Backed by Nexa Digital Team (${portfolioUrl}), I take operational friction off busy founders' plates so their business runs seamlessly across time zones.`;

  // 2. Predicted Operational & Practical STAR Questions
  const technicalQuestions = [
    {
      question: `How would you handle a situation where a client gives you 12,000 messy rows of contact records with missing fields and duplicates right before an urgent deadline?`,
      category: 'Data Operations & Spreadsheets',
      starAnswer: {
        situation: `At Nexa Digital Team, an e-commerce client handed over 12,000 unorganized customer leads that needed to be cleaned, formatted, and loaded into their CRM before an urgent product launch.`,
        task: `I was tasked with standardizing phone formats, validating email structures, removing duplicates, and delivering a clean database within 48 hours.`,
        action: `I built automated Google Sheets formulas (TRIM, REGEXEXTRACT, XLOOKUP, and conditional formatting rules), leveraged automated deduplication, and manually spot-checked 15% random samples to guarantee zero data loss.`,
        result: `Delivered the complete verified database 14 hours ahead of deadline with 99.8% verified accuracy, enabling the client's launch campaign to achieve a 98.4% email deliverability rate.`
      }
    },
    {
      question: `How do you organize your day, prioritize tasks from multiple clients, and ensure zero missed deadlines while working remotely?`,
      category: 'Time Management & Remote Productivity',
      starAnswer: {
        situation: `At Nexa Digital Team, I routinely handle concurrent tasks across multiple client projects, including daily email triage, daily lead scraping, and ad-hoc presentation formatting.`,
        task: `I needed to ensure that high-priority client requests were addressed immediately without letting ongoing research or data cleaning fall behind.`,
        action: `I structure my workflow using Trello and Notion with the Eisenhower Matrix—blocking focused deep-work hours for high-volume data entry, maintaining continuous Slack availability for urgent client requests, and holding daily end-of-day milestone reviews.`,
        result: `Maintained a 100% on-time delivery record across all client deliverables with zero missed deadlines over the past two years.`
      }
    },
    {
      question: `Walk us through your process for ensuring 99.8%+ accuracy when transcribing or entering sensitive financial or customer data into Excel or Google Sheets.`,
      category: 'Quality Control & Accuracy',
      starAnswer: {
        situation: `A client required manual extraction and entry of quarterly expense receipts and customer records into financial tracking workbooks.`,
        task: `I was responsible for ensuring zero discrepancies between paper receipts, digital invoices, and the final spreadsheet balances.`,
        action: `I established a three-phase verification protocol: (1) high-speed entry with strict data validation dropdowns to eliminate syntax typos, (2) automated formula reconciliation where cross-sheet sum checks verified ledger balances, and (3) a secondary visual spot-audit of every high-value transaction.`,
        result: `Achieved 100% reconciliation with zero discrepancies during the client's annual financial audit.`
      }
    },
    {
      question: `How do you handle difficult customer support inquiries or emails where the client is upset or frustrated?`,
      category: 'Customer Support & Communication',
      starAnswer: {
        situation: `A customer emailed our support desk deeply frustrated about an order delivery delay due to a regional logistics issue.`,
        task: `My goal was to de-escalate the customer's frustration, validate their feelings, provide immediate clarity, and retain their trust in the brand.`,
        action: `I replied within 7 minutes using empathetic, respectful phrasing without making defensive excuses. I tracked their package directly with the courier, offered an immediate tracking update, and arranged a complimentary store credit for the inconvenience.`,
        result: `The customer replied thanking our team for the quick personal resolution, left a 5-star review, and placed another order within two weeks.`
      }
    }
  ];

  // 3. Rate Negotiation Playbook
  const expectedSalary = salaryRange || '$12 - $18 / hr ($1,500 - $2,500 / month)';
  const salaryPlaybook = {
    targetRange: expectedSalary,
    initialScreeningResponse: `Based on my 3+ years of remote virtual assistance experience, verified 99.8% data accuracy, and daily proficiency in Google Sheets, Excel, and AI workflow automation, my standard rate is ${expectedSalary}. I am flexible depending on guaranteed monthly hours and long-term collaboration.`,
    counterOfferScript: `Thank you for extending this opportunity to support ${org}! I am very enthusiastic about working together. Given my fast typing speed (65+ WPM), proven record with zero missed deadlines, and the dedicated backup coverage of Nexa Digital Team, if we can agree on $15 / hr (or a $2,200/month flat retainer), I am ready to begin onboarding immediately.`,
    goldenRules: [
      'Highlight 99.8% verified accuracy and fast turnaround to justify your rate.',
      'Emphasize the Nexa Digital Team backup guarantee (continuous coverage without sick days).',
      'Offer a small paid test task (2-3 hours) if the client is hesitating.'
    ]
  };

  // 4. Strategic Reverse Interview Questions
  const reverseQuestions = [
    {
      target: 'Operations Lead / Business Owner',
      question: `What are the most time-consuming administrative tasks on your plate right now that you would love to delegate in the first week?`
    },
    {
      target: 'Project Manager',
      question: `What software and communication tools does your team use daily for task tracking and file sharing?`
    },
    {
      target: 'Founder / Hiring Manager',
      question: `What does ideal success look like for this ${role} position after the first 30 days?`
    }
  ];

  return {
    role,
    company: org,
    candidateName: name,
    elevatorPitch,
    technicalQuestions,
    salaryPlaybook,
    reverseQuestions,
    generatedAt: new Date().toISOString()
  };
}
