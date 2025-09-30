import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();



const auth = async (req, res, next) => {
    try {
        let token = null;
        // Prefer Authorization header
        if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.accessToken) { // Fix: match cookie name set by backend
            token = req.cookies.accessToken;
        }
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        const user = await UserModel.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = { id: user._id };
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

export default auth;
