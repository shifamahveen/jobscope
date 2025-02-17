const db = require('../config/db');  

const jobController = {
  getJobs: (req, res) => {
    db.query('SELECT id, title, description, image, salary, location, company FROM jobs ORDER BY created_at DESC', (err, jobs) => {
      if (err) {
        return res.status(500).send('Error fetching jobs');
      }
      res.render('jobs/list', { jobs, user: req.session.user });
    });
  },

  getCreateJob: (req, res) => {
    res.render('jobs/create', {user: req.session.user});
  },  

  createJob: (req, res) => {
    const { title, description, image, salary, location, company } = req.body;
    const imageUrl = image ? image : null;
    db.query('INSERT INTO jobs (title, description, image, salary, location, company) VALUES (?, ?, ?, ?, ?)', [title, description, imageUrl, salary, location, company || null], (err) => {
      if (err) {
        return res.status(500).send('Error creating job');
      }
      res.redirect('/');
    });
  },

  getEditJob: (req, res) => {
    db.query('SELECT * FROM jobs WHERE id = ?', [req.params.id], (err, jobs) => {
      if (err) {
        console.error('Error fetching job:', err);
        return res.status(500).send('Error fetching job');
      }
      if (jobs.length === 0) return res.status(404).send('Job not found');
      res.render('jobs/edit', { job: jobs[0], user: req.session.user });
    });
  },

  updateJob: (req, res) => {
    const { title, description, image, location, salary, company } = req.body;
    db.query('UPDATE jobs SET title = ?, description = ?, location = ?, salary = ?, image = ?, company=? WHERE id = ?', [title, description, location, salary, image, company, req.params.id], (err) => {
      if (err) {
        return res.status(500).send('Error updating job');
      }
      res.redirect('/');
    });
  },

  deleteJob: (req, res) => {
    db.query('DELETE FROM jobs WHERE id = ?', [req.params.id], (err) => {
      if (err) {
        return res.status(500).send('Error deleting job');
      }
      res.redirect('/');
    });
  },

  getJobDetails: (req, res) => {
    const jobId = req.params.id;
    db.query('SELECT * FROM jobs WHERE id = ?', [jobId], (err, jobs) => {
      if (err) {
        return res.status(500).send('Error fetching job details');
      }
      if (jobs.length === 0) return res.status(404).send('Job not found');
      res.render('jobDetails', { job: jobs[0], user: req.session.user });
    });
  },

  getApplicationPage: (req, res) => {
    const jobId = req.params.id;
    db.query('SELECT title FROM jobs WHERE id = ?', [jobId], (err, job) => {
      if (err) {
        return res.status(500).send('Error fetching job title');
      }
      res.render('application', { job: job[0], user: req.session.user, jobId });
    });
  },

  submitApplication: (req, res) => {
    const { name, email, phone, gender, graduation, jobId } = req.body;
    
    const query = `
      INSERT INTO applications (jobId, userName, userEmail, phone, gender, graduation)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [jobId, name, email, phone, gender, graduation], (err, result) => {
      if (err) {
        console.error('Error inserting application:', err);
        return res.status(500).send('Internal Server Error');
      }
      
      res.redirect(`/jobs/${jobId}`);
    });
  },

  getApplications: (req, res) => {
    if (req.session.user.role !== 'admin') {
      return res.redirect('/');
    }

    db.query('SELECT * FROM applications', (err, applications) => {
      if (err) {
        console.error('Error fetching applications:', err);
        return res.status(500).send('Error fetching applications');
      }

      res.render('applications', { applications, user: req.session.user });
    });
  }
};

module.exports = jobController;
