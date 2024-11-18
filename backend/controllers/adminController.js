import { usersCollection, jobsCollection } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

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
    await usersCollection.updateOne({ _id: new ObjectId(companyId) }, { $set: { verified: true } });
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