# Instagram Clone Project Timeline

## Project Overview
This project is an Instagram clone that allows users to share photos, follow others, interact through comments and likes, and chat with other users.

---

## Timeline

### Till Date: 16-10-2024

1. **Models Created:**
   - **User Model** – Handles user information and authentication.
   - **Post Model** – Stores posts shared by users.
   - **Comment Model** – Manages comments on posts.
   - **Conversation Model** – Tracks chat conversations between users.
   - **Message Model** – Stores individual chat messages.

2. **Controllers Developed:**
   - **User Controller:**  
     - **Signup** – Register a new user.  
     - **Login** – Authenticate and log in a user.  
     - **Logout** – Handle user logout.  
     - **Get Profile** – Retrieve user profile details.  
     - **Edit Profile** – Update user profile information.  
     - **Follow/Unfollow User** – Manage following relationships.

3. **Authentication:**
   - User authentication implemented using **JWT** (JSON Web Token) and **bcrypt** for password hashing.
   - Middleware added for **route protection** to secure endpoints.

4. **Routes Established:**
   - **User Routes:**  
     - Authentication (Signup, Login, Logout).  
     - Profile management (Get Profile, Edit Profile).  

5. **Cloudinary Integration:**
   - **Cloudinary** used for image storage and management.

6. **Database Operations:**
   - **CRUD operations** implemented for user management.

---

This was the first day of coding for the project, and I successfully implemented the backend structure with models, controllers, routes, and authentication. More features will follow, including the chat system, posts, comments, and interactive elements like likes.

## Date: 17-10-2024

1. **Post Controllers Developed:**
   - **Post Controller:**
     - **Add New Post** – Allows users to create a new post with an image and caption.
     - **Get All Posts** – Retrieves all posts, including user details and comments.
     - **Get Post by ID** – Fetches a specific post by its ID, along with associated comments.
     - **Like Post** – Enables users to like a post.
     - **Dislike Post** – Allows users to remove their like from a post.
     - **Delete Post** – Deletes a specific post and removes it from the user's posts array.
     - **Add Comment** – Lets users add comments to a post.
     - **Get Comments of Post** – Retrieves all comments associated with a specific post.
     - **Delete Comment** – Removes a specific comment from a post.

2. **Routes Established:**
   - **Post Routes:**
     - Create, Read, Update, Delete (CRUD) operations for posts.
     - Endpoints for liking, disliking, and commenting on posts.

3. **Middleware Integration:**
   - **Authentication Middleware** – Secures routes to ensure only logged-in users can interact with posts and comments.

4. **Error Handling:**
   - Implemented error handling for various scenarios, including missing posts, comments, and authentication failures.

5. **Testing:**
   - Conducted initial testing of post creation, retrieval, liking, and commenting functionalities.

---

This was a productive day focused on developing the post-related functionalities of the Instagram clone. The backend structure is coming together nicely, and I plan to work on the chat system and interactive features next.

### Date: 18-10-2024

1. **Message Controller Developed:**
   - **Message Controller:**
     - **Send Message** – Enables users to send messages in chat.
     - **Get Messages** – Retrieves chat messages in a conversation.

2. **Routes Established:**
   - **Message Routes:**
     - Created a write message route to handle sending messages.

3. **Frontend Initialization:**
   - Initialized the frontend structure for the application.

---

### Date: 19-10-2024

1. **Authentication Pages Developed:**
   - Created **Signup** and **Login** pages for user authentication.

2. **Component Development:**
   - Developed various UI components including:
     - **MainLayout** – Base layout for the application.
     - **Home** – Main landing page for users.
     - **LeftSidebar** – Navigation for the app.
     - **Feed** – Displays a feed of posts.
     - **Posts** – Lists multiple posts.
     - **Post** – Represents individual posts.
     - **CommentDialog** – For adding comments to posts.
   - Set up routing and navigation between components.

3. **Dynamic Data Handling:**
   - Currently using hardcoded values for the frontend components; next step is to implement dynamic data fetching from the backend.

---

### Until Date: 24-10-2024

1. **State Management Setup:**
   - Integrated **Redux** for state management.
     - Created **store.js** and configured it for persistence.
     - Developed **authSlice.js** for authentication-related state.

2. **CreatePost Component Developed:**
   - Implemented **CreatePost.jsx** to handle post creation.
     - Allows users to upload images and add captions.
     - Features a preview of the uploaded image before submission.

3. **Utility Functions Created:**
   - Developed `readFileAsDataURL` in the utilities for handling file input.

4. **Post Slice Created:**
   - Implemented **postSlice.js** for managing post-related state.

5. **Custom Hooks Developed:**
   - Created **useGetAllPosts** for fetching all posts.

6. **Dynamic User Information:**
   - Made username, profile picture, and caption dynamic in posts and the CreatePost component.

7. **Optimized User Experience:**
   - Dispatched posts to the Redux store to avoid page refreshes when new posts are added.
   - Restricted post deletion to only the author of the post.
