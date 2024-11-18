import express from 'express';
import { getUser, updateUser, saveJob, applyForJob, getApplications,getJobSeekers,getRecruiters } from '../controllers/userController.js';
import multer from 'multer';
import { getNotifications, markNotificationsAsRead } from '../controllers/notificationController.js';
import { getJobs, savedJobs,editJob, getJob } from '../controllers/jobController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// user routes
router.post('/', getUser);
router.put('/', updateUser);
router.post('/save', saveJob);
router.get('/jobs/saved/', savedJobs);
router.put('/jobs/editjob/:jobId',editJob);
router.get('/jobs', getJobs);
router.get('/jobs/:jobId', getJob);
router.post('/apply', upload.single('resume'), applyForJob);
router.get('/applications', getApplications);
router.get('/notifications', getNotifications);
router.put('/notifications/read', markNotificationsAsRead);

// Fetch recruiters and jobseekers
router.get('/recruiters', getRecruiters);
router.get('/jobSeekers', getJobSeekers);

export default router;