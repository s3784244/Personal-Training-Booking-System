import User from '../models/UserSchema.js'
import Trainer from '../models/TrainerSchema.js'
import Booking from '../models/BookingSchema.js'
import Stripe from 'stripe'

export const getCheckoutSession = async (req, res) => {
  try {
    // get currently booked trainer
    const trainer = await Trainer.findById(req.params.trainerId)
    const user = await User.findById(req.userId)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    // create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.CLIENT_SUCCESS_URL}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get('host')}/trainers/${trainer.id}`,
      customer_email: user.email,
      client_reference_id: req.params.trainerId,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            unit_amount: trainer.ticketPrice * 100,
            product_data: {
              name: trainer.name,
              description: trainer.bio || "No description available", // Fallback for empty bio
              images: trainer.photo ? [trainer.photo] : [],
            }
          },
          quantity: 1
        }
      ]
    })

    // create booking in database
    const booking = new Booking({
      trainer: trainer._id,
      user: user._id,
      ticketPrice: trainer.ticketPrice,
      sessionId: session.id,
    })

    await booking.save()
    // send session id to client
    res.status(200).json({ success: true, message: 'Successfully paid', session })
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating checkout session" })
  }
}
