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

dotenv.config()

const app = express()

// ✅ ADD DEBUGGING FOR IMPORTS
console.log('🔄 Starting route imports...')

let authRoute, userRoute, trainerRoute, reviewRoute, bookingRoute

try {
  authRoute = (await import('./Routes/auth.js')).default
  console.log('✅ Auth route imported:', !!authRoute)
} catch (err) {
  console.error('❌ Auth route import failed:', err.message)
}

try {
  userRoute = (await import('./Routes/user.js')).default
  console.log('✅ User route imported:', !!userRoute)
} catch (err) {
  console.error('❌ User route import failed:', err.message)
}

try {
  trainerRoute = (await import('./Routes/trainer.js')).default
  console.log('✅ Trainer route imported:', !!trainerRoute)
} catch (err) {
  console.error('❌ Trainer route import failed:', err.message)
}

try {
  reviewRoute = (await import('./Routes/review.js')).default
  console.log('✅ Review route imported:', !!reviewRoute)
} catch (err) {
  console.error('❌ Review route import failed:', err.message)
}

try {
  bookingRoute = (await import('./Routes/booking.js')).default
  console.log('✅ Booking route imported:', !!bookingRoute)
} catch (err) {
  console.error('❌ Booking route import failed:', err.message)
}

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

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

// MongoDB connection cache
let cachedConnection = null

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGO_URL, {
      bufferCommands: false,
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

// Connect to DB on each request
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
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

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

// ✅ CONDITIONALLY REGISTER ROUTES ONLY IF IMPORTS SUCCEEDED
console.log('📋 Registering API routes...')

if (authRoute) {
  app.use('/api/v1/auth', authRoute)
  console.log('✅ Auth routes registered')
} else {
  console.error('❌ Skipping auth routes - import failed')
}

if (userRoute) {
  app.use('/api/v1/users', userRoute)
  console.log('✅ User routes registered')
} else {
  console.error('❌ Skipping user routes - import failed')
}

if (trainerRoute) {
  app.use('/api/v1/trainers', trainerRoute)
  console.log('✅ Trainer routes registered')
} else {
  console.error('❌ Skipping trainer routes - import failed')
}

if (reviewRoute) {
  app.use('/api/v1/reviews', reviewRoute)
  console.log('✅ Review routes registered')
} else {
  console.error('❌ Skipping review routes - import failed')
}

if (bookingRoute) {
  app.use('/api/v1/bookings', bookingRoute)
  console.log('✅ Booking routes registered')
} else {
  console.error('❌ Skipping booking routes - import failed')
}

console.log('✅ Route registration completed')

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
  console.log('Available routes check:')
  console.log('- Auth route loaded:', !!authRoute)
  console.log('- User route loaded:', !!userRoute) 
  console.log('- Trainer route loaded:', !!trainerRoute)
  console.log('- Review route loaded:', !!reviewRoute)
  console.log('- Booking route loaded:', !!bookingRoute)
  
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString(),
    routeStatus: {
      auth: !!authRoute,
      user: !!userRoute,
      trainer: !!trainerRoute,
      review: !!reviewRoute,
      booking: !!bookingRoute
    }
  })
})

// Local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000
  app.listen(port, async () => {
    await connectDB()
    console.log(`🚀 Server running on port ${port}`)
  })
}

export default app