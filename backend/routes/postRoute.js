import express from 'express';
import { addNewPost, getAllPosts, getPostById, likePost, dislikePost, deletePost, addComment, getCommentsOfPost, deleteComment, bookmarkPost } from '../controllers/postController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// Post Routes
router.route('/').post(isAuthenticated, upload.single('image'), addNewPost); // Create a new post
router.route('/').get(getAllPosts); // Get all posts
router.route('/:id').get(getPostById); // Get a post by ID
router.route('/:id/like').post(isAuthenticated, likePost); // Like a post
router.route('/:id/dislike').post(isAuthenticated, dislikePost); // Dislike a post
router.route('/:id/bookmark').post(isAuthenticated, bookmarkPost); // Bookmark a post
router.route('/:id').delete(isAuthenticated, deletePost); // Delete a post

// Comment Routes
router.route('/:id/comments').post(isAuthenticated, addComment); // Add a comment to a post
router.route('/:id/comments').get(getCommentsOfPost); // Get all comments of a post
router.route('/comments/:commentId').delete(isAuthenticated, deleteComment); // Delete a comment

export default router;
