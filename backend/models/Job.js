import { Schema, model } from 'mongoose';

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
  },
  job_titles: {
    type: [String],
  },
  salary: {
    type: Number,
  },
  experience: {
    type: String,
  },
  type_of_employment: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
  },
  approved: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default model('Job', jobSchema);
