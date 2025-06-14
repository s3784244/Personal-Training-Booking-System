import User from '../models/UserSchema.js'
import Trainer from '../models/TrainerSchema.js'
import Booking from '../models/BookingSchema.js'
import Stripe from 'stripe'

export const getCheckoutSession = async (req, res) => {
  try {
    console.log('=== CHECKOUT SESSION START ===');
    
    // Get currently booked trainer and user
    const trainer = await Trainer.findById(req.params.trainerId);
    const user = await User.findById(req.userId);

    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if user already has a pending booking with this trainer
    const existingBooking = await Booking.findOne({
      trainer: trainer._id,
      user: user._id,
      status: 'pending'
    });

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: "You already have a pending booking with this trainer" 
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.CLIENT_SUCCESS_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_SUCCESS_URL}/trainers/${trainer._id}`,
      customer_email: user.email,
      client_reference_id: req.params.trainerId,
      metadata: {
        trainerId: trainer._id.toString(),
        userId: user._id.toString()
      },
      line_items: [
        {
          price_data: {
            currency: 'aud',
            unit_amount: Math.round(trainer.ticketPrice * 100),
            product_data: {
              name: `Training Session with ${trainer.name}`,
              description: trainer.bio || `${trainer.specialization} training session`,
              images: trainer.photo ? [trainer.photo] : [],
            }
          },
          quantity: 1
        }
      ]
    });

    // DON'T create booking here - create it in webhook after successful payment
    // Just return the session for now
    res.status(200).json({ 
      success: true, 
      message: 'Checkout session created successfully', 
      session: {
        id: session.id,
        url: session.url
      }
    });

  } catch (err) {
    console.error('Checkout session error:', err);
    res.status(500).json({ 
      success: false, 
      message: `Error creating checkout session: ${err.message}` 
    });
  }
};

// Add webhook handler for successful payments
export const handleStripeWebhook = async (req, res) => {
  try {
    // Verify the webhook came from Stripe (security)
    const sig = req.headers['stripe-signature'];
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Check if it's a successful payment event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Create booking only after successful payment
      const booking = new Booking({
        trainer: session.metadata.trainerId,
        user: session.metadata.userId,
        ticketPrice: session.amount_total / 100, // Convert back from cents
        status: 'approved',
        isPaid: true,
        sessionId: session.id
      });

      await booking.save();
      console.log('Booking created after successful payment:', booking._id);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err.message });
  }
};
