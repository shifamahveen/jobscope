const express = require('express');
const jobController = require('../controllers/JobController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.get('/', ensureAuthenticated, jobController.getJobs);
router.get('/jobs/:id', ensureAuthenticated, jobController.getJobDetails);
router.get('/apply/:id', ensureAuthenticated, jobController.getApplicationPage);
router.post('/submit-application', ensureAuthenticated, jobController.submitApplication);
router.get('/admin/applications', ensureAuthenticated, jobController.getApplications);

router.get('/job/create', ensureAuthenticated, jobController.getCreateJob);
router.post('/jobs/create', ensureAuthenticated, jobController.createJob);
router.get('/jobs/edit/:id', ensureAuthenticated, jobController.getEditJob);
router.post('/jobs/edit/:id', ensureAuthenticated, jobController.updateJob);
router.post('/jobs/delete/:id', ensureAuthenticated, jobController.deleteJob);
router.get('/applications/:id', ensureAuthenticated, jobController.getApplicationDetails);
router.get('/download/:filename', ensureAuthenticated, jobController.downloadResume);

module.exports = router;