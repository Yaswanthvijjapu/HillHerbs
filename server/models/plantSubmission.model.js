const mongoose = require('mongoose');

const plantSubmissionSchema = new mongoose.Schema({
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageURL: { type: String, required: true },
    imagePublicId: { type: String, required: true }, // For deleting from Cloudinary if needed
    location: {
        type: { type: String, enum: ['Point'], default: 'Point', required: true },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    aiSuggestedName: { type: String, required: true },
    status: { type: String, enum: ['pending_expert_verification', 'verified', 'rejected'], default: 'pending_expert_verification' }
}, { timestamps: true });

plantSubmissionSchema.index({ location: '2dsphere' }); // For geospatial queries

module.exports = mongoose.model('PlantSubmission', plantSubmissionSchema);