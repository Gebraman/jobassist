// Multi-Client Database for JobAssist AI Studio
const DEFAULT_CLIENTS = [
  {
    id: 'client_raymond_wong',
    name: 'Raymond Wong',
    first: 'Raymond',
    last: 'Wong',
    preferredName: 'Ray',
    email: 'raymond1994.glo@outlook.com',
    phone: '510-340-2070',
    headline: 'Senior Back-End / AI & ML Software Engineer',
    targetRole: 'Senior Back-End / AI & ML Software Engineer',
    department: 'Engineering',
    experience: '8 years',
    seniority: 'Senior',
    employmentType: 'Full-time',
    loc: 'Atlanta, GA, United States',
    addr: '215 Piedmont Ave NE APT 1206',
    city: 'Atlanta',
    state: 'GA',
    zip: '30308',
    country: 'United States',
    workArrangement: 'Remote',
    pronouns: 'He/Him',
    gender: 'Male',
    race: 'Asian',
    veteran: 'I am not a protected veteran',
    disability: 'No, I do not have a disability',
    sexualOrientation: 'Heterosexual / Straight',
    demoNoticeAck: true,
    dob: '12/09/1994',
    ssn4: '0928',
    title: 'Senior Software Engineer (Back-End & AI/ML)',
    currentTitle: 'Senior Software Engineer (Back-End & AI/ML)',
    company: 'Uber Eats',
    currentEmployer: 'Uber Eats',
    school: 'University of Florida',
    degree: "Master's Degree in Computer Science",
    education: "Master's Degree in Computer Science - University of Florida (2016)",
    educationYear: '2016',
    gpa: '3.85',
    certifications: 'AWS Certified Solutions Architect, Certified Kubernetes Administrator (CKA)',
    languages: 'English (Native/Fluent), Cantonese (Conversational)',
    linkedin: 'https://www.linkedin.com/in/ray-w-3888b33aa',
    github: 'https://github.com/raymondwong-ai',
    portfolio: 'https://app.talentral.org',
    salary: '$175,000 - $190,000',
    desiredComp: '$175,000 USD Yearly',
    salaryNum: '175000',
    notice: '2 weeks',
    noticePeriod: '2 weeks',
    yearsBE: '8',
    sponsorship: 'No',
    workAuth: 'Authorized to work',
    citizenship: 'US Citizen',
    legallyAuthorized: 'Yes',
    relocation: 'Maybe',
    startDate: 'Immediately',
    earliestStartDate: 'Immediately',
    source: 'LinkedIn',
    status: 'New',
    recruiter: 'Executive Recruiter',
    jobId: 'REQ-2026-904',
    resumeRef: 'Executive Masterwork Standard',
    rating: '5 Stars',
    notes: '8+ years scaling distributed systems at Uber Eats, EY, and Coca-Cola. Strong in Go, Python, AWS, and event-driven architectures.',
    skills: [
      'Go', 'Python', 'TypeScript', 'Node.js', 'PostgreSQL', 'Kafka', 'Redis',
      'Docker', 'Kubernetes (EKS)', 'AWS (SageMaker, ECS, Lambda, S3, RDS)',
      'Distributed Systems', 'gRPC', 'Microservices', 'LLMs & RAG', 'CI/CD'
    ],
    experience: [
      {
        role: 'Senior Software Engineer (Back-End)',
        company: 'Uber Eats',
        period: '2021 – Present',
        bullets: [
          'Architected high-throughput backend dispatch and ranking microservices in Go and Python serving 45M+ active users.',
          'Achieved sub-18ms p99 latency across distributed microservice mesh and reduced AWS compute costs by 14%.',
          'Managed distributed Kafka event streaming clusters processing 120k+ order events/sec with zero message drop.'
        ]
      },
      {
        role: 'Senior ML & Back-End Engineer',
        company: 'Ernst & Young (EY)',
        period: '2018 – 2021',
        bullets: [
          'Engineered distributed NLP and fraud detection backends processing enterprise audit datasets at scale.',
          'Built high-performance REST and gRPC API layers integrated with PostgreSQL and Redis caching.'
        ]
      },
      {
        role: 'Software Engineer',
        company: 'The Coca-Cola Company',
        period: '2016 – 2018',
        bullets: [
          'Developed cloud-native telemetry ingestion backends and automated ETL pipelines on AWS.'
        ]
      }
    ],
    summary: 'Senior Back-End & AI/ML Software Engineer with 8+ years of enterprise experience architecting and scaling distributed microservices, high-throughput cloud backends (AWS/Kubernetes), and low-latency APIs. Proven track record at Uber Eats, EY, and Coca-Cola optimizing backend performance and high availability.',
    letterTemplate: 'Dear Hiring Team at {COMPANY},\n\nI am writing to express my enthusiastic interest in the {ROLE} position. Over the past 8+ years at Uber Eats, EY, and Coca-Cola, I have specialized in architecting mission-critical distributed backends, high-concurrency microservices, and cloud-native infrastructure on AWS and Kubernetes.\n\nAt Uber Eats, I led core backend dispatch microservices handling 45M+ active users with sub-18ms p99 latency. I have extensive hands-on expertise with Python, Go, TypeScript, PostgreSQL, Redis, Kafka, Docker, and Kubernetes.\n\nI would welcome the opportunity to discuss how my back-end engineering experience can support {COMPANY}\'s engineering roadmap.\n\nWarm regards,\nRaymond Wong\nSenior Back-End / AI & ML Software Engineer\nEmail: raymond1994.glo@outlook.com | Phone: 510-340-2070'
  },
  {
    id: 'client_sarah_chen',
    name: 'Sarah Chen',
    first: 'Sarah',
    last: 'Chen',
    email: 'sarah.chen.tech@gmail.com',
    phone: '415-890-4421',
    headline: 'Staff Full-Stack & Cloud Platform Architect',
    loc: 'San Francisco, CA, United States',
    addr: '450 Mission St APT 2104',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
    dob: '05/14/1992',
    ssn4: '4412',
    title: 'Staff Full-Stack Engineer',
    company: 'Stripe',
    school: 'UC Berkeley',
    degree: "Bachelor's Degree in EECS",
    educationYear: '2014',
    gpa: '3.91',
    linkedin: 'https://www.linkedin.com/in/sarah-chen-dev',
    github: 'https://github.com/sarahchen-cloud',
    portfolio: 'https://sarahchen.io',
    salary: '$205,000 - $225,000',
    salaryNum: '205000',
    notice: '2 weeks',
    yearsBE: '10',
    sponsorship: 'No',
    workAuth: 'Yes',
    gender: 'Female',
    race: 'Asian',
    veteran: 'I am not a protected veteran',
    disability: 'No, I do not have a disability',
    citizenship: 'US Citizen',
    legallyAuthorized: 'Yes',
    relocation: 'Yes',
    skills: [
      'React', 'Next.js', 'TypeScript', 'Node.js', 'Go', 'GraphQL', 'PostgreSQL',
      'AWS', 'Kubernetes', 'TailwindCSS', 'Distributed Systems', 'System Design'
    ],
    experience: [
      {
        role: 'Staff Full-Stack Engineer',
        company: 'Stripe',
        period: '2020 – Present',
        bullets: [
          'Led frontend and backend architecture for Stripe Connect merchant dashboard used by 2M+ businesses.',
          'Built real-time analytics streaming pipelines with GraphQL, React, and Go microservices.'
        ]
      },
      {
        role: 'Senior Software Engineer',
        company: 'Datadog',
        period: '2016 – 2020',
        bullets: [
          'Engineered telemetry dashboard UI and backend aggregator services in TypeScript, React, and Go.'
        ]
      }
    ],
    summary: 'Staff Full-Stack Engineer with 10+ years building hyperscale developer tools, payment platforms, and modern web applications across Stripe and Datadog. Master of TypeScript, React, Go, and cloud architectures.',
    letterTemplate: 'Dear Hiring Team at {COMPANY},\n\nI am thrilled to apply for the {ROLE} opportunity. Over the past decade at Stripe and Datadog, I have led cross-functional engineering teams delivering enterprise-grade web applications and high-throughput backend APIs.\n\nWarm regards,\nSarah Chen'
  },
  {
    id: 'client_alex_rivera',
    name: 'Alex Rivera',
    first: 'Alex',
    last: 'Rivera',
    email: 'alex.rivera.sre@outlook.com',
    phone: '206-554-1980',
    headline: 'Senior DevOps / SRE & Cloud Infrastructure Architect',
    loc: 'Seattle, WA, United States',
    addr: '1201 3rd Ave Unit 1805',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    country: 'United States',
    dob: '08/21/1993',
    ssn4: '7103',
    title: 'Senior Site Reliability Engineer',
    company: 'Airbnb',
    school: 'University of Washington',
    degree: "Bachelor's Degree in Computer Engineering",
    educationYear: '2015',
    gpa: '3.82',
    linkedin: 'https://www.linkedin.com/in/alex-rivera-sre',
    github: 'https://github.com/alexrivera-infra',
    portfolio: 'https://alexrivera.cloud',
    salary: '$185,000 - $200,000',
    salaryNum: '185000',
    notice: '2 weeks',
    yearsBE: '9',
    sponsorship: 'No',
    workAuth: 'Yes',
    gender: 'Male',
    race: 'Hispanic or Latino',
    veteran: 'I am not a protected veteran',
    disability: 'No, I do not have a disability',
    citizenship: 'US Citizen',
    legallyAuthorized: 'Yes',
    relocation: 'Yes',
    skills: [
      'Kubernetes', 'Terraform', 'AWS', 'GCP', 'Docker', 'Prometheus', 'Grafana',
      'Python', 'Go', 'Bash', 'CI/CD (GitHub Actions, ArgoCD)', 'Zero Trust Security'
    ],
    experience: [
      {
        role: 'Senior SRE / Infrastructure Engineer',
        company: 'Airbnb',
        period: '2020 – Present',
        bullets: [
          'Maintained 99.995% service availability across multi-region Kubernetes clusters running on AWS.',
          'Built automated Terraform infrastructure-as-code modules reducing developer environment spinup from 4 hours to 6 minutes.'
        ]
      }
    ],
    summary: 'Senior DevOps & SRE Architect with 9+ years delivering 99.995% uptime, zero-downtime CI/CD deployments, and enterprise cloud infrastructure automation on AWS and Kubernetes.',
    letterTemplate: 'Dear Hiring Team at {COMPANY},\n\nI am excited to submit my candidacy for {ROLE}. My extensive background managing mission-critical infrastructure at Airbnb and HashiCorp provides the exact reliability and DevOps rigor your team needs.\n\nBest regards,\nAlex Rivera'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_CLIENTS };
}
