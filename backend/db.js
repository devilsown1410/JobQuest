import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const uri = process.env.MONGO_URI;

let usersCollection;
let jobsCollection;
let responsesCollection;
let notificationsCollection;

async function connectToDatabase() {
  try {
    const connect=await mongoose.connect(uri);
    console.log("Connected to MongoDB");
    const database = connect.connection.db;
    usersCollection = database.collection("User");
    jobsCollection = database.collection("Jobs");
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
  connectToDatabase
};