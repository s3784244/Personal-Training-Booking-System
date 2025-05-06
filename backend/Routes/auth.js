/**
 * Handles user authentication (login and registration).
 *
 * Endpoints:
 * - POST /register: Registers a new user or trainer.
 * - POST /login: Authenticates a user or trainer and returns a JWT token.
 */

import express from 'express'
import { register, login } from '../Controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)

export default router;