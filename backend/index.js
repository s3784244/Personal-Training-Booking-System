import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoute from './Routes/auth.js'
import userRoute from './Routes/user.js'
import trainerRoute from './Routes/trainer.js'


dotenv.config()

const app = express()
const port = process.env.PORT || 8000

const corsOptions = {
  origin: true
}

// database connection
mongoose.set('strictQuery', false)
const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,  
    })

    console.log('mongodb database is connected')

  } catch (err) {
    console.log('mongo database connection failed')
    
  }
}

// app.get ('/', (req, res) => {
//   res.send('Api is working')
// })

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/trainers', trainerRoute);


app.listen(port, () => {
  connectDB();
  console.log('server is running on port' + port)
})