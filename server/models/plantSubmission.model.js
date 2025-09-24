// server/models/plantSubmission.model.js
const mongoose = require('mongoose');

const plantSubmissionSchema = new mongoose.Schema({
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageURL: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point', required: true },
        coordinates: { type: [Number], required: true }
    },
    aiSuggestedName: { type: String, required: true },
    status: { type: String, enum: ['pending_expert_verification', 'verified', 'rejected'], default: 'pending_expert_verification' },
    
    // --- Fields added by Expert ---
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    finalPlantName: { type: String, trim: true },
    expertNotes: { type: String, trim: true },
    
    // --- ENSURE THESE FIELDS ARE DEFINED ---
    rejectionReason: { type: String, trim: true },
    verificationMethod: { type: String, trim: true },
    medicinalUses: { type: String, trim: true },
    importance: { type: String, trim: true },

}, { timestamps: true });

plantSubmissionSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('PlantSubmission', plantSubmissionSchema);