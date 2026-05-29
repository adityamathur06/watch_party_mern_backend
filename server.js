const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
    }
});

app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI, { family: 4 })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

const userSockets = new Map();

io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    socket.on('register_user', (userId) => {
        socket.userId = userId;

        if (!userSockets.has(userId)) {
            userSockets.set(userId, new Set());
        }
        userSockets.get(userId).add(socket.id);
        io.emit('online_users', Array.from(userSockets.keys()));
    });

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
    });

    socket.on('send_message', (data) => {
        socket.to(data.roomId).emit('receive_message', data.message);
    });

    socket.on('user_joined', (data) => {
        socket.to(data.roomId).emit('user_joined', data.user);
    });

    socket.on('user_left', (data) => {
        socket.to(data.roomId).emit('user_left', data.userId);
    });

    socket.on('room_ended', (roomId) => {
        socket.to(roomId).emit('room_ended');
    });

    socket.on('video_change', async (data) => {
        socket.to(data.roomId).emit('video_change', data.link);

        try {
            const Room = mongoose.model('Room');
            await Room.updateOne(
                { roomId: data.roomId },
                { $set: { link: data.link } }
            );
        } catch (err) { 
            console.error("Failed to save link to DB:", err); 
        }
    });

    socket.on('disconnect', () => {
        if (socket.userId && userSockets.has(socket.userId)) {
            const sockets = userSockets.get(socket.userId);
            sockets.delete(socket.id);
            if (sockets.size === 0) {
                userSockets.delete(socket.userId);
            }
            io.emit('online_users', Array.from(userSockets.keys()));
        }
        console.log(`Socket Disconnected: ${socket.id}`);
    });

    socket.on('send_room_invite', (data) => {
        const { receiverId, roomId, hostName } = data;
        if (userSockets.has(receiverId)) {
            userSockets.get(receiverId).forEach(socketId => {
                io.to(socketId).emit('receive_room_invite', { roomId, hostName });
            });
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});