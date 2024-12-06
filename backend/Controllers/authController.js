import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt.js'

export const register = async (req, res) => {
  
  const {email, password, name, role, photo, gender} = req.body
  
  try {
    let user = null

    if(role === 'client') {
      user = User.findOne({email})
    }
    else if(role==='trainer') {
      user = Trainer.findOne({email})
    }

    // check if user exist
    if(user) {
      return res.status(400).json({ message: 'User already exist'})
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

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

    await user.save()
    res.status(200).json({success:true, message: "User Successfully created"})

  } catch (err) {}
};

export const login = async (req, res) => {
  try {
    let user = null

    const patient = await User.findOne({email})
    const doctor = await Doctor.findOne({email})

  } catch (err) {}
};