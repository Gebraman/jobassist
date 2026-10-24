// Multi-Client Database for JobAssist AI Studio - Active Primary Client: James Royal
const DEFAULT_CLIENTS = [
  {
    id: 'client_james_royal',
    name: 'James Royal',
    first: 'James',
    last: 'Royal',
    preferredName: 'James',
    email: 'jamesroyal.91@outlook.com',
    phone: '+1 (213) 419-5406',
    phoneRaw: '2134195406',
    headline: 'Senior Data Engineer',
    targetRole: 'Senior Data Engineer',
    department: 'Engineering',
    experience: '13 years',
    yearsOfExperience: 13,
    seniority: 'Senior',
    employmentType: 'Full-time',
    loc: 'Austin, TX 78727',
    addr: '11500 Jollyville Rd',
    addressLine1: '11500 Jollyville Rd',
    city: 'Austin',
    state: 'TX',
    stateFull: 'Texas',
    zip: '78727',
    postalCode: '78727',
    country: 'United States',
    workArrangement: 'Remote',
    pronouns: 'He/Him',
    gender: 'Male',
    race: 'White',
    ethnicity: 'White',
    veteran: 'I am not a protected veteran',
    veteranStatus: 'I am not a protected veteran',
    disability: 'No, I do not have a disability',
    disabilityStatus: 'No, I do not have a disability',
    sexualOrientation: 'Heterosexual / Straight',
    demoNoticeAck: true,
    dob: '04/18/1991',
    dobMonth: '04',
    dobDay: '18',
    dobYear: '1991',
    ssn4: '4819',
    title: 'Senior Data Engineer',
    currentTitle: 'Senior Data Engineer',
    company: 'Givebutter',
    currentEmployer: 'Givebutter',
    school: 'The University of Texas at Austin',
    degree: "Bachelor's Degree in Computer Science",
    education: "Bachelor's Degree in Computer Science - The University of Texas at Austin (2009 - 2013)",
    educationYear: '2013',
    gpa: '3.82',
    certifications: 'AWS Certified Data Engineer – Associate, Snowflake SnowPro Core Certified, Databricks Certified Associate Developer for Apache Spark',
    languages: 'English (Native/Fluent)',
    linkedin: 'https://www.linkedin.com/in/james-royal-37a898443',
    github: 'https://github.com/james-royal',
    portfolio: 'https://jamesroyal.dev',
    salary: '$175,000 - $195,000',
    desiredComp: '$185,000 USD Yearly',
    salaryNum: '185000',
    notice: '2 weeks',
    noticePeriod: '2 weeks',
    yearsBE: '13',
    sponsorship: 'No',
    requiresSponsorship: 'No',
    workAuth: 'Authorized to work',
    workAuthorization: 'US Citizen / Authorized to work (No sponsorship required)',
    citizenship: 'US Citizen',
    legallyAuthorized: 'Yes',
    relocation: 'Maybe',
    startDate: '2 weeks',
    earliestStartDate: '2 weeks',
    source: 'LinkedIn',
    status: 'Active',
    recruiter: 'Direct Application',
    jobId: 'REQ-2026-DATA-01',
    resumeRef: 'James_Royal_Senior_Data_Engineer_Resume.pdf',
    rating: '5 Stars',
    notes: 'Senior Data Engineer with 13+ years building petabyte-scale data pipelines, incremental warehouse modeling, and real-time streaming architectures across Givebutter, Oracle, Atlassian, and Fastly. Expert in Python, SQL, Spark, Kafka, Snowflake, and Airflow.',
    skills: [
      'Python', 'SQL', 'Scala', 'Java', 'Bash',
      'Apache Spark', 'PySpark', 'Spark SQL', 'Spark Streaming', 'Hadoop', 'Hive',
      'Apache Kafka', 'REST APIs', 'Incremental Extraction', 'Event Replay', 'Deduplication',
      'Snowflake', 'Amazon Redshift', 'Oracle Database', 'Amazon S3', 'Parquet',
      'PostgreSQL', 'MySQL', 'Oracle',
      'dbt', 'ETL/ELT', 'Dimensional Modeling', 'Incremental Models', 'Reconciliation',
      'Apache Airflow', 'Git', 'GitHub Actions', 'Jenkins', 'CI/CD',
      'Schema Validation', 'Freshness Checks', 'Dependency Management', 'Backfills', 'Incident Investigation',
      'Role-Based Access', 'Data Lineage', 'Audit Logging', 'Sensitive-Data Handling'
    ],
    experience: [
      {
        role: 'Senior Data Engineer',
        company: 'Givebutter',
        location: 'Austin, TX',
        period: 'May 2024 – Present',
        bullets: [
          'Designed reporting datasets for fundraising transactions, campaigns, and donor activity, defining table grain and relationships so analysts could combine data without duplicating financial totals.',
          'Built incremental ingestion with Python, SQL, and REST APIs, handling pagination, updated records, and duplicate deliveries; separated extraction checkpoints from transformation logic to support interrupted-load recovery.',
          'Developed Snowflake and dbt models that separated source normalization, shared business rules, and reporting outputs, making changes easier to review and trace through downstream dependencies.',
          'Implemented transaction reconciliation and data validation checks for amounts, statuses, identifiers, and record counts, investigating discrepancies before affected datasets reached reporting.',
          'Orchestrated ingestion and transformation with Airflow, defining retries, upstream checks, and backfill procedures rather than relying on manual reruns.',
          'Partnered with application engineers and analysts on schema changes and metric definitions, reviewed pipeline designs, and integrated automated validation into GitHub Actions deployment workflows.'
        ]
      },
      {
        role: 'Senior Data Engineer',
        company: 'Oracle',
        location: 'Austin, TX',
        period: 'May 2020 – May 2024',
        bullets: [
          'Designed batch and streaming integration workflows using Python, SQL, Spark, and Kafka, separating source ingestion from downstream processing so each stage could be deployed and recovered independently.',
          'Developed PySpark and Spark SQL transformations for enterprise datasets, tuning joins, partition sizes, and execution plans to address data skew and unnecessary shuffling.',
          'Built Kafka and Spark Streaming workflows with explicit offset handling, deduplication, and replay procedures, preserving consistent outputs during restarts and historical reprocessing.',
          'Created analytical transformations across Oracle Database and distributed processing platforms, documenting source mappings and validating warehouse outputs against operational records.',
          'Investigated processing failures and slow workloads across database and Spark layers, distinguishing source-data defects from transformation errors and resource constraints.',
          'Reviewed designs with engineering and analytics teams, established shared expectations for schema changes and recovery, and documented release dependencies for business-critical pipelines.'
        ]
      },
      {
        role: 'Data Engineer',
        company: 'Atlassian',
        location: 'San Francisco, CA',
        period: 'Jun 2017 – Apr 2020',
        bullets: [
          'Built Python and SQL pipelines combining application records and product activity data into analytical datasets for internal reporting and operational analysis.',
          'Developed batch transformations using Spark, Hive, and Amazon S3, retaining intermediate outputs so failed processing stages could be inspected and rerun independently.',
          'Designed account, user, and activity datasets with analysts, defining join relationships and aggregation rules to prevent duplicate counting across reports.',
          'Implemented incremental extraction from PostgreSQL, MySQL, and REST APIs, tracking processing boundaries and checking loaded records against source extracts.',
          'Added validation for missing identifiers, duplicate records, and unexpected volume changes, making upstream data problems visible before reporting delivery.',
          'Troubleshot failed jobs and expensive queries, refined SQL and Spark transformations, and documented scheduling and recovery procedures for recurring workflows.'
        ]
      },
      {
        role: 'Data Engineering Analyst',
        company: 'Fastly',
        location: 'San Francisco, CA',
        period: 'Jul 2013 – May 2017',
        bullets: [
          'Developed Python, SQL, and Bash workflows to collect and prepare request logs and service statistics for operational reporting.',
          'Parsed and normalized log records, resolving inconsistent timestamps, missing fields, and malformed entries before analytical processing.',
          'Built reporting queries for traffic patterns, response codes, and cache behavior, maintaining consistent aggregation rules across recurring analyses.',
          'Automated scheduled processing of log extracts and service statistics, checking for incomplete files and missing reporting intervals.',
          'Investigated differences between raw logs and summarized reports, tracing discrepancies to extraction boundaries, parsing logic, and aggregation behavior.',
          'Worked with engineering and operations teams to document metric definitions and investigate changes in traffic and service performance.'
        ]
      }
    ],
    summary: 'Senior Data Engineer with 13+ years of experience developing data pipelines, analytical datasets, and enterprise integration systems. Hands-on expertise in Python, SQL, Spark, Kafka, Snowflake, and Airflow, with a focus on incremental processing, warehouse modeling, and operational reliability. Works across application and analytics teams to define source interfaces, maintain consistent business logic, and investigate issues from ingestion through reporting. Combines architecture work with implementation, code review, and production troubleshooting.',
    letterTemplate: 'Dear Hiring Team at {COMPANY},\n\nI am writing to express my enthusiastic interest in the {ROLE} opportunity. Over the past 13+ years at Givebutter, Oracle, Atlassian, and Fastly, I have specialized in building robust, high-performance data pipelines, analytical datasets, and enterprise streaming architectures.\n\nAt Givebutter, I led core transaction reporting and incremental ingestion pipelines using Python, SQL, REST APIs, Snowflake, dbt, and Airflow, handling complex financial workflows with strict reconciliation and validation checks. Previously at Oracle, I engineered large-scale batch and streaming pipelines with Spark and Kafka, tuning execution plans to eliminate skew and optimize distributed processing.\n\nI would welcome the opportunity to discuss how my 13+ years of hands-on data engineering expertise can support {COMPANY}\'s analytics and data platform goals.\n\nWarm regards,\nJames Royal\nSenior Data Engineer\nAustin, TX 78727 | Phone: +1 (213) 419-5406 | Email: jamesroyal.91@outlook.com\nLinkedIn: https://www.linkedin.com/in/james-royal-37a898443'
  }
];

if (typeof globalThis !== 'undefined') {
  globalThis.DEFAULT_CLIENTS = DEFAULT_CLIENTS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_CLIENTS };
}
