const db = require('../config/db');  
const path = require('path');
const fs = require('fs'); 
const { getRecommendedJobs } = require('../services/jobService');

const jobController = {
    getJobs: (req, res) => {
      db.query(
        'SELECT id, title, description, image, salary, location, company FROM jobs ORDER BY created_at DESC',
        async (err, jobs) => {
          if (err) {
            console.error('Error fetching jobs:', err);
            return res.status(500).send('Error fetching jobs');
          }
  
          try {
            const recommendedJobs = await getRecommendedJobs();
            
            res.render('jobs/list', { jobs, recommendedJobs, user: req.session.user });
          } catch (error) {
            console.error('Error fetching recommended jobs:', error);
            res.render('jobs/list', { jobs, recommendedJobs: [], user: req.session.user });
          }
        }
      );
    },

  getCreateJob: (req, res) => {
    if(req.session.user.role !== 'admin') {
      res.redirect('/', { user: req.session.user });
    }
    res.render('jobs/create', {user: req.session.user});
  },  

  createJob: (req, res) => {
    const { title, description, image, salary, location, company, skills } = req.body;
    const imageUrl = image && image.trim() !== "" ? image : null;
    const companyName = company && company.trim() !== "" ? company : null;

    db.query(
        'INSERT INTO jobs (title, description, image, salary, location, company, skills) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description, imageUrl, salary, location, companyName, skills],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error creating job');
            }
            res.redirect('/');
        }
    );
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
      const { title, description, image, location, salary, company, skills } = req.body;
      
      db.query(
          'UPDATE jobs SET title = ?, description = ?, location = ?, salary = ?, image = ?, company = ?, skills = ? WHERE id = ?',
          [title, description, location, salary, image, company, skills, req.params.id],
          (err) => {
              if (err) {
                  return res.status(500).send('Error updating job');
              }
              res.redirect('/');
          }
      );
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
    const userEmail = req.session.user?.email;

    if (!userEmail) {
        return res.status(401).send('Unauthorized: Please log in to view job details');
    }

    db.query('SELECT * FROM jobs WHERE id = ?', [jobId], (err, jobs) => {
        if (err) {
            return res.status(500).send('Error fetching job details');
        }
        if (jobs.length === 0) return res.status(404).send('Job not found');

        const job = jobs[0];

        // Check if the user has already applied
        db.query('SELECT * FROM applications WHERE jobId = ? AND userEmail = ?', [jobId, userEmail], (err, applications) => {
            if (err) {
                return res.status(500).send('Error checking application status');
            }

            const hasApplied = applications.length > 0;
            res.render('jobDetails', { job, hasApplied, user: req.session.user });
        });
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
      const { name, email, phone, gender, graduation, jobId, skills } = req.body;
      const resumeFile = req.files?.resume; // Get the uploaded file

      if (!resumeFile) {
          return res.status(400).send("Resume file is required.");
      }

      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
      }

      const resumeFilename = `${Date.now()}_${resumeFile.name}`;
      const resumePath = path.join(uploadDir, resumeFilename);

      resumeFile.mv(resumePath, (err) => {
          if (err) {
              console.error("Error saving file:", err);
              return res.status(500).send("Error saving resume file.");
          }

          const query = `
            INSERT INTO applications (jobId, userName, userEmail, phone, gender, graduation, skills, resume)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          db.query(query, [jobId, name, email, phone, gender, graduation, skills, resumeFilename], (err, result) => {
              if (err) {
                  console.error("Error inserting application:", err);
                  return res.status(500).send("Internal Server Error");
              }

              res.redirect(`/jobs/${jobId}`);
          });
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
  },

  getApplicationDetails: (req, res) => {
      if (req.session.user.role !== 'admin') {
          return res.redirect('/');
      }

      const applicationId = req.params.id;
      const query = 'SELECT * FROM applications WHERE id = ?';

      db.query(query, [applicationId], (err, result) => {
          if (err) {
              console.error('Error fetching application details:', err);
              return res.status(500).send('Error fetching application details');
          }

          if (result.length === 0) {
              return res.status(404).send('Application not found');
          }

          res.render('applicationDetails', { application: result[0], user: req.session.user });
      });
  },

  downloadResume: (req, res) => {
      const filename = req.params.filename;
      const filePath = path.join(__dirname, '../uploads', filename);

      if (fs.existsSync(filePath)) {
          res.download(filePath, filename);
      } else {
          res.status(404).send('File not found');
      }
  }

};

module.exports = jobController;
