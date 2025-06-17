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

// Import routes
import authRoute from './Routes/auth.js'
import userRoute from './Routes/user.js'
import trainerRoute from './Routes/trainer.js'
import reviewRoute from './Routes/review.js'
import bookingRoute from './Routes/booking.js'

// Import models to ensure they're loaded
import './models/TrainerSchema.js'
import './models/UserSchema.js'
import './models/BookingSchema.js'
import './models/ReviewSchema.js'

dotenv.config()

const app = express()

// CORS configuration - IMPORTANT: Make sure these URLs match your actual deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [
          'https://personal-trainer-booking.vercel.app',
          'https://personal-trainer-booking-api.vercel.app'
        ] 
      : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins for now to debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}

// Apply CORS middleware first
app.use(cors(corsOptions))

// Handle preflight requests
app.options('*', cors(corsOptions))

// Stripe webhook - must be before express.json()
app.use('/api/v1/bookings/webhook', express.raw({type: 'application/json'}))

// Other middleware
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

// MongoDB connection for serverless - cached connection
let cachedConnection = null

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection
  }

  try {
    const opts = {
      bufferCommands: false,
      // bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    cachedConnection = await mongoose.connect(process.env.MONGO_URL, opts)
    console.log('✅ MongoDB connected successfully')
    return cachedConnection
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    throw err
  }
}

// Database middleware - connect for each request
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error('Database connection failed:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    })
  }
})

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Personal Training Booking API is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    routes: [
      '/health',
      '/api/v1/test',
      '/api/v1/debug/trainers',  
      '/api/v1/trainers',
      '/api/v1/auth/login',
      '/api/v1/auth/register'
    ]
  })
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    env: {
      mongoConfigured: !!process.env.MONGO_URL,
      nodeEnv: process.env.NODE_ENV
    }
  })
})

// Debug route to test trainers directly
app.get('/api/v1/debug/trainers', async (req, res) => {
  try {
    console.log('🔍 Debug: Testing trainers endpoint...')
    
    // Direct import
    const { default: Trainer } = await import('./models/TrainerSchema.js')
    
    const count = await Trainer.countDocuments()
    console.log('📊 Trainers count:', count)
    
    const trainers = await Trainer.find({}).limit(3).select('name email specialization ticketPrice')
    console.log('👥 Sample trainers found:', trainers.length)
    
    res.json({
      success: true,
      message: 'Debug: Database connection working',
      trainersCount: count,
      sampleTrainers: trainers,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Debug route failed:', error)
    res.status(500).json({
      success: false,
      message: 'Debug route failed',
      error: error.message
    })
  }
})

// Test API route
app.get('/api/v1/test', (req, res) => {
  res.json({ 
    message: 'API routes are working!', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// Register API routes - ORDER MATTERS
console.log('📋 Registering API routes...')
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/trainers', trainerRoute)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/bookings', bookingRoute)
console.log('✅ All routes registered')

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Global error handler:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler - MUST BE LAST
app.use('*', (req, res) => {
  console.log(`🔍 404 - Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString()
  })
})

// Local development server
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8000
  app.listen(port, async () => {
    await connectDB()
    console.log(`🚀 Server running on port ${port}`)
  })
}

export default app