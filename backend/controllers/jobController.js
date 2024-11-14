import { jobsCollection, responsesCollection, usersCollection } from '../db.js';
import { ObjectId } from 'mongodb';

export const getJobs = async (req, res) => {
  const { page = 1, limit = 10, search = '', location = '', company = '', typeOfEmployment = '',sort='salary' } = req.query;
  const skip = (page - 1) * limit;
  const query = {
    ...(search && { title: { $regex: search, $options: 'i' } }),
    ...(location && { 'company.location': location }),
    ...(company && { 'company.name': company }),
    ...(typeOfEmployment && { type_of_employment: typeOfEmployment }),
  };
  const sortCriteria = sort === 'salary' ? { salary: -1 } : { company: -1 };
  try {
    const jobs = await jobsCollection.find(query).skip(skip).limit(parseInt(limit)).sort(sortCriteria).toArray();
    const totalJobs = await jobsCollection.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);
    res.status(200).json({ jobs, totalPages, currentPage: parseInt(page) });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getJob=async (req, res) => {
    const { jobId } = req.params;
    try {
      const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.status(200).json({ job });
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

export const postJob = async (req, res) => {
  const { title, companyName, location, salary, experience, typeOfEmployment,userId } = req.body;
  try {
    const newJob = {
      title,
      company: {
        name: companyName,
        location,
      },
      job_titles: [title],
      salary,
      experience,
      type_of_employment: typeOfEmployment,
      applicants:[],
      approved:false,
      rejected:false,
      userId:userId,
    };
    const result = await jobsCollection.insertOne(newJob);
    res.status(201).json({ message: 'Job posted successfully', job: {...newJob, _id:result.insertedId} });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateJob=async (req, res) => {
    const { jobId } = req.params;
    const jobDetails = req.body;
    try {
      const result = await jobsCollection.updateOne(
        { _id: new ObjectId(jobId) },
        { $set: jobDetails }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

export const deleteJob=async (req, res) => {
      const { jobId } = req.params;
    
      try {
        const result = await jobsCollection.deleteOne({ _id: new ObjectId(jobId) });
    
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Job not found' });
        }
    
        res.status(200).json({ message: 'Job deleted successfully' });
      } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

    export const getApplicants=async (req, res) => {
        const { jobId } = req.params;
      
        try {
          const count = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
          res.status(200).json({ applicants: count.applicants });
        } catch (error) {
          console.error('Error fetching applicant count:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      };

      export const savedJobs = async (req, res) => {
          const { userId } = req.query;
          try {
              const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
              if (!user) {
                  return res.status(404).json({ message: 'User  not found' });
              }
              res.status(200).json({ savedJobs: user.savedJobs || [] });
          } catch (error) {
              console.error('Error fetching saved jobs:', error);
              res.status(500).json({ message: 'Internal server error' });
          }
      };

export const editJob = async (req, res) => {
  const { jobId } = req.params;
  const jobDetails = req.body;
  if (!jobDetails || Object.keys(jobDetails).length === 0) {
    return res.status(400).json({ message: 'Invalid job details' });
  }
  const{_id, ...updateDetails}=jobDetails;
  try {
    const result = await jobsCollection.updateOne(
      { _id: new ObjectId(jobId) },
      { $set: updateDetails }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job updated successfully', jobDetails: updateDetails });
  } catch (error) {
    console.error('Error editing job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getJobByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const jobs = await jobsCollection.find({ userId: userId }).toArray();
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}