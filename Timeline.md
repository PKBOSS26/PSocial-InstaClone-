# Instagram Clone Project Timeline

## Project Overview
This project is an Instagram clone that allows users to share photos, follow others, interact through comments and likes, and chat with other users.

---

## Timeline

### Date: 16-10-2024

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
