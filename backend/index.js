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

const corsOptions = {
  origin: true
}

// IMPORTANT: Handle Stripe webhook BEFORE express.json() middleware
app.use('/api/v1/bookings/webhook', express.raw({type: 'application/json'}))

// database connection
mongoose.set('strictQuery', false)
const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('MongoDB database is connected')
  } catch(err) {
    console.log('MongoDB database connection failed')
  }
}

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

// Routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/trainers', trainerRoute)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/bookings', bookingRoute)

app.get('/', (req, res) => {
  res.send('API is working')
})

app.listen(port, () => {
  connectDB()
  console.log('Server is running on port ' + port)
})