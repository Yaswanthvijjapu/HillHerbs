const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['hilly_user', 'expert'], default: 'hilly_user' },
    
    fullName: { type: String, required: true, trim: true },
    email: { type: String, unique: true, trim: true, sparse: true }, // Sparse allows null values to not violate unique index
    phoneNumber: { type: String, trim: true },
    expertiseArea: { type: String, trim: true }, // e.g., "Ayurveda", "Botany"
    workplace: { type: String, trim: true },
    yearsOfExperience: { type: Number },
    bio: { type: String, trim: true },
    idProofURL: { type: String }, // URL of the uploaded ID proof
    idProofPublicId: { type: String }, // For deleting from Cloudinary if needed
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);