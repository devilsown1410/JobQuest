import express from 'express';
import {
  adminLogin,
  verifyAdminToken,
  getUsers,
  verifyUser,
  blockUser,
  getCompanies,
  verifyCompany,
  rejectCompany,
  getJobs,
  approveJob,
  rejectJob,
  deleteJob
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.use(verifyAdminToken); // Protect all routes below this line

router.get('/users', getUsers);
router.put('/users/:userId/verify', verifyUser);
router.put('/users/:userId/block', blockUser);

router.get('/companies', getCompanies);
router.put('/companies/:companyId/verify', verifyCompany);
router.put('/companies/:companyId/reject', rejectCompany);

router.get('/jobs', getJobs);
router.put('/jobs/:jobId/approve', approveJob);
router.put('/jobs/:jobId/reject', rejectJob);
router.delete('/jobs/:jobId', deleteJob);

export default router;