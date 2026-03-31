import { useEffect } from "react";
import { io } from "socket.io-client";

export const useSocket = ({ userId, onProgress }) => {
  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4000");
    socket.emit("register-user", userId);
    socket.on("video-progress", onProgress);

    return () => {
      socket.off("video-progress", onProgress);
      socket.disconnect();
    };
  }, [onProgress, userId]);
};
