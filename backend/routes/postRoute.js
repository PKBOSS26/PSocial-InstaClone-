import express from 'express';
import { addNewPost, getAllPosts, getPostById, likePost, dislikePost, deletePost, addComment, getCommentsOfPost, deleteComment, bookmarkPost } from '../controllers/postController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// Post Routes
router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost); // Create a new post
router.route('/all').get(getAllPosts); // Get all posts
router.route('/userposts/:id').get(getPostById); // Get a post by ID
router.route('/:id/like').get(isAuthenticated, likePost); // Like a post
router.route('/:id/dislike').get(isAuthenticated, dislikePost); // Dislike a post
router.route('/:id/bookmark').get(isAuthenticated, bookmarkPost); // Bookmark a post
router.route('/delete/:id').delete(isAuthenticated, deletePost); // Delete a post

// Comment Routes
router.route('/:id/comment').post(isAuthenticated, addComment); // Add a comment to a post
router.route('/:id/comments/all').get(getCommentsOfPost); // Get all comments of a post
router.route('/comments/:commentId').delete(isAuthenticated, deleteComment); // Delete a comment

export default router;
