const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['hilly_user', 'expert'], default: 'hilly_user' },
    fullName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);