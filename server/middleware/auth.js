import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();


const auth = async (req, res, next) => {
    try {
         const token = req.cookies.accesstoken || req?.headers?.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
       


        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
       
        const user = await UserModel.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.userId = user._id;
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
