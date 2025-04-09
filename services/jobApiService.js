const axios = require('axios');

const getExternalJobs = async () => {
  const url = 'https://google-jobs-api.p.rapidapi.com/google-jobs/job-type?jobType=Full-time&include=Developer&location=India';
  const options = {
    method: 'GET',
    url,
    headers: {
      'x-rapidapi-key': 'ea86ec0756msh17e532df1e1c9c9p170c20jsnebad0933d91c',
      'x-rapidapi-host': 'google-jobs-api.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.jobs || [];
  } catch (error) {
    console.error('Failed to fetch external jobs:', error);
    return [];
  }
};

module.exports = { getExternalJobs };