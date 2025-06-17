/**
 * Controllers folder contains the logic for handling API requests. 
 * Each controller function corresponds to an endpoint in the Routes/ 
 * folder.
 * 
 * Handles authentication logic.
 * 
 * Functions:
 * - register: Registers a new user or trainer.
 * - login: Authenticates a user or trainer and generates a JWT token.
 */

import User from '../models/UserSchema.js'
import Trainer from '../models/TrainerSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Function to generate JWT token with user ID and role
const generateToken = user => {
  return jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET_KEY, {
    expiresIn: '100d'
  }) 
}

// Register controller: handles registration for both client and trainer
export const register = async (req, res) => {
  
  const {email, password, name, role, photo, gender} = req.body
  
  try {
    let user = null

    // Check if user with same email already exists in respective collection
    if(role === 'client') {
      user = await User.findOne({email})
    }
    else if(role === 'trainer') {
      user = await Trainer.findOne({email})
    }

    // If user exists, return an error
    if(user) {
      return res.status(400).json({ message: 'User already exist'})
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    // Create new user/trainer instance based on role
    if (role === 'client') {
      user = new User ({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role
      })
    }
    if (role === 'trainer') {
      user = new Trainer ({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role
      })
    }

    // Save the new user/trainer to the database
    await user.save()
    res.status(200).json({success:true, message: "User Successfully created"})

  } catch (err) {
    console.error("Error in register:", err);
    res.status(200).json({success:false, message: "Internal server error"})
  }
};
// Login controller: handles login for both client and trainer
export const login = async (req, res) => {
  const {email, password} = req.body
  
  try {
    let user = null

    const client = await User.findOne({email})
    const trainer = await Trainer.findOne({email})
    
    if(client){
      user = client
    }
    if(trainer){
      user = trainer
    }
    
    // Check for user in both collections
    if(!user){
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password) 
    
    if(!isPasswordMatch){
      return res.status(400).json({ success: false, message: "Invalid credentials" }); 
    }

    // if password match then we get auth token
    const token = generateToken(user);

    // Remove sensitive or unnecessary fields before sending response
    const {password: userPassword, role, bookings, ...rest} = user._doc

    res.status(200).json({ 
      success: true, 
      message: "Successfully logged in", 
      token, 
      data: { ...rest}, 
      role 
    });
  
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: "Failed to login" });
  }
};