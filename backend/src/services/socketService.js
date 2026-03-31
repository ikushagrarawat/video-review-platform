const userSockets = new Map();

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("register-user", (userId) => {
      if (!userId) {
        return;
      }

      userSockets.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
        }
      }
    });
  });
};

export const emitVideoProgress = (io, userId, payload) => {
  const socketId = userSockets.get(String(userId));

  if (socketId) {
    io.to(socketId).emit("video-progress", payload);
  }
};
