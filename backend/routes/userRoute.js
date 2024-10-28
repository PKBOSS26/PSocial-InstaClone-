import express  from 'express'
import { editProfile, followUnfollow, getProfile, getSuggestedUser, login, logOut, signup } from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logOut);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile); //multer err unexpected field
router.route('/suggested').get(isAuthenticated, getSuggestedUser);
router.route('/followOrUnfollow/:id').post(isAuthenticated, followUnfollow);

export default router;
