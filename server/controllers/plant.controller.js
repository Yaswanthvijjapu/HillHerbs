const PlantSubmission = require('../models/plantSubmission.model');
const { getAiPlantName } = require('../services/gemini.service');
const { isMedicinal } = require('../utils/medicinalPlants');
const { cloudinary } = require('../config/cloudinary.config');

// --- Helper: Upload Buffer to Cloudinary ---
// We need this because the file is in RAM (buffer), not on disk
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder: folder, 
                resource_type: "auto" 
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

exports.submitPlant = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        
        // CHANGE: We check req.file, but NOT req.file.path
        if (!req.file || !latitude || !longitude) {
            return res.status(400).json({ message: "Image and location are both required." });
        }

        // 1. Get AI identification from the BUFFER (RAM)
        // Make sure your gemini.service.js is also updated to accept buffers!
        const aiName = await getAiPlantName(req.file.buffer, req.file.mimetype);

        // 2. Check if the plant is on our medicinal list
        if (aiName && isMedicinal(aiName)) {
            // 3. Upload buffer to Cloudinary using the helper
            const uploadResponse = await uploadToCloudinary(req.file.buffer, "hillherbs_submissions");

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
                message: successMessage, 
                submission: {
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
        // This log will appear in Vercel logs to help debug if it fails again
        res.status(500).json({ message: "An error occurred during submission." });
    }
    // REMOVED: fs.unlinkSync - No file to delete because we used memory storage!
};

// --- Get all pending submissions ---
exports.getPendingSubmissions = async (req, res) => {
    try {
        const submissions = await PlantSubmission.find({ status: 'pending_expert_verification' })
            .populate('submittedBy', 'username fullName') 
            .sort({ createdAt: -1 }); 
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending submissions.', error: error.message });
    }
};

// --- Verify a single submission ---
exports.verifySubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, correctedName, verificationMethod, rejectionReason, expertNotes, medicinalUses, importance } = req.body;
        const expertId = req.user.id;

        const submission = await PlantSubmission.findById(id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found.' });
        }

        const updateData = {
            verifiedBy: expertId,
            expertNotes: expertNotes || '',
        };

        if (action === 'approve' || action === 'correct') {
            if (!verificationMethod || !medicinalUses) {
                return res.status(400).json({ message: 'Verification method and medicinal uses are required.' });
            }
            updateData.status = 'verified';
            updateData.verificationMethod = verificationMethod;
            updateData.medicinalUses = medicinalUses;
            updateData.importance = importance || '';

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
            updateData.finalPlantName = ''; 
            updateData.verificationMethod = '';
            updateData.medicinalUses = '';
            updateData.importance = '';
        } else {
            return res.status(400).json({ message: 'Invalid action.' });
        }
        
        Object.assign(submission, updateData);
        const updatedSubmission = await submission.save();

        res.status(200).json({ message: `Submission successfully updated.`, submission: updatedSubmission });
    } catch (error) {
        console.error("--- VERIFICATION SUBMISSION ERROR ---");
        console.error(error);
        res.status(500).json({ message: 'Error verifying submission.', error: error.message });
    }
};

exports.getExpertHistory = async (req, res) => {
    try {
        const expertId = req.user.id; 

        const history = await PlantSubmission.find({ 
            verifiedBy: expertId, 
            status: { $in: ['verified', 'rejected'] } 
        })
        .populate('submittedBy', 'username')
        .sort({ updatedAt: -1 })
        .limit(20); 

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
        console.error("--- ERROR FETCHING VERIFIED PLANTS ---");
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error: Could not fetch verified plants.' });
    }
};