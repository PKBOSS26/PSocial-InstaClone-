import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Message Routes
router.route('/send/:id').post(isAuthenticated, sendMessage); // Create a new message
router.route('/all/:id').get(isAuthenticated, getMessages); // Get all messages

export default router