import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['jobSeeker', 'recruiter','admin'],
    required: true,
  },
  savedJobs: {
    type: [String],
  },
  appliedJobs: {
    type: [String],
  },
  bio: {
    type: String,
  },
  company: {
    type: String,
  },
  phone: {
    type: String,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
export default User;
