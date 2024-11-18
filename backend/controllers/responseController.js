import { responsesCollection, jobsCollection,notificationsCollection } from '../db.js';
import { ObjectId } from 'mongodb';
import axios from 'axios';

export const getResponses = async(req,res)=>{
  try {
    const userId=req.query.userId;
    const responses = await responsesCollection.find({ recruiterId: userId }).toArray();
    res.status(200).json({ responses });
  }catch(error){
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteApplication=async(req,res)=>{
    const{ applicationId } = req.params;
    try{
      const application = await responsesCollection.findOne({ _id: new ObjectId(applicationId) });
      if(!application){
        return res.status(404).json({ error: 'Application not found' });
      }
      await responsesCollection.deleteOne({ _id: new ObjectId(applicationId) }); // Ensure ObjectId is used here
      res.status(200).json({ message: 'Response Deleted Successfully' });
    }catch(error){
      console.error('Error deleting response:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  export const updateApplicationStatus=async (req,res)=>{
      const{ applicationId } = req.params;
      const{ status } = req.body;
      try{
        const result = await responsesCollection.updateOne(
          { _id: new ObjectId(applicationId) },
          { $set: { status } }
        );
        if(result.modifiedCount === 0){
          return res.status(404).json({ message: 'Application not found' });
        }
        const application = await responsesCollection.findOne({ _id: new ObjectId(applicationId) });
        const job = await jobsCollection.findOne({ _id: new ObjectId(application.jobId) });
        const notification = {
          userId: application.userId,
          message: `Your application status for ${job ? job.title : 'the job'} has been updated to ${status}.`,
          read: false,
          createdAt: new Date(),
        };
        await notificationsCollection.insertOne(notification);
        res.status(200).json({ message: 'Application status updated successfully' });
      }catch (error){
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
    export const downloadResume = async (req,res)=>{
      const encodedUrl = req.params.id;
      const resumeUrl = decodeURIComponent(encodedUrl);
      try{
        const cloudinaryResponse = await axios.get(resumeUrl, { responseType: 'stream' });
        res.setHeader('Content-Disposition', 'attachment'); 
        res.setHeader('Content-Type', cloudinaryResponse.headers['content-type']);
        cloudinaryResponse.data.pipe(res);
      }catch(error){
        console.error('Error downloading resume:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    