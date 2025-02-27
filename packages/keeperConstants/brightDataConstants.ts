export const getCrunchbaseCompanyInfoSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1vijqt9jfj7olije&include_errors=true&type=discover_new&discover_by=keyword&limit_per_input=5';

export const getGlassdoorCompanyInfoSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7j0bx501ockwldaqf&include_errors=true&type=discover_new&discover_by=keyword&limit_per_input=5';

export const glassdoorSearchUrl = 'https://www.glassdoor.com/Search/results.htm?keyword=';

export const glassdoorReviewsSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7j1po0921hbu0ri1z&include_errors=true&limit_per_input=30';

export const getLinkedInCompanySnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1vikfnt1wgvvqz95w&include_errors=true';

export const getIndeedCompanySnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7qekxkv2i7ve6hx1s&include_errors=true';

export const getLinkedInJobSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lpfll7v5hcqtkxl6l&include_errors=true&type=discover_new&discover_by=keyword&limit_per_input=100';

export const getIndeedJobSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l4dx9j9sscpvs7no2&type=discover_new&discover_by=keyword&limit_per_input=100';

// export const getCrunchbaseCompanyInfoSnapshotUrl =
//   'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1vijqt9jfj7olije&include_errors=true';

const cities = [
  'Atlanta, GA',
  'Los Angeles, CA',
  'New York, NY',
  'Chicago, IL',
  'Austin, TX',
  'Boston, MA',
  'Seattle, WA',
  'San Francisco, CA',
  'Washington, DC',
  'Denver, CO',
  'Miami, FL',
  'San Jose, CA',
  'Boulder, CO',
  'Durham, NC',
  'Bloomington, IL',
  'Huntsville, AL',
  'Charlotte, NC',
  'Baltimore, MD',
];

export const linkedInFilters = cities.map(city => ({
  location: city,
  keyword: 'remote software developer',
  country: 'US',
  time_range: 'Any time',
  job_type: '',
  experience_level: '',
  remote: 'Remote',
  company: '',
}));

export const indeedFilters = cities.map(city => ({
  country: 'US',
  domain: 'indeed.com',
  keyword_search: 'remote software developer',
  location: city,
}));
