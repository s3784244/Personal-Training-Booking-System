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

// CORS configuration for production
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

// MongoDB connection for serverless
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const opts = {
      bufferCommands: false,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cachedDb = await mongoose.connect(process.env.MONGO_URL, opts);
    console.log('MongoDB connected');
    return cachedDb;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Connect to database for each request (serverless requirement)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/trainers', trainerRoute)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/bookings', bookingRoute)

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Personal Training Booking API is working!', 
    timestamp: new Date().toISOString(),
    routes: [
      '/api/v1/auth',
      '/api/v1/users', 
      '/api/v1/trainers',
      '/api/v1/reviews',
      '/api/v1/bookings'
    ]
  })
})

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  })
})

// Test route for trainers
app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'API routes are working!', timestamp: new Date().toISOString() });
});

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