import express from 'express';
import { getRecruiter, updateRecruiter } from '../controllers/recruiterController.js';
import { getResponses, downloadResume, updateApplicationStatus, deleteApplication } from '../controllers/responseController.js';
import { postJob, updateJob, deleteJob, getApplicants, getJobs, getJob, getJobByUserId } from '../controllers/jobController.js';

const router = express.Router();

// Recruiter Routes
router.post('/', getRecruiter);
router.put('/', updateRecruiter);

// Job Routes
router.post('/jobs', postJob);
router.get('/jobs', getJobs);
router.get('/jobs/:userId', getJobByUserId);
router.put('/jobs/:jobId', updateJob);
router.delete('/jobs/:jobId', deleteJob)

// Applicants for a job
router.get('/jobs/:jobId/applicants', getApplicants);

// Application Routes
router.get('/applications', getResponses);
router.get('/applications/download/:id', downloadResume);
router.put('/applications/:applicationId/status', updateApplicationStatus);
router.delete('/applications/:applicationId', deleteApplication);

export default router;
