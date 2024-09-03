const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { validationResult } = require('express-validator');

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);

    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: error.message });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: error.message });
    } else if (error.type === 'StripeAPIError') {
      return res.status(500).json({ error: 'Payment processing error, please try again later.' });
    } else if (error.type === 'StripeConnectionError') {
      return res.status(502).json({ error: 'Network error, please try again later.' });
    } else if (error.type === 'StripeAuthenticationError') {
      return res.status(403).json({ error: 'Authentication with payment provider failed.' });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = {
  createPaymentIntent,
};
