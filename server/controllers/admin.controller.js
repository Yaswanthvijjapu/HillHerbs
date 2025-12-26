const User = require('../models/user.model');

exports.getPendingExperts = async (req, res) => {
    try {
        // Fetch all users with role 'expert_pending'
        const pendingExperts = await User.find({ role: 'expert_pending' }).select('-password');
        res.status(200).json(pendingExperts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending experts.' });
    }
};
exports.getAllExpertsData = async (req, res) => {
    try {
        // Fetch all users who have any expert-related role
        const experts = await User.find({ 
            role: { $in: ['expert', 'expert_pending', 'expert_rejected'] } 
        }).select('-password').sort({ createdAt: -1 });

        // Group them for easier frontend handling
        const data = {
            pending: experts.filter(u => u.role === 'expert_pending'),
            verified: experts.filter(u => u.role === 'expert'),
            rejected: experts.filter(u => u.role === 'expert_rejected'),
        };

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expert data.' });
    }
};


exports.verifyExpert = async (req, res) => {
    try {
        const { userId, action } = req.body; // action: 'approve' or 'reject'
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (action === 'approve') {
            user.role = 'expert';
            await user.save();
            res.status(200).json({ message: `Expert ${user.username} approved successfully.` });
        } else if (action === 'reject') {
            // Option A: Downgrade to normal user
            user.role = 'expert_rejected';
            await user.save();
            // Option B: Delete the user entirely (uncomment below if preferred)
            // await User.findByIdAndDelete(userId);
            // return res.status(200).json({ message: 'Expert request rejected and account deleted.' });

            res.status(200).json({ message: `Expert request rejected.` });
        } else {
            res.status(400).json({ message: 'Invalid action.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating expert status.' });
    }
};