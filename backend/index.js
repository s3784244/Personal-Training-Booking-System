/**
 * Personal Training Booking System - Backend Entry Point
 * 
 * This is the main server file that sets up and configures the Express.js application
 * for the Personal Training Booking System. It handles:
 * 
 * - Server setup and middleware configuration
 * - MongoDB database connection with caching for serverless deployment
 * - CORS configuration for frontend-backend communication
 * - API route registration for all application features
 * - Error handling and logging
 * - Stripe webhook integration for payment processing
 * 
 * The application is designed to work in both local development and 
 * serverless production environments (Vercel).
 */

import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Import routes
import authRoute from './Routes/auth.js'
import userRoute from './Routes/user.js'
import trainerRoute from './Routes/trainer.js'
import reviewRoute from './Routes/review.js'
import bookingRoute from './Routes/booking.js'

// Load environment variables from .env file
dotenv.config()

const app = express()

/**
 * CORS Configuration
 * 
 * Configures Cross-Origin Resource Sharing to allow the React frontend
 * to communicate with this backend API. Uses different origins based on
 * the environment (development vs production).
 */
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://personal-trainer-booking.vercel.app',
        'https://personal-trainer-booking-api.vercel.app'
      ] 
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true, // Allow cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

/**
 * Stripe Webhook Middleware
 * 
 * CRITICAL: This must be before express.json() middleware because
 * Stripe requires the raw request body to verify webhook signatures.
 * If express.json() processes it first, the signature verification will fail.
 */
app.use('/api/v1/bookings/webhook', express.raw({type: 'application/json'}))

// Parse JSON requests with 10MB limit (allows base64 image uploads)
app.use(express.json({ limit: '10mb' }))
// Parse cookies from incoming requests
app.use(cookieParser())

/**
 * Database Connection with Caching
 * 
 * Implements connection caching which is essential for serverless environments.
 * Without caching, each request would create a new database connection,
 * leading to connection pool exhaustion and poor performance.
 */
let cachedConnection = null

const connectDB = async () => {
  // Return existing connection if already connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGO_URL, {
      // Disable buffering for serverless - commands execute immediately
      bufferCommands: false,
      // Connection timeout settings optimized for serverless
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log('✅ MongoDB connected successfully')
    return cachedConnection
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    throw err
  }
}

/**
 * Database Connection Middleware
 * 
 * Ensures database connection before processing any request.
 * This runs before all route handlers to guarantee database availability.
 */
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next() // Continue to route handler
  } catch (error) {
    console.error('Database connection failed:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    })
  }
})

/**
 * Root Endpoint - API Status Check
 * 
 * Provides basic information about the API including environment,
 * database connection status, and timestamp. Useful for health monitoring.
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'Personal Training Booking API is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

/**
 * Health Check Endpoint
 * 
 * Used by monitoring services and deployment platforms (like Vercel)
 * to verify the application is healthy and ready to serve requests.
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/trainers', trainerRoute)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/bookings', bookingRoute)

/**
 * Global Error Handler
 * 
 * Catches any unhandled errors that occur during request processing.
 * Prevents the server from crashing and provides consistent error responses.
 * Shows detailed errors in development, generic messages in production.
 */
app.use((err, req, res, next) => {
  console.error('Global error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

/**
 * 404 Not Found Handler
 * 
 * IMPORTANT: This must be the last middleware as it catches all requests
 * that didn't match any defined routes. Provides helpful debugging information
 * about the failed request including URL, method, and timestamp.
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString()
  })
})

/**
 * Local Development Server
 * 
 * Only starts a traditional Express server in development.
 * In production (Vercel), the app is exported as a serverless function.
 */
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000
  app.listen(port, async () => {
    await connectDB() // Ensure database connection on startup
    console.log(`🚀 Server running on port ${port}`)
  })
}

/**
 * Serverless Export
 * 
 * Exports the Express app for serverless deployment on Vercel.
 * This allows Vercel to create serverless functions from the Express app.
 */
export default app