import { usersCollection,responsesCollection,jobsCollection, } from '../db.js';
import { ObjectId } from 'mongodb';
import cloudinary from '../cloudinaryConfig.js';

export const getUser = async (req,res)=>{
  const{ email } = req.body;
  try{
    const user = await usersCollection.findOne({ email });
    if(!user){
      return res.status(404).json({ message: 'User  not found' });
    }
    res.status(200).json({ user });
  }catch(error){
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req,res)=>{
  const{ email,username,phone,address,bio,education,experience,skills } = req.body;
  try{
    const user = await usersCollection.findOne({ email });
    if(!user){
      return res.status(404).json({ message: ' User   not found' });
    }
    const updatedUser  = await usersCollection.findOneAndUpdate(
      { email },
      { $set: { username, phone, address, bio, education, experience, skills } },
      { returnDocument: 'after' }
    );
    res.status(200).json({ user: updatedUser.value });
  }catch (error){
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const applyForJob = async(req, res)=>{
  const { jobId,userId,message } = req.body;
  const resumeFile = req.file;
  try{
    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
    if(!job){
      return res.status(404).json({ message: 'Job not found' });
    }
    const recruiterId = job.userId;
    job.applicants.push(userId);
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }
    let resumeUrl;
    if(resumeFile){
      try{
        resumeUrl = await new Promise((resolve, reject)=>{
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'raw', folder: 'resumes' },
            (error, result) => {
              if(error){
                console.error('Error uploading resume to Cloudinary:', error);
                reject(error);
              }else{
                resolve(result.secure_url);
              }
            }
          );
          uploadStream.end(resumeFile.buffer);
        });
      }catch(uploadError){
        console.error('Error during resume upload:', uploadError);
        return res.status(500).json({ message: 'Error uploading resume' });
      }
    }
    const response = {
      jobId,
      userId,
      recruiterId,
      message,
      resumeUrl: resumeUrl || null,
      candidateName: user.username,
      candidateEmail: user.email,
      appliedAt: new Date(),
      status: 'Applied',
    };
    await responsesCollection.insertOne(response);
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { appliedJobs: jobId } }
    );
    await jobsCollection.updateOne(
      { _id: new ObjectId(jobId) },
      { $set: { applicants: job.applicants } }
    );

    res.status(200).json({ message: 'Job application submitted successfully' });
  }catch (error){
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const saveJob = async(req,res)=>{
  const{ jobId, userId } = req.body;
  try{
    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
    if(!job){
      return res.status(404).json({ message: 'Job not found' });
    }
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { savedJobs: { _id:jobId,title:job.title } }}
    );
    res.status(200).json({ message: 'Job Saved successfully' });
  }catch (error){
    console.error('Error saving the job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getApplications = async(req,res)=>{
    const userId = req.query.userId;
    if(!userId || !ObjectId.isValid(userId)){
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    try {
      const applications = await responsesCollection.find({ userId: userId }).toArray();
      const applicationsWithJobTitles = await Promise.all(applications.map(async (application) => {
          const job = await jobsCollection.findOne({ _id: new ObjectId(application.jobId) });
          return { ...application, title: job ? job.title : 'Job not found' };
      }));
      res.status(200).json(applicationsWithJobTitles);
    }catch(error){
      console.error('Error fetching applications:', error);
      res.status(500).json({ message: 'Internal server error' });
  }}

  export const getRecruiters = async(req,res)=>{
    try{
      const recruiters = await usersCollection.find({ userType: 'recruiter' }).toArray();
      res.status(200).json(recruiters);
    }catch(error){
      console.error('Error fetching recruiters:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const getJobSeekers = async(req,res)=>{
    try{
      const jobSeekers = await usersCollection.find({ userType: 'jobSeeker' }).toArray();
      res.status(200).json(jobSeekers);
    }catch(error){
      console.error('Error fetching job seekers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };