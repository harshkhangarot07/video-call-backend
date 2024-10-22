const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// CORS for Express
app.use(cors({
  origin: "https://video-calling-xpp.vercel.app", // Replace with your Vercel frontend URL
  methods: ["GET", "POST"],
  credentials: true
}));

app.get("/", (req , res)=>{
 res.send("hello world")
})

const server = http.createServer(app);

// CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: "https://video-calling-xpp.vercel.app", // Same as your Express CORS
    methods: ["GET", "POST"],
    credentials: true // Ensure credentials are allowed if needed
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
