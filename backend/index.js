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

dotenv.config()

const app = express()

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://personal-trainer-booking.vercel.app',
        'https://personal-trainer-booking-api.vercel.app'
      ] 
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// Stripe webhook - must be before express.json()
app.use('/api/v1/bookings/webhook', express.raw({type: 'application/json'}))

// Other middleware
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

// MongoDB connection for serverless - cached
let cachedConnection = null

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection
  }

  try {
    const opts = {
      bufferCommands: false,
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

// Database connection middleware
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

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Personal Training Booking API is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  })
})

// Test route
app.get('/api/v1/test', (req, res) => {
  res.json({ 
    message: 'API routes working!', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// ✅ KEY FIX: Keep your existing routes as they are
// The vercel.json rewrite handles the double /api issue
console.log('📋 Registering API routes...')
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/trainers', trainerRoute)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/bookings', bookingRoute)
console.log('✅ All routes registered successfully')

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Global error handler:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  console.log(`🔍 404 - Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString()
  })
})

// ✅ DUAL MODE: Works for both local development AND serverless
if (process.env.NODE_ENV !== 'production') {
  // Local development
  const port = process.env.PORT || 5000
  app.listen(port, async () => {
    await connectDB()
    console.log(`🚀 Server running on port ${port}`)
  })
}

// ✅ Export for Vercel serverless (this is the key!)
export default app