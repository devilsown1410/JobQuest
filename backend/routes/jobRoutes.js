import express from 'express';
import { getJobs, postJob, updateJob, deleteJob, getApplicants } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobs);

export default router;