const CLIENT = {
  name: 'Raymond Wong',
  first: 'Raymond',
  last: 'Wong',
  email: 'raymond1994.glo@outlook.com',
  phone: '510-340-2070',
  headline: 'Senior Back-End / AI & ML Software Engineer',
  address: '215 Piedmont Ave NE APT 1206, Atlanta, GA 30308, United States',
  summary: 'Senior Back-End & AI/ML Software Engineer with 8+ years of experience designing and scaling distributed microservices, high-throughput cloud architectures (AWS/Kubernetes), and low-latency APIs. Proven track record at Uber Eats, EY, and Coca-Cola driving reliability and performance.',
  linkedin: 'https://www.linkedin.com/in/ray-w-3888b33aa',
  github: 'https://github.com/raymondwong-ai',
  portfolio: 'https://app.talentral.org',
  salary: '$175,000 - $190,000',
  salaryNum: '175000',
  notice: '2 weeks',
  yearsBE: '8',
  sponsorship: 'No',
  workAuth: 'Yes',
  coverLetter: 'Dear Hiring Team at Bask Health,\n\nI am writing to express my enthusiastic interest in the Senior Back-End Software Engineer position. With 8+ years of experience architecting enterprise-scale distributed systems, high-concurrency microservices, and cloud-native backends at Uber Eats, EY, and Coca-Cola, I am excited to bring my technical expertise to Bask Health.\n\nBest regards,\nRaymond Wong'
};

function matchField(questionText, inputType = 'text') {
  const q = questionText.toLowerCase();

  // 1. First Name
  if (q.includes('first name') || q.includes('given name') || q.includes('fname')) {
    return { field: 'first', value: CLIENT.first };
  }
  // 2. Last Name
  if (q.includes('last name') || q.includes('family name') || q.includes('surname') || q.includes('lname')) {
    return { field: 'last', value: CLIENT.last };
  }
  // 3. Full Name
  if (q.includes('full name') || (q.includes('name') && !q.includes('company') && !q.includes('school') && !q.includes('user') && !q.includes('file'))) {
    return { field: 'name', value: CLIENT.name };
  }
  // 4. Email
  if (inputType === 'email' || q.includes('email')) {
    return { field: 'email', value: CLIENT.email };
  }
  // 5. Headline
  if (q.includes('headline') || q.includes('tagline') || q.includes('professional title')) {
    return { field: 'headline', value: CLIENT.headline };
  }
  // 6. Phone
  if (inputType === 'tel' || q.includes('phone') || q.includes('mobile') || q.includes('contact number')) {
    return { field: 'phone', value: CLIENT.phone };
  }
  // 7. Address / Location
  if (q.includes('address') || q.includes('city') || q.includes('location') || q.includes('based') || q.includes('region')) {
    return { field: 'address', value: CLIENT.address };
  }
  // 8. Summary / Profile / Bio
  if (q.includes('summary') || q.includes('about you') || q.includes('bio') || q.includes('profile')) {
    return { field: 'summary', value: CLIENT.summary };
  }
  // 9. Cover letter
  if (q.includes('cover') || q.includes('letter') || q.includes('note to hiring')) {
    return { field: 'coverLetter', value: CLIENT.coverLetter };
  }
  // 10. LinkedIn URL
  if (q.includes('linkedin')) {
    return { field: 'linkedin', value: CLIENT.linkedin };
  }
  // 11. GitHub
  if (q.includes('github') || q.includes('git profile') || q.includes('code repo')) {
    return { field: 'github', value: CLIENT.github };
  }
  // 12. Portfolio / Website
  if (q.includes('portfolio') || q.includes('website') || q.includes('personal site') || (q.includes('url') && !q.includes('linkedin'))) {
    return { field: 'portfolio', value: CLIENT.portfolio };
  }
  // 13. Years of Experience as BE / Software Engineer
  if (q.includes('years') || q.includes('experience') && (q.includes('be') || q.includes('backend') || q.includes('software') || q.includes('engineer'))) {
    return { field: 'yearsBE', value: CLIENT.yearsBE };
  }
  // 14. Visa Sponsorship
  if (q.includes('sponsor') || q.includes('visa') || q.includes('h-1b')) {
    return { field: 'sponsorship', value: CLIENT.sponsorship };
  }
  // 15. Desired Salary
  if (q.includes('salary') || q.includes('compensation') || q.includes('pay') || q.includes('rate')) {
    return { field: 'salary', value: CLIENT.salary };
  }
  // 16. Notice period
  if (q.includes('notice') || q.includes('start date') || q.includes('availability') || q.includes('how soon')) {
    return { field: 'notice', value: CLIENT.notice };
  }

  return null;
}

const workableQuestions = [
  "*First name",
  "*Last name",
  "*Email",
  "Headline (Optional)",
  "Phone (Optional) The hiring team may use this number to contact you about this job.",
  "Address (Optional) Include your city, region, and country, so that employers can easily manage your application.",
  "Summary (Optional)",
  "Cover letter (Optional)",
  "*Please share your LinkedIn URL link. This is a requirement, if you do not share this with us your application will unfortunately be rejected.",
  "*How many years of professional experience do you have as a BE Software Engineer? (Please exclude internships)",
  "*Will you now or in the future require sponsorship for employment visa status (e.g., H-1B)?",
  "*What is your desired salary range? This field is required.",
  "*Please leave your GitHub link if you have one",
  "*If we were to extend an offer, what would be your notice period?"
];

console.log('Testing Workable Question Matching:');
let allPassed = true;
workableQuestions.forEach(q => {
  const res = matchField(q);
  if (res) {
    console.log(`✅ [${res.field}]: "${q.slice(0, 40)}..." -> "${res.value}"`);
  } else {
    console.log(`❌ FAILED to match: "${q}"`);
    allPassed = false;
  }
});

console.log('\nAll questions matched successfully?', allPassed);
