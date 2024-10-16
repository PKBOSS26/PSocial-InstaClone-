import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";

// Signup
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ msg: "All fields are required", success: false });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ msg: "Email already in use", success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ msg: "Account created successfully", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required", success: false });
        }
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ msg: "Invalid credentials", success: false });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_PK_Secret, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 })
           .json({ msg: `Welcome ${user.username}`, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

// Logout
export const logOut = async (_, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 }).json({ msg: "Logged out successfully", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

// Get Profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found", success: false });
        }
        res.status(200).json({ user, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

// Edit Profile
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilepicture = req.file;
        let cloudRes;

        if (profilepicture) {
            const fileUri = getDataUri(profilepicture);
            cloudRes = await cloudinary.uploader.upload(fileUri.content, { folder: "profile_pictures" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found", success: false });
        }
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (cloudRes) user.profilepicture = cloudRes.secure_url;

        await user.save();
        res.status(200).json({ msg: "Profile updated successfully", success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

// Get Suggested Users
export const getSuggestedUser = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers.length) {
            return res.status(404).json({ msg: "No users available", success: false });
        }
        res.status(200).json({ success: true, users: suggestedUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};

// Follow/Unfollow User
export const followUnfollow = async (req, res) => {
    try {
        const follower = req.id;
        const followToWhom = req.params.id;
        if (follower === followToWhom) {
            return res.status(400).json({ msg: "You cannot follow/unfollow yourself", success: false });
        }
        const [user, targetUser] = await Promise.all([
            User.findById(follower),
            User.findById(followToWhom),
        ]);

        if (!user || !targetUser) {
            return res.status(404).json({ msg: "User not found", success: false });
        }

        const isFollowing = user.following.includes(followToWhom);
        if (isFollowing) {
            await Promise.all([
                user.updateOne({ $pull: { following: followToWhom } }),
                targetUser.updateOne({ $pull: { followers: follower } }),
            ]);
            res.status(200).json({ msg: "Unfollowed successfully", success: true });
        } else {
            await Promise.all([
                user.updateOne({ $push: { following: followToWhom } }),
                targetUser.updateOne({ $push: { followers: follower } }),
            ]);
            res.status(200).json({ msg: "Followed successfully", success: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error", success: false });
    }
};
