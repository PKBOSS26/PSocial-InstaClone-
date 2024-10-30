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

---

### Date: 26-10-2024

1. **Delete Post Functionality Implemented:**
   - Developed a robust mechanism to allow users to delete their own posts.
   - Ensured that only the post's author can initiate deletion, with confirmation prompts to prevent accidental removals.
   - Enhanced error handling to manage cases where the post may not exist or the user lacks permissions.

2. **Like/Dislike Functionality Added:**
   - Implemented the ability for users to like and dislike posts.
   - Utilized an intuitive button interface that reflects the current state of likes for each post.
   - Integrated real-time updates to ensure the like count reflects the latest interactions.

3. **Comment Functionality Enhanced:**
   - Improved the comment feature by allowing users to add their comments on posts.
   - Implemented a user-friendly interface for commenting, with dynamic updates that show new comments immediately after submission.
   - Ensured that comments are linked to the respective post, with appropriate notifications for any actions taken.

---

### Date: 28-10-2024

1. **Right Sidebar and Suggested Users Component:**
   - Developed the **RightSidebar** to display suggested users for the logged-in user to follow.
   - Implemented logic to dynamically fetch and show suggested users.

2. **Profile Component:**
   - Created the **Profile Component** to display detailed user information, including:
     - Username, profile picture, bio, and the number of posts, followers, and following.
     - Option to **follow/unfollow** users directly from their profile.

3. **Edit Profile Functionality:**
   - Developed the **Edit Profile Page** to allow users to update:
     - Profile picture, bio, username, and other personal details.
   - Added **real-time validation** for input fields and success/error notifications after updates.

4. **Custom Hooks Developed:**
   - **useGetSuggestedUsers.jsx** – Fetches a list of users to be suggested for following.
   - **useGetUserProfile.jsx** – Retrieves the detailed profile information of a user based on their ID.

--- 

### Date: 30-10-2024

1. **Chat Page Development:**
   - Created the **ChatPage** component for users to engage in real-time conversations.

2. **Messages Component:**
   - Developed the **Messages.jsx** component to display chat messages within the chat interface.

3. **Custom Hook for Messages:**
   - Implemented **useGetAllMessages** to fetch all messages in a conversation.

4. **Chat Slice:**
   - Created **chatSlice.js** to manage the state of chat-related features.

5. **Socket Slice:**
   - Developed **socketSlice.js** to handle WebSocket connections and events.

6. **Backend Socket Integration:**
   - Established WebSocket connections in the backend to facilitate real-time messaging.

7. **Frontend Socket Integration:**
   - Integrated the WebSocket functionality in the frontend to support real-time chat features.

8. **Real-time Messaging:**
   - Enabled users to send and receive messages in real time.

9. **Like Notification System:**
   - Implemented a real-time like notification feature to alert users when their posts receive likes.

10. **Deployment and Future Planning:**
    - Deployed the application for user access.
    - Established a plan to continuously improve the application over time, addressing any bugs and enhancing features based on user feedback.

    # Project Completion Announcement

🎉 I'm excited to share that I have completed my **Instagram Clone** project! It is now live, and you can check it out at [kalehub.com](https://kalehub.com).

This project allowed me to explore various aspects of full-stack development, and I'm proud of the features I've implemented. Moving forward, I look forward to creating more exciting projects and continuing to enhance my skills!

Thank you for your support!
