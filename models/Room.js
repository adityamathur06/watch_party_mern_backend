const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    // THE FIX: Make the link optional with a default empty string
    link: { 
        type: String, 
        default: "" 
    },
    host: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Room', roomSchema);