import { io, Socket } from "socket.io-client";
import { API_URL, getToken } from "@/lib/api";

let socket: Socket | null = null;

// Lazily creates a single shared socket connection, authenticated with the
// current JWT. Call disconnectSocket() on logout so a stale token isn't reused.
export const getSocket = (): Socket => {
  if (socket && socket.connected) return socket;

  socket = io(API_URL, {
    auth: { token: getToken() },
    autoConnect: true,
    transports: ["websocket", "polling"],
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
