const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        // Destructure the new expertCode field from the request body
        const { username, password, fullName, expertCode } = req.body;
        
        let userRole = 'hilly_user'; // Default role

        // --- NEW LOGIC ---
        // If an expert code is provided, check if it's valid
        if (expertCode) {
            if (expertCode === process.env.EXPERT_SIGNUP_CODE) {
                userRole = 'expert'; // If code is correct, assign expert role
            } else {
                // If code is provided but INCORRECT, reject the registration
                return res.status(400).json({ message: 'Invalid expert registration code.' });
            }
        }
        // --- END OF NEW LOGIC ---

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        // Use the determined userRole when creating the new user
        const newUser = new User({ username, password: hashedPassword, fullName, role: userRole });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};