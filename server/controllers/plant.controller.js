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
        const { id } = req.params;
        const { action, correctedName, verificationMethod, rejectionReason, expertNotes, medicinalUses, importance } = req.body;
        const expertId = req.user.id;

        const submission = await PlantSubmission.findById(id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found.' });
        }

        // --- Prepare the update object ---
        const updateData = {
            verifiedBy: expertId,
            expertNotes: expertNotes || '', // Ensure it's not undefined
        };

        if (action === 'approve' || action === 'correct') {
            if (!verificationMethod || !medicinalUses) {
                return res.status(400).json({ message: 'Verification method and medicinal uses are required.' });
            }
            updateData.status = 'verified';
            updateData.verificationMethod = verificationMethod;
            updateData.medicinalUses = medicinalUses;
            updateData.importance = importance || ''; // Ensure it's not undefined

            if (action === 'correct') {
                if (!correctedName) {
                    return res.status(400).json({ message: 'Corrected name is required.' });
                }
                updateData.finalPlantName = correctedName;
            } else {
                updateData.finalPlantName = submission.aiSuggestedName;
            }
        } else if (action === 'reject') {
            if (!rejectionReason) {
                return res.status(400).json({ message: 'A rejection reason is required.' });
            }
            updateData.status = 'rejected';
            updateData.rejectionReason = rejectionReason;
            // Clear fields that don't apply to rejected items
            updateData.finalPlantName = ''; 
            updateData.verificationMethod = '';
            updateData.medicinalUses = '';
            updateData.importance = '';
        } else {
            return res.status(400).json({ message: 'Invalid action.' });
        }
        
        // --- Apply the update and save ---
        Object.assign(submission, updateData);
        const updatedSubmission = await submission.save();

        res.status(200).json({ message: `Submission successfully updated.`, submission: updatedSubmission });
    } catch (error) {
        console.error("--- VERIFICATION SUBMISSION ERROR ---");
        console.error(error);
        console.error("-------------------------------------");
        res.status(500).json({ message: 'Error verifying submission.', error: error.message });
    }
};

exports.getExpertHistory = async (req, res) => {
    try {
        const expertId = req.user.id; // From auth middleware

        const history = await PlantSubmission.find({ 
            verifiedBy: expertId, // Only find submissions verified by this expert
            status: { $in: ['verified', 'rejected'] } // Only get 'verified' or 'rejected'
        })
        .populate('submittedBy', 'username')
        .sort({ updatedAt: -1 }) // Sort by when it was last updated (i.e., verified)
        .limit(20); // Limit to the last 20 for performance

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expert history.', error: error.message });
    }
};

exports.getVerifiedPlants = async (req, res) => {
    try {
        const verifiedPlants = await PlantSubmission.find({ status: 'verified' })
            .select('finalPlantName imageURL location medicinalUses importance')
            .sort({ finalPlantName: 1 });
            
        res.status(200).json(verifiedPlants);
    } catch (error) {
        // This will log the DETAILED error to your backend console
        console.error("--- ERROR FETCHING VERIFIED PLANTS ---");
        console.error(error);
        console.error("--------------------------------------");
        
        // This sends the generic 500 error back to the frontend
        res.status(500).json({ message: 'Internal Server Error: Could not fetch verified plants.' });
    }
};