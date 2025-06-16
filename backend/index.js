/**
 * Entry point of the backend application.
 *
 * Responsibilities:
 * - Sets up the Express server.
 * - Connects to the MongoDB database using Mongoose.
 * - Configures middleware: express.json, cookie-parser, and cors.
 * - Defines API routes for authentication, users, trainers, and reviews.
 * - Starts the server on the specified port.
 */

import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoute from './Routes/auth.js'
import userRoute from './Routes/user.js'
import trainerRoute from './Routes/trainer.js'
import reviewRoute from './Routes/review.js'
import bookingRoute from './Routes/booking.js'


dotenv.config()

const app = express()
const port = process.env.PORT || 8000

// Updated CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://personal-trainer-booking.vercel.app',
        'https://personal-trainer-booking-api.vercel.app'
      ] 
    : ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// IMPORTANT: Handle Stripe webhook BEFORE express.json() middleware
app.use('/api/v1/bookings/webhook', express.raw({type: 'application/json'}))

// Connect to MongoDB
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB database is connected');
  } catch (err) {
    console.log('MongoDB database connection failed:', err);
    throw err;
  }
}

// middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// Connect to database before handling requests
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection failed' 
      });
    }
  }
  next();
});

// Routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/trainers', trainerRoute)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/bookings', bookingRoute)

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() })
})

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    connectDB();
    console.log('Server is running on port ' + port);
  });
}

export default app;