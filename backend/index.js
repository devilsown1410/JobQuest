import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(bodyParser.json());
app.use(cors());

connectToDatabase();

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the JobQuest API');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/admin', adminRoutes);
app.use('api/companies', companyRoutes);

const rooms = {};

io.on('connection', (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room);
    if (rooms[room]) {
      socket.emit('previousMessages', rooms[room]);
    }
  });

  socket.on('message', (data) => {
    if (!rooms[data.room]) {
      rooms[data.room] = [];
    }
    rooms[data.room].push(data);
    if (rooms[data.room].length > 20) {
      rooms[data.room].shift();
    }
    io.to(data.room).emit('message', data);
  });
  socket.on('disconnect', () => {
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});