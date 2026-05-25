const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message : "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ success: true, message : "User created successfully"});
    } catch (e) {
        res.status(500).json({message : `Server error : ${e}`});
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email}).populate('friends', 'name email');

        if(!user) {
            return res.status(400).json({message : 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({message : 'Invalid email or password'});
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(200).json({
            success: true, 
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                friends: user.friends,
                createdAt: user.createdAt
            }
        })
    } catch (e) {
        res.status(500).json({message : `Server error : ${e}`});
    }
};

exports.getUser = async (req, res) => {
    try {
        const userId = req.user.userId || req.user._id || req.user.id || req.user; 
        
        const user = await User.findById(userId)
            .populate('friends', 'name email')
            .select('-password');
            
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (e) {
        res.status(500).json({ success: false, message : `Server error : ${e}`});
    }
};