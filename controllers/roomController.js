const Room = require('../models/Room');
const Chat = require('../models/Chat');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { roomInviteTemplate } = require('../templates/emailTemplates');

exports.createRoom = async (req, res) => {
    try {
        const { roomId, link } = req.body;
        
        const newRoom = new Room({
            roomId,
            link,
            host: req.user._id,
            members: []
        });

        await newRoom.save();
        
        const populatedRoom = await Room.findById(newRoom._id).populate('host', 'name');
        
        res.status(201).json({ success: true, room: populatedRoom });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate('host', 'name').populate('members', 'name');
        
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }
        
        res.status(200).json({ success: true, room });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.joinRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        
        const room = await Room.findOne({ roomId }).populate('host', 'name').populate('members', 'name');
        
        if (!room) {
            return res.status(404).json({ success: false, message: 'This room does not exist.' });
        }

        const isHost = String(room.host._id) === String(req.user._id);
        const isAlreadyMember = room.members.some(member => String(member._id) === String(req.user._id));

        if (!isHost && !isAlreadyMember) {
            room.members.push(req.user._id);
            await room.save();
        }

        const updatedRoom = await Room.findOne({ roomId }).populate('host', 'name').populate('members', 'name');

        res.status(200).json({ success: true, room: updatedRoom });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.leaveRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        
        const room = await Room.findOne({ roomId });
        
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found.' });
        }

        if (String(room.host) === String(req.user._id)) {
            await Chat.deleteMany({ room: room._id });
            
            await Room.deleteOne({ _id: room._id });
            
            return res.status(200).json({ success: true, message: 'Room and chats deleted by host.' });
        } else {
            room.members = room.members.filter(memberId => String(memberId) !== String(req.user._id));
            await room.save();
            return res.status(200).json({ success: true, message: 'Left room successfully.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.inviteFriends = async (req, res) => {
    try {
        const { roomId, offlineFriendIds, onlineFriendIds } = req.body;
        
        const host = await User.findById(req.user.id);
        const joinLink = `${process.env.FRONTEND_URL}/dashboard?invite=${roomId}`;

        if (offlineFriendIds && offlineFriendIds.length > 0) {
            const offlineFriends = await User.find({ _id: { $in: offlineFriendIds } });

            await Promise.all(offlineFriends.map(async (friend) => {
                const htmlContent = roomInviteTemplate(host.name, roomId, joinLink);
                
                await sendEmail({
                    email: friend.email,
                    subject: `${host.name} invited you to a Watch Party! 🍿`,
                    html: htmlContent
                });
            }));
        }

        res.status(200).json({ success: true, message: 'Invites routed successfully!' });
    } catch (error) {
        console.error("Invite Routing Error:", error);
        res.status(500).json({ success: false, message: 'Failed to route invites.' });
    }
};