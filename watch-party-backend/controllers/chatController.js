const Chat = require('../models/Chat');
const Room = require('../models/Room');

exports.sendMessage = async (req, res) => {
    try {
        const { roomId, message } = req.body;
        
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const newChat = new Chat({
            room: room._id,
            sender: req.user._id,
            message
        });

        await newChat.save();

        const populatedChat = await Chat.findById(newChat._id).populate('sender', 'name');

        res.status(201).json({ success: true, chat: populatedChat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const chats = await Chat.find({ room: room._id }).populate('sender', 'name').sort({ createdAt: 1 });

        res.status(200).json({ success: true, chats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};