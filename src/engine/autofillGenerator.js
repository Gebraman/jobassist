/**
 * Autonomous Application Auto-Fill Payload Generator — Nexa Digital Team
 * Implements "Fill Full by Itself" capability for ATS forms
 * (Workable, JazzHR, Greenhouse, Lever, Workday, BambooHR, Ashby, LinkedIn Easy Apply)
 */

export function generateAutofillPayload({ job, candidate, fitData }) {
  const comp = job.company || 'the company';
  const role = job.title || 'Virtual Assistant';
  const matched = fitData?.matchedSkills || ['Virtual Assistant', 'Data Entry', 'Google Sheets', 'Excel'];
  const matchedSkills = matched.slice(0, 3).join(', ');

  const [firstName, ...lastNameParts] = (candidate.fullName || 'Gebremedhin Endeshawe').split(' ');
  const lastName = lastNameParts.join(' ') || 'Endeshawe';

  // 1. Core Profile & Contact Fields
  const personalFields = {
    firstName,
    lastName,
    fullName: candidate.fullName || 'Gebremedhin Endeshawe (Gman)',
    email: candidate.email || 'nexadigitalteamhq@gmail.com',
    phone: candidate.phone || '+251 90 985 8645',
    location: candidate.location || 'Addis Ababa, Ethiopia (Remote Worldwide)',
    currentCompany: candidate.currentCompany || 'Nexa Digital Team',
    currentTitle: candidate.currentTitle || 'Virtual Assistant & Data Entry Specialist',
    yearsOfExperience: candidate.yearsOfExperience || 3,
    linkedin: candidate.linkedin || 'https://www.linkedin.com/in/nexa-digitalteamhq-354a1840b',
    github: candidate.github || 'https://github.com/nexadigitalteamhq-design',
    portfolio: candidate.portfolio || 'https://nexa-portfolio-theta.vercel.app/'
  };

  // 2. Legal, Eligibility & Availability Questions
  const legalAndLogistics = {
    authorizedToWork: "Yes",
    requiresSponsorship: "No",
    noticePeriod: "Immediate",
    earliestStartDate: "Immediate upon agreement",
    desiredSalary: "$12 - $18 / hr ($1,500 - $2,500 / month USD)",
    workArrangementPreference: "Remote (Worldwide)",
    nonCompeteStatus: "None / Free of any restrictive covenants",
    willingToRelocate: "Remote only"
  };

  // 3. Custom ATS Screening Question Answers (Auto-Generated & Tailored)
  const screeningQuestions = [
    {
      question: `Why do you want to work at ${comp} as a ${role}?`,
      category: "Motivation & Company Fit",
      answer: `I respect ${comp}'s operational standards and focus on efficiency. At Nexa Digital Team, I have spent 3+ years handling high-volume data entry, spreadsheet management, and remote virtual assistance with 99.8% verified accuracy. I am excited to bring dependable daily support to your team and free up your time.`
    },
    {
      question: `Describe your relevant experience with ${matchedSkills} and administrative tasks.`,
      category: "Operational Competency",
      answer: `I type at 65+ WPM with 99.8% verified accuracy. Daily, I clean and organize multi-tab Google Sheets and Excel workbooks using XLOOKUP and Pivot Tables, conduct online research for verified leads, manage email inboxes, and execute administrative workflows with strict attention to detail.`
    },
    {
      question: "What is your greatest professional achievement to date?",
      category: "Impact & Ownership",
      answer: `Standardizing and deduplicating 12,000+ unstructured customer contact records for an e-commerce client 14 hours ahead of a major product launch deadline, achieving a 99.8% accuracy rate and zero bounced emails.`
    },
    {
      question: "How do you ensure data accuracy, confidentiality, and quality control?",
      category: "Quality Assurance",
      answer: `I follow a three-step quality assurance process: automated formula validation, structured sample checks, and strict adherence to client NDAs. All files are handled through secure 2FA cloud access with zero data leakage.`
    },
    {
      question: "What are your salary and hourly rate expectations?",
      category: "Compensation",
      answer: `My standard rate is $12 - $18 / hr USD ($1,500 - $2,500 / month), with flexibility based on project scope, guaranteed hours, and long-term collaboration.`
    }
  ];

  return {
    jobId: job.id,
    company: comp,
    role: role,
    generatedAt: new Date().toISOString(),
    personalFields,
    legalAndLogistics,
    screeningQuestions,
    exportJsonString: JSON.stringify({
      targetJob: { company: comp, role: role, url: job.url },
      applicant: personalFields,
      legal: legalAndLogistics,
      customQuestions: screeningQuestions
    }, null, 2)
  };
}
