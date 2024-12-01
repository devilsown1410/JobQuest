import { usersCollection, jobsCollection } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import sendEmail from './emailController.js';

export const adminLogin = async(req, res)=>{
  const{ email, password } = req.body;
  try{
    const admin = await usersCollection.findOne({ email, userType: 'admin' });
    if(!admin){
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if(!isPasswordValid){
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: admin._id, email: admin.email, userType: admin.userType }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ token, admin });
  }catch(error){
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyAdminToken =(req,res,next)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if(!token){
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.userType !== 'admin'){
      return res.status(403).json({ message: 'Access denied. Not an admin.' });
    }
    req.user=decoded;
    next();
  }catch(error){
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export const getUsers = async(req,res)=>{
  try{
    const users = await usersCollection.find({
      userType: 'jobSeeker',
    }).toArray();
    res.status(200).json(users);
  }catch(error){
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyUser = async(req,res)=>{
  const { userId } = req.params;
  try{
    await usersCollection.updateOne({ _id: new ObjectId(userId) },{ $set: { verified: true } });
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    await sendEmail({
      to: user.email,
      subject: 'User  Verification - Welcome to JobQuest!',
      text: `
          Hi ${user.username},
  
          Thank you for registering with JobQuest! We're excited to have you on board.
  
          Your account has been successfully created, and you are now verified as a user. You can start exploring job opportunities, applying for positions, and connecting with potential employers.
  
          Best regards,
          The JobQuest Team
      `,
  });
    res.status(200).json({ message: 'User verified successfully' });
  }catch(error){
    console.error('Error verifying user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const blockUser = async(req, res)=>{
  const { userId } = req.params;
  const { block } = req.body;
  try{
    await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { blocked: block } });
    res.status(200).json({ message: `User ${block ? 'blocked' : 'unblocked'} successfully` });
  }catch(error){
    console.error(`Error ${block ? 'blocking' : 'unblocking'} user:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCompanies =async(req,res)=>{
  try{
    const companies = await usersCollection.find({
      userType: 'recruiter',
    }).toArray();
    res.status(200).json(companies);
  }catch(error){
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyCompany = async(req,res)=>{
  const{ companyId } = req.params;
  try{
    await usersCollection.updateOne({ _id: new ObjectId(companyId) }, { $set: { verified: true} });
    const company = await usersCollection.findOne({ _id: new ObjectId(companyId) });
    await sendEmail({
      to: company.email,
      subject: 'Company Verification - Welcome to JobQuest!',
      text: `
          Dear ${company.name},
  
          Congratulations! Your company has been successfully verified with JobQuest.
  
          We are thrilled to have you as part of our community. As a verified company, you can now post job openings, connect with potential candidates, and access a range of features designed to help you find the right talent.
  
          Best regards,
          The JobQuest Team
      `,
  });
    res.status(200).json({ message: 'Company verified successfully' });
  }catch(error){
    console.error('Error verifying company:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectCompany = async(req,res)=>{
  const{ companyId } = req.params;
  try{
    await usersCollection.updateOne({ _id: new ObjectId(companyId) }, { $set: { rejected: true } });
    const company = await usersCollection.findOne({ _id: new ObjectId(companyId) });
    await sendEmail({
      to: company.email,
      subject: 'Company Verification',
      text: `Your Company ${company.title} has been rejected to be verified by JobQuest. Please contact support Team`,
      });
    res.status(200).json({ message: 'Company rejected successfully' });
    
  }catch(error){
    console.error('Error rejecting company:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getJobs = async (req,res)=>{
  try{
    const jobs = await jobsCollection.find({ }).toArray();
    res.status(200).json(jobs);
  }catch(error){
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const approveJob = async (req,res)=>{
  const { jobId } = req.params;
  try{
    await jobsCollection.updateOne({ _id: new ObjectId(jobId) }, { $set: { approved: true } });
    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
    const userId=await usersCollection.findOne({_id:new ObjectId(job.userId)});
    await sendEmail({
      to: userId.email,
      subject: 'Job Approval - Your Listing is Live!',
      text: `
          Hi ${userId.name},
  
          We are excited to inform you that your job listing for "${job.title}" has been approved successfully!
  
          Your job is now live on JobQuest, and potential candidates can start applying.
          Best regards,
          The JobQuest Team
      `,
  });
    res.status(200).json({ message: 'Job approved successfully' });
  }catch(error){
    console.error('Error approving job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectJob = async(req,res)=>{
  const { jobId } = req.params;
  try{
    await jobsCollection.updateOne({ _id: new ObjectId(jobId) }, { $set: { rejected: true } });
    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
    const userId=await usersCollection.findOne({_id:new ObjectId(job.userId)});
    await sendEmail({
      to: userId.email,
      subject: 'Job Rejection - Update on Your Listing',
      text: `
          Hi ${userId.name},
  
          We appreciate your interest in posting the job listing for "${job.title}" on JobQuest. 
  
          After careful consideration, we regret to inform you that your job listing has not been approved at this time.
  
          Best regards,
          The JobQuest Team
      `,
  });
    res.status(200).json({ message: 'Job rejected successfully' });
  }catch(error){
    console.error('Error rejecting job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteJob = async (req,res)=>{
  const { jobId } = req.params;
  try{
    await jobsCollection.deleteOne({ _id: new ObjectId(jobId) });
    res.status(200).json({ message: 'Job deleted successfully' });
  }catch(error){
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};