import { usersCollection,responsesCollection,jobsCollection,bucket } from '../db.js';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';

export const getUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User  not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  const { email, username, phone, address, bio, education, experience, skills } = req.body;
  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: ' User   not found' });
    }
    const updatedUser  = await usersCollection.findOneAndUpdate(
      { email },
      { $set: { username, phone, address, bio, education, experience, skills } },
      { returnDocument: 'after' }
    );
    res.status(200).json({ user: updatedUser .value });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const applyForJob = async (req, res) => {
  const { jobId, userId, message } = req.body;
  const resumeFile = req.file;

  try {
    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const recruiterId=job.userId;
    console.log(userId);
    console.log(job.applicants)
    job.applicants.push(userId);
    console.log(job.applicants)
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let resumeId;
    if (resumeFile) {
      const readableResumeStream = new Readable();
      readableResumeStream.push(resumeFile.buffer);
      readableResumeStream.push(null);

      const uploadStream = bucket.openUploadStream(resumeFile.originalname);
      readableResumeStream.pipe(uploadStream);

      uploadStream.on('finish', async () => {
        resumeId = uploadStream.id;

        const response = {
          jobId,
          userId,
          recruiterId,
          message,
          resumeId,
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
      });

      uploadStream.on('error', (error) => {
        console.error('Error uploading resume:', error);
        res.status(500).json({ message: 'Internal server error' });
      });
    } else {
      const response = {
        jobId,
        userId,
        message,
        recruiterId,
        candidateName: user.username,
        candidateEmail: user.email,
        appliedAt: new Date(),
      };
      await responsesCollection.insertOne(response);

      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { appliedJobs: jobId } }
      );
      res.status(200).json({ message: 'Job application submitted successfully' });
    }
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const saveJob = async (req, res) => {
  const { jobId, userId } = req.body;

  try {
    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { savedJobs: { _id:jobId,title:job.title } }}
    );
    res.status(200).json({ message: 'Job Saved successfully' });
  } catch (error) {
    console.error('Error saving the job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getApplications = async (req, res) => {
    const userId = req.query.userId;
    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    try {
      const applications = await responsesCollection.find({ userId: userId }).toArray();
      const applicationsWithJobTitles = await Promise.all(applications.map(async (application) => {
          const job = await jobsCollection.findOne({ _id: new ObjectId(application.jobId) });
          return { ...application, title: job ? job.title : 'Job not found' };
      }));
  
      res.status(200).json(applicationsWithJobTitles);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ message: 'Internal server error' });
  }}

  export const getRecruiters = async (req, res) => {
    try {
      const recruiters = await usersCollection.find({ userType: 'recruiter' }).toArray();
      res.status(200).json(recruiters);
    } catch (error) {
      console.error('Error fetching recruiters:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const getJobSeekers = async (req, res) => {
    try {
      const jobSeekers = await usersCollection.find({ userType: 'jobSeeker' }).toArray();
      res.status(200).json(jobSeekers);
    } catch (error) {
      console.error('Error fetching job seekers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };