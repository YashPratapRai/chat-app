import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import chatRouter from './routes/chatRoutes.js'; // ✅ Important: ensure this exists
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "*", // Adjust if needed
    methods: ["GET", "POST", "PUT"]
  }
});

// ✅ Store online users
export const userSocketMap = {};

// ✅ Handle socket connections
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`✅ User connected: ${userId}`);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${userId}`);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '4mb' }));

// ✅ Routes
app.use("/api/status", (req, res) => {
  res.send('✅ Server is live');
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/chat", chatRouter); // ✅ Fixed: Register chat route

// ✅ Connect to MongoDB
await connectDB();

// ✅ Start Server
if(process.env.NODE_ENV!=="production"){
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
}

// expoting server for vercel
export default server;
