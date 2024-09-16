const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

// Import Cloudinary configuration
const cloudinary = require('./config/cloudinary');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Make io and cloudinary accessible to our router
app.use((req, res, next) => {
  req.io = io;
  req.cloudinary = cloudinary;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.IO
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('reportUpdated', (updatedReport) => {
    socket.broadcast.emit('updateReport', updatedReport);
  });

  socket.on('reportDeleted', (deletedReportId) => {
    socket.broadcast.emit('deleteReport', deletedReportId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Test Cloudinary connection
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('Cloudinary connection failed:', error);
  } else {
    console.log('Cloudinary connection successful:', result);
  }
});