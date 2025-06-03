import jwt from "jsonwebtoken";
import Trainer from "../models/TrainerSchema.js";
import User from "../models/UserSchema.js";

// Middleware to authenticate the user
export const authenticate = async (req, res, next) => {
  // Get token from headers
  const authToken = req.headers.authorization;

  console.log("Auth Header:", authToken); // Debug line


  // Check if token exists
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    // Extract the token from the "Bearer " prefix
    const token = authToken.split(" ")[1];
    console.log("Extracted Token:", token); // Debug line
     // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Token:", decoded); // Debug line

    // Attach the user ID and role to the request object
    req.userId = decoded.id;
    req.role = decoded.role;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle token expiration error
    console.error("Token verification error:", err); // Debug line

    if(err.name === 'TokenExpiredError') {
      return res.status(401).json({message: 'Token expired'})
    }
    // Handle invalid token error
    return res.status(401).json({success: false, message: 'Invalid token'})
  }
};

// Middleware to restrict access based on user roles
export const restrict = roles => async (req, res, next) => {
  const userId = req.userId;
  let user;

  const client = await User.findById(userId);
  const trainer = await Trainer.findById(userId);

  if (client) user = client;
  if (trainer) user = trainer;

  if (!roles.includes(user.role)) {
    return res.status(401).json({ success: false, message: "You're not authorized" });
  }

  next();
};

