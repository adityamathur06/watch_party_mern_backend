const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/sendEmail');
const { otpTemplate } = require('../templates/otpTemplate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.findOneAndUpdate(
            { email }, 
            { otp: otpCode, createdAt: Date.now() }, 
            { upsert: true, new: true }
        );

        await sendEmail({
            email: email,
            subject: 'Watch Party - Your Verification Code',
            html: otpTemplate(otpCode)
        });

        res.status(200).json({ success: true, message: 'Verification code sent!' });
    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ success: false, message: 'Failed to send verification code' });
    }
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;

        if (!name || !email || !password || !otp) {
            return res.status(400).json({ message: "All fields including OTP are required" });
        }

        // 1. Verify the OTP
        const validOtpRecord = await OTP.findOne({ email, otp });
        if (!validOtpRecord) {
            return res.status(400).json({ message: "Invalid or expired verification code" });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // 2. Clear the OTP from the database
        await OTP.deleteOne({ email });

        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (e) {
        res.status(500).json({ message: `Server error : ${e}` });
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