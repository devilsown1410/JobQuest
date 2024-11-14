import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { GridFSBucket} from 'mongodb';
import mongoose from 'mongoose';

dotenv.config();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let usersCollection;
let jobsCollection;
let responsesCollection;
let notificationsCollection;
let bucket;

async function connectToDatabase() {
  try {
    const client=  new MongoClient(uri);
    console.log("Connected to MongoDB");
    const database = client.db("JobQuest");
    usersCollection = database.collection("User");
    jobsCollection = database.collection("Jobs");
    bucket =new GridFSBucket(database,{ bucketName: 'resumes'})
    responsesCollection = database.collection("Responses");
    notificationsCollection = database.collection("Notifications");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
export {
  usersCollection,
  jobsCollection,
  responsesCollection,
  notificationsCollection,
  bucket,
  connectToDatabase
};