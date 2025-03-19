const fetch = require('node-fetch');

const getRecommendedJobs = async () => {
  const url = 'https://jsearch.p.rapidapi.com/estimated-salary?job_title=nodejs%20developer&location=india&location_type=ANY&years_of_experience=ALL';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'ea86ec0756msh17e532df1e1c9c9p170c20jsnebad0933d91c',
      'x-rapidapi-host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!Array.isArray(result.data) || result.data.length === 0) {
      console.error('Invalid or empty response:', result);
      return [];
    }

    return result.data.map(salary => ({
      job_title: salary.job_title,
      location: salary.location,
      min_salary: salary.min_salary,
      max_salary: salary.max_salary,
      median_salary: salary.median_salary,
      currency: salary.salary_currency,
      salary_period: salary.salary_period,
      publisher_name: salary.publisher_name,
      publisher_link: salary.publisher_link
    }));
  } catch (error) {
    console.error('Error fetching salary estimates:', error);
    return [];
  }
};

module.exports = { getRecommendedJobs };