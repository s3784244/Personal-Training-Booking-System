/**
 * Booking Controller
 * 
 * Handles all booking-related backend operations including:
 * - Creating Stripe checkout sessions for payments
 * - Processing webhook events from Stripe
 * - Managing booking data in the database
 * 
 * This controller ensures secure payment processing and proper booking creation
 * only after successful payment confirmation from Stripe.
 */

import User from '../models/UserSchema.js'
import Trainer from '../models/TrainerSchema.js'
import Booking from '../models/BookingSchema.js'
import Stripe from 'stripe'

/**
 * Create Stripe Checkout Session
 * 
 * This function creates a Stripe checkout session for booking payments.
 * It does NOT create the booking in the database - that happens in the webhook
 * after payment is confirmed.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCheckoutSession = async (req, res) => {
  try {
    // Find the trainer being booked
    const trainer = await Trainer.findById(req.params.trainerId);
    // Find the user making the booking (from JWT token)
    const user = await User.findById(req.userId);

    // Validate that both trainer and user exist
    if (!trainer || !user) {
      return res.status(404).json({ success: false, message: "Trainer or user not found" });
    }

    // Extract booking details from request body
    const { timeSlot, bookingDate } = req.body;

    // Validate that required booking information is provided
    if (!timeSlot || !bookingDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Time slot and booking date are required" 
      });
    }

    // Initialize Stripe with secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Accept card payments
      mode: 'payment', // One-time payment (not subscription)
      
      // URLs for redirect after payment
      success_url: `${process.env.CLIENT_SUCCESS_URL}/checkout-success`, // Success page
      cancel_url: `${process.env.CLIENT_SUCCESS_URL}/trainers/${trainer._id}`, // Back to trainer page
      
      // Customer information
      customer_email: user.email,
      client_reference_id: req.params.trainerId, // Reference for tracking
      
      // Metadata to be sent to webhook after payment
      // This data will be used to create the booking
      metadata: {
        trainerId: trainer._id.toString(),
        userId: user._id.toString(),
        bookingDate: bookingDate,
        timeSlotDay: timeSlot.day,
        timeSlotStart: timeSlot.startingTime,
        timeSlotEnd: timeSlot.endingTime
      },
      
      // Payment line items
      line_items: [
        {
          price_data: {
            currency: 'aud', // Australian Dollar
            unit_amount: Math.round(trainer.ticketPrice * 100), // Convert to cents
            product_data: {
              name: `Training Session with ${trainer.name}`,
              description: `${timeSlot.day} ${timeSlot.startingTime}-${timeSlot.endingTime} on ${bookingDate}`,
              images: trainer.photo ? [trainer.photo] : [], // Trainer photo if available
            }
          },
          quantity: 1 // Single session
        }
      ]
    });

    // Return session URL for frontend to redirect to Stripe checkout
    res.status(200).json({ 
      success: true, 
      message: 'Checkout session created successfully', 
      session: {
        id: session.id,
        url: session.url // Frontend will redirect here
      }
    });

  } catch (err) {
    // Handle any errors during checkout session creation
    res.status(500).json({ 
      success: false, 
      message: `Error creating checkout session: ${err.message}` 
    });
  }
};

/**
 * Handle Stripe Webhook
 * 
 * This function processes webhook events from Stripe.
 * It creates the actual booking in the database ONLY after
 * payment has been successfully completed and verified by Stripe.
 * 
 * This ensures bookings are only created for paid sessions.
 * 
 * @param {Object} req - Express request object (contains raw webhook data)
 * @param {Object} res - Express response object
 */
export const handleStripeWebhook = async (req, res) => {
  try {
    // Get Stripe signature from headers for webhook verification
    const sig = req.headers['stripe-signature'];
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    let event;
    try {
      // Verify that the webhook came from Stripe (security measure)
      // This prevents malicious actors from creating fake payment confirmations
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      // Webhook verification failed - reject the request
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Process successful payment events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object; // Payment session data
      
      // Validate that all required booking data is present
      if (!session.metadata.bookingDate || !session.metadata.timeSlotDay) {
        return res.status(400).json({ error: 'Missing booking data' });
      }

      // Create the booking in the database
      // This only happens AFTER successful payment
      const booking = new Booking({
        trainer: session.metadata.trainerId, // Trainer being booked
        user: session.metadata.userId, // User who made the booking
        ticketPrice: (session.amount_total / 100).toString(), // Convert from cents to dollars
        bookingDate: new Date(session.metadata.bookingDate), // When the session is scheduled
        
        // Time slot information
        timeSlot: {
          day: session.metadata.timeSlotDay,
          startingTime: session.metadata.timeSlotStart,
          endingTime: session.metadata.timeSlotEnd
        },
        
        status: 'approved', // Automatically approve paid bookings
        isPaid: true, // Mark as paid since payment was successful
        sessionId: session.id // Store Stripe session ID for reference
      });

      // Save the booking to the database
      await booking.save();
    }

    // Acknowledge receipt of the webhook
    res.json({ received: true });
  } catch (err) {
    // Handle any errors during webhook processing
    res.status(500).json({ error: err.message });
  }
};
