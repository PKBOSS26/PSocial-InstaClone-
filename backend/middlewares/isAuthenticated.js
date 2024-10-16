import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                msg: "User is not authenticated",
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_PK_Secret);
        if (!decoded) {
            return res.status(401).json({
                msg: "Invalid token",
                success: false,
            });
        }

        // Attach the user ID from the decoded token to the request object
        req.id = decoded.userId;
        next(); // Move to the next middleware or route handler
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            msg: "Something went wrong",
            success: false,
        });
    }
};

export default isAuthenticated;
