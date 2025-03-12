const fetch = require('node-fetch');

const getRecommendedJobs = async () => {
  const url = 'https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'ea86ec0756msh17e532df1e1c9c9p170c20jsnebad0933d91c',
      'x-rapidapi-host': 'linkedin-job-search-api.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.slice(0, 3).map(job => ({
      id: job.id,
      title: job.title,
      company: job.organization,
      url: job.url,
      logo: job.organization_logo
    }));
  } catch (error) {
    console.error('Error fetching recommended jobs:', error);
    return [];
  }
};

module.exports = { getRecommendedJobs };