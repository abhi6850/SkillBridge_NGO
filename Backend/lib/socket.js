// socket.js (CommonJS)
const { Server } = require("socket.io");

let io;
const userSocketMap = {}; // {userId: socketId}

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

function parseOrigins(input) {
  if (!input) return ["http://localhost:3000", "http://localhost:3001"];
  if (Array.isArray(input)) return input;
  return String(input)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function initSocket(server, corsOrigins) {
  const origins = parseOrigins(corsOrigins || process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN);

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => callback(null, true),
      credentials: false,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "x-auth-token"],
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
}

module.exports = { initSocket, getReceiverSocketId, get io() { return io; } };
