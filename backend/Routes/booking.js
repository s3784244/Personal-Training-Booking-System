import express from 'express';
import { authenticate } from './../auth/verifyToken.js';
import { getCheckoutSession, handleStripeWebhook } from '../Controllers/bookingController.js';

const router = express.Router();

router.post('/checkout-session/:trainerId', authenticate, getCheckoutSession);
router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

export default router;
// This code defines an Express router for handling booking-related routes.
// It imports the necessary modules and middleware, including the authentication middleware.
// The router defines a single POST route for creating a checkout session for a specific trainer.
// The route is protected by the authentication middleware, ensuring that only authenticated users can access it.
// The `getCheckoutSession` function is imported from the booking controller and is responsible for handling the logic of creating a checkout session with Stripe.
// Additionally, there is a POST route for handling Stripe webhooks, which is used to receive asynchronous notifications from Stripe about events related to the checkout sessions.
