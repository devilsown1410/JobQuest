import { usersCollection } from '../db.js';

export const getRecruiter = async(req,res)=>{
  const{ email } = req.body;
  try{
    const recruiter = await usersCollection.findOne({ email,userType: 'recruiter' });
    if(!recruiter){
      return res.status(404).json({ message: 'Recruiter not found' });
    }
    res.status(200).json({ recruiter });
  }catch(error){
    console.error('Error fetching recruiter data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRecruiter = async(req,res)=>{
  const{ email, username, phone, company, bio } = req.body;
  try{
    const recruiter = await usersCollection.findOne({ email,userType: 'recruiter' });
    if(!recruiter){
      return res.status(404).json({ message: 'Recruiter not found' });
    }
    const updatedRecruiter = await usersCollection.findOneAndUpdate(
      { email, userType: 'recruiter' },
      { $set: { username, phone, company, bio } },
      { returnDocument: 'after' }
    );
    res.status(200).json({ recruiter: updatedRecruiter.value });
  }catch (error){
    console.error('Error updating recruiter profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};