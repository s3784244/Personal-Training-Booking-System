import express from 'express';
import { authenticate } from './../auth/verifyToken.js';
import { getCheckoutSession } from '../Controllers/bookingController.js';

const router = express.Router();

router.post('/checkout-session/:trainerId', authenticate, getCheckoutSession);

export default router;
// This code defines an Express router for handling booking-related routes.
// It imports the necessary modules and middleware, including the authentication middleware.
// The router defines a single POST route for creating a checkout session for a specific trainer.
// The route is protected by the authentication middleware, ensuring that only authenticated users can access it.
// The `getCheckoutSession` function is imported from the booking controller and is responsible for handling the logic of creating a checkout session with Stripe.
