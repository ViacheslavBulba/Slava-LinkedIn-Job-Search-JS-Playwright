export const username = "YOUR_LINKEDIN_USERNAME";
export const password = "YOUR_LINKEDIN_PASSWORD";

export const PositionsToSearch = [
  'Senior QA Automation Engineer',
  'SDET',
];

export const jobLocation = 'Las Vegas, Nevada';

export const RemoteJobsOnlyFilter = false;
// export const RemoteJobsOnlyFilter = true; // jobLocation is ignored if remote = true

export const pageLimitToSearchForEachPosition = 40;

export const datePostedFilter = 'Past month';
// export const datePostedFilter = 'Past week';
// export const datePostedFilter = 'Past 24 hours';

export const experienceLevelFilter = [ // to enable any specific set of values - remove // at the beginning
  // 'Internship',
  // 'Entry level',
  // 'Associate',
  // 'Mid-Senior level',
  // 'Director',
  // 'Executive',
]

export const jobTypeFilter = [
  'Full-time',
  // 'Part-time',
  // 'Contract',
]

// export const salaryLevelFilter = '$40,000+'; // '$60,000+' // $80,000+' // '$100,000+' // '$120,000+'
// // IN MANY POSITIONS SALARY IS NOT SPECIFIED, SO I WOULD NOT USE THIS FILTER, BUT IF YOU WANT TO - YOU CAN

export const JobNamePartsToInclude = [ // jobs that have any of these in the name - include only them into the results
  // 'QA',
  // 'Test',
  // 'SDET',
  // 'Quality Assurance',
  // 'Automation',
  // 'Software Quality Engineer',
]

export const JobDescriptionsStopWordsArray = [ // used while opening jobs after filtering by name to analyze job description
  // '$60,000/yr', // exact text copied from from job description
  // '$70,000/yr', // exact text copied from from job description
  // '$80,000/yr', // exact text copied from from job description
  // 'Python', // any jobs that have this text in job description - will be excluded
  // '3+ years of stress/load/performance testing of web applications', // exact text copied from from job description
  // '1+ years of experience in CRM analytics - Salesforce', // exact text copied from from job description
]

export const CompanyOrJobNameToExclude = [
  'Mapleton Hill', // exclude all positions from this company
  'iOS Engineer', // exclude all positions that have 'iOS Engineer' in name from any company
];