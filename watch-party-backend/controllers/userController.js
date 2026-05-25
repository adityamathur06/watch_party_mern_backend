const User = require('../models/User');

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(200).json({ success: true, users: [] });

        const users = await User.find({
            $and: [
                { _id: { $ne: req.user.id } },
                { $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]}
            ]
        }).select('name email');

        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const user = await User.findById(req.user.id);

        if (user.friends.includes(friendId)) {
            return res.status(400).json({ success: false, message: 'User is already your friend' });
        }

        user.friends.push(friendId);
        await user.save();

        const updatedUser = await User.findById(req.user.id)
            .populate('friends', 'name email')
            .select('-password');

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const user = await User.findById(req.user.id);

        user.friends = user.friends.filter(id => String(id) !== String(friendId));
        await user.save();

        const updatedUser = await User.findById(req.user.id)
            .populate('friends', 'name email')
            .select('-password');

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};