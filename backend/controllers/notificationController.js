import { notificationsCollection } from '../db.js';
import { ObjectId } from 'mongodb';

export const getNotifications = async(req,res)=>{
  const { userId } = req.query;
  if(!userId || !ObjectId.isValid(userId)){
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  try{
    const notifications = await notificationsCollection.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).toArray();
    res.status(200).json(notifications);
  }catch (error){
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const markNotificationsAsRead = async(req,res)=>{
  const userId = req.body.userId;
  try{
    await notificationsCollection.updateMany({ userId: userId, read: false },{ $set: { read: true } });
    await notificationsCollection.deleteMany({ userId: userId, read: true });
    res.status(200).json({ message: 'Notifications marked as read' });
  }catch(error){
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};