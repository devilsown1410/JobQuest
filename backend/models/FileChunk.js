import { Schema, model } from 'mongoose';

const fileChunkSchema = new Schema({
  files_id: {
    type: Schema.Types.ObjectId,
    ref: 'File',
    required: true,
  },
  n: {
    type: Number,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
}, { timestamps: true });

export default model('FileChunk', fileChunkSchema);
