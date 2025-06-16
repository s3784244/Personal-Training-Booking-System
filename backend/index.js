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

// CORS configuration
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

// Handle Stripe webhook BEFORE express.json() middleware
app.use('/api/v1/bookings/webhook', express.raw({type: 'application/json'}))

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// MongoDB connection - simplified for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Connect to database middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed in middleware:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Personal Training Booking API is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    mongoUrl: process.env.MONGO_URL ? 'configured' : 'missing'
  })
})

// Test route
app.get('/api/v1/test', (req, res) => {
  res.json({ 
    message: 'API routes are working!', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Debug route to test database
app.get('/api/v1/debug/trainers', async (req, res) => {
  try {
    await connectDB();
    
    // Dynamic import for serverless
    const { default: Trainer } = await import('./models/TrainerSchema.js');
    
    const count = await Trainer.countDocuments();
    const trainers = await Trainer.find({}).limit(3).select('name email specialization');
    
    res.json({
      success: true,
      message: 'Database connection working',
      trainersCount: count,
      sampleTrainers: trainers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// API Routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/trainers', trainerRoute)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/bookings', bookingRoute)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/',
      '/health',
      '/api/v1/test',
      '/api/v1/debug/trainers',
      '/api/v1/auth',
      '/api/v1/users', 
      '/api/v1/trainers',
      '/api/v1/reviews',
      '/api/v1/bookings'
    ]
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, async () => {
    await connectDB();
    console.log('Server is running on port ' + port);
  });
}

export default app;