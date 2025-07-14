import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { checkAuth, login, signup, updateProfile } from '../controllers/userController.js';

const userRouter = express.Router();
userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.get('/check',protectRoute, checkAuth);
userRouter.put('/update-profile',protectRoute, updateProfile);

export default userRouter;