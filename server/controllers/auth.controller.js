const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { cloudinary } = require('../config/cloudinary.config');

const fetch = (...args) => import('node-fetch').then(({ default: fn }) => fn(...args));

exports.register = async (req, res) => {
    // We create this to hold the path of the temp file
    const tempFilePath = req.file ? req.file.path : null;

    try {
        const { username, password, fullName, email, phoneNumber, expertiseArea, workplace, yearsOfExperience, bio, expertCode } = req.body;

        // --- Helper function to generate token and send response ---
        const loginUserAndRespond = (user, message) => {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(201).json({ 
                message: message,
                token, 
                // We will fetch the full profile on the frontend, so just send basic info here
                user: { id: user._id, username: user.username, role: user.role, fullName: user.fullName }
            });
        };

        // Check for duplicate username first, as it applies to both roles
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'A user with that username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // --- Expert Registration Logic ---
        if (isExpertRegistration(expertCode, req.file)) { // Use a helper to check if it's an expert
            if (expertCode !== process.env.EXPERT_SIGNUP_CODE) {
                return res.status(400).json({ message: 'Invalid expert registration code.' });
            }
            if (!req.file || !email || !workplace || !expertiseArea) {
                 return res.status(400).json({ message: 'Proof of ID, email, workplace, and expertise are required.' });
            }
             // Check for duplicate email for experts
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'An account with this email already exists.' });
            }

            const uploadResponse = await cloudinary.uploader.upload(tempFilePath, { folder: "hillherbs_id_proofs" });
            
            const newExpert = new User({
                username, password: hashedPassword, fullName, email, phoneNumber,
                expertiseArea, workplace, yearsOfExperience, bio,
                idProofURL: uploadResponse.secure_url,
                idProofPublicId: uploadResponse.public_id,
                role: 'expert'
            });

            await newExpert.save();
            return loginUserAndRespond(newExpert, 'Expert registration successful!');
        }
        
        // --- Hilly User Registration Logic ---
        else {
            const newUser = new User({ username, password: hashedPassword, fullName, role: 'hilly_user' });
            await newUser.save();
            return loginUserAndRespond(newUser, 'User registered successfully!');
        }

    } catch (error) {
        console.error("--- REGISTRATION ERROR ---");
        console.error(error);
        console.error("--------------------------");
        res.status(500).json({ message: 'An error occurred during registration.' });
    } finally {
        // IMPORTANT: Always delete the temporary file if it exists
        if (tempFilePath) {
            const fs = require('fs');
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        }
    }
};

// Helper function to determine registration type
const isExpertRegistration = (code, file) => {
    // It's an expert registration if either a code is provided OR a file is uploaded.
    // This makes the logic more robust.
    return !!code || !!file; 
};


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        console.log(`--- LOGIN ATTEMPT for user: ${username} ---`);

        // 1. Find the user in the database
        const user = await User.findOne({ username });

        if (!user) {
            console.log("Login Failure Reason: User not found in database.");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("User found. Comparing passwords...");

        // 2. Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("Login Failure Reason: Passwords do not match.");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("Passwords match! Login successful.");

        // 3. If everything is correct, create and send the token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.status(200).json({ 
            token, 
            user: { id: user._id, username: user.username, role: user.role, fullName: user.fullName }
        });

    } catch (error) {
        console.error("--- LOGIN CONTROLLER ERROR ---");
        console.error(error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
};
exports.getMe = async (req, res) => {
    try {
        // req.user.id is attached by our authMiddleware
        const user = await User.findById(req.user.id).select('-password'); // .select('-password') excludes the password hash
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile.', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from our auth middleware

        // We only allow these specific fields to be updated for security
        const { fullName, email, phoneNumber, expertiseArea, workplace, yearsOfExperience, bio } = req.body;

        const updatedData = {
            fullName,
            email,
            phoneNumber,
            expertiseArea,
            workplace,
            yearsOfExperience,
            bio
        };

        // Find the user and update their data. { new: true } returns the updated document.
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true })
            .select('-password'); // Exclude the password from the response

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        // Handle potential duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'This email is already in use by another account.' });
        }
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: 'Error updating user profile.' });
    }
};

exports.getIdProof = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('idProofURL username');

        if (!user || !user.idProofURL) {
            return res.status(404).json({ message: 'No ID proof on record.' });
        }

        const proofUrl = user.idProofURL;

        // Remote storage (Cloudinary, etc.)
        if (/^https?:\/\//i.test(proofUrl)) {
            const response = await fetch(proofUrl);

            if (!response.ok) {
                const errorBody = await response.text().catch(() => '');
                console.error('Remote ID proof fetch failed', {
                    status: response.status,
                    statusText: response.statusText,
                    bodyPreview: errorBody?.slice(0, 200)
                });
                return res.status(response.status).json({
                    message: `Unable to retrieve stored ID proof. Upstream responded with ${response.status} ${response.statusText || ''}`.trim()
                });
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const contentType = response.headers.get('content-type') || 'application/octet-stream';
            const urlPath = new URL(proofUrl).pathname;
            const fileName = path.basename(urlPath) || `ID_Proof_${user.username}`;

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
            return res.send(buffer);
        }

        // Base64 data URI fallback
        if (/^data:/i.test(proofUrl)) {
            const [metadata, base64Data] = proofUrl.split(',');
            if (!base64Data) {
                return res.status(400).json({ message: 'Stored ID proof is malformed.' });
            }

            const mimeMatch = metadata.match(/^data:([^;]+);/i);
            const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
            const buffer = Buffer.from(base64Data, 'base64');

            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `inline; filename="ID_Proof_${user.username}"`);
            return res.send(buffer);
        }

        // Local filesystem storage
        const uploadsDir = path.resolve(__dirname, '..', 'uploads');
        const normalisedRelativePath = proofUrl
            .replace(/^[\\/]+/, '')
            .replace(/\.\.(?:\\|\/)/g, '')
            .replace(/\\/g, '/');
        const filePath = path.resolve(uploadsDir, normalisedRelativePath);

        if (!filePath.startsWith(uploadsDir) || !fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Stored ID proof not found on server.' });
        }

        res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
        return res.sendFile(filePath);
    } catch (error) {
        console.error('Get ID Proof Error:', error);
        return res.status(500).json({ message: 'Failed to load ID proof.' });
    }
};