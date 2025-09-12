const fs = require('fs');
const PlantSubmission = require('../models/plantSubmission.model');
const { getAiPlantName } = require('../services/gemini.service');
const { isMedicinal } = require('../utils/medicinalPlants');
const { cloudinary } = require('../config/cloudinary.config');

exports.submitPlant = async (req, res) => {
    const tempImagePath = req.file ? req.file.path : null;

    try {
        const { latitude, longitude } = req.body;
        if (!tempImagePath || !latitude || !longitude) {
            return res.status(400).json({ message: "Image and location are both required." });
        }

        // 1. Get AI identification from the temporarily stored image
        const aiName = await getAiPlantName(tempImagePath, req.file.mimetype);

        // 2. Check if the plant is on our medicinal list
        if (aiName && isMedicinal(aiName)) {
            // 3. If yes, upload the image to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(tempImagePath, {
                folder: "hillherbs_submissions",
            });

            // 4. Save submission to the database
            const newSubmission = new PlantSubmission({
                submittedBy: req.user.id,
                imageURL: uploadResponse.secure_url,
                imagePublicId: uploadResponse.public_id,
                location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                aiSuggestedName: aiName,
            });
            await newSubmission.save();
            const successMessage = `Successfully submitted! The AI has identified the plant as '${aiName}'. It is now pending verification by one of our experts.`;

            res.status(201).json({ 
                message: successMessage, // Send the new detailed message
                submission: {
                    // Send back some key details for the frontend to display
                    aiSuggestedName: newSubmission.aiSuggestedName,
                    imageURL: newSubmission.imageURL,
                    status: newSubmission.status
                }
            });

        } else {
            // 5. If not medicinal, reject the submission
            const plantName = aiName || "Unknown";
            res.status(400).json({ message: `Plant identified as '${plantName}'. It was not recognized as a medicinal plant and was not submitted.` });
        }
    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ message: "An error occurred during submission." });
    } finally {
        // 6. ALWAYS clean up the temporary file from the 'uploads/' folder
        if (tempImagePath) {
            fs.unlinkSync(tempImagePath);
        }
    }
};

// --- NEW FUNCTION 1: Get all pending submissions ---
exports.getPendingSubmissions = async (req, res) => {
    try {
        const submissions = await PlantSubmission.find({ status: 'pending_expert_verification' })
            .populate('submittedBy', 'username fullName') // Get submitter's name
            .sort({ createdAt: -1 }); // Show newest first
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending submissions.', error: error.message });
    }
};
// --- NEW FUNCTION 2: Verify a single submission ---
exports.verifySubmission = async (req, res) => {
    try {
        const { id } = req.params; // The ID of the submission to verify
        const { action, correctedName } = req.body; // 'approve', 'reject', or 'correct'
        const expertId = req.user.id; // From the auth middleware

        const submission = await PlantSubmission.findById(id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found.' });
        }

        switch (action) {
            case 'approve':
                submission.status = 'verified';
                submission.finalPlantName = submission.aiSuggestedName;
                break;
            case 'reject':
                submission.status = 'rejected';
                submission.expertNotes = 'Rejected by expert.'; // Can be expanded later
                break;
            case 'correct':
                if (!correctedName) {
                    return res.status(400).json({ message: 'Corrected name is required for this action.' });
                }
                submission.status = 'verified';
                submission.finalPlantName = correctedName;
                break;
            default:
                return res.status(400).json({ message: 'Invalid action.' });
        }

        submission.verifiedBy = expertId;
        await submission.save();

        res.status(200).json({ message: `Submission successfully ${submission.status}.`, submission });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying submission.', error: error.message });
    }
};