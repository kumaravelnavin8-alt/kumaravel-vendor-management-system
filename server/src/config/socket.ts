import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*', // In production, replace with specific origins
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected to socket:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('User disconnected from socket');
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const notifyDataChange = (module: string) => {
  if (io) {
    console.log(`Broadcasting data change in module: ${module}`);
    io.emit('dataChange', { module, timestamp: new Date() });
  }
};
