import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../config/jwt';
import { SocketUser } from '../types';

const onlineUsers = new Map<number, string[]>(); // userId -> socketIds[]

export const initializeSocket = (io: Server) => {
  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyAccessToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    console.log(`User connected: ${user.email} (${socket.id})`);

    // Track online user
    if (!onlineUsers.has(user.id)) {
      onlineUsers.set(user.id, []);
    }
    onlineUsers.get(user.id)!.push(socket.id);

    // Join user-specific room for notifications
    socket.join(`user:${user.id}`);

    // Broadcast online user count
    io.emit('users:online', onlineUsers.size);

    // Join project room
    socket.on('join:project', (projectId: number) => {
      socket.join(`project:${projectId}`);
      console.log(`User ${user.email} joined project:${projectId}`);
    });

    // Leave project room
    socket.on('leave:project', (projectId: number) => {
      socket.leave(`project:${projectId}`);
      console.log(`User ${user.email} left project:${projectId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.email} (${socket.id})`);

      // Remove socket from online users
      const userSockets = onlineUsers.get(user.id);
      if (userSockets) {
        const index = userSockets.indexOf(socket.id);
        if (index > -1) {
          userSockets.splice(index, 1);
        }
        if (userSockets.length === 0) {
          onlineUsers.delete(user.id);
        }
      }

      // Broadcast updated online count
      io.emit('users:online', onlineUsers.size);
    });
  });

  console.log('✅ Socket.io initialized');
};

export const getOnlineUsersCount = () => onlineUsers.size;
