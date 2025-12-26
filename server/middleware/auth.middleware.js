const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token required.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role }; // Attach user info to request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
const isExpert = (req, res, next) => {
    // This middleware should run AFTER authMiddleware
    if (req.user && req.user.role === 'expert') {
        next(); // User is an expert, proceed
    } else {
        res.status(403).json({ message: 'Forbidden: Access is restricted to verified experts only.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Access is restricted to administrators.' });
    }
};

module.exports = { authMiddleware, isExpert, isAdmin };