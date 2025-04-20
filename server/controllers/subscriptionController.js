const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_KEY);

const subscribe = async (req, res, next) => {
  try {
    console.log('Request received for user:', req.user);
    console.log('Environment variables check:', {
      STRIPE_KEY: process.env.STRIPE_KEY ? 'Set' : 'Not set',
      STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID ? process.env.STRIPE_PRICE_ID : 'Not set',
      CLIENT_BASE_URL: process.env.CLIENT_BASE_URL ? process.env.CLIENT_BASE_URL : 'Not set',
      ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ? 'Set' : 'Not set',
    });
    if (!process.env.STRIPE_KEY || !process.env.STRIPE_PRICE_ID || !process.env.CLIENT_BASE_URL) {
      throw new Error('Missing required environment variables');
    }

    const customer = await stripe.customers.create({
      metadata: {
        userId: req.user,
      },
    });
    console.log('Stripe customer created with ID:', customer.id);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer: customer.id,
      mode: "payment",
      success_url: `${process.env.CLIENT_BASE_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_BASE_URL}/payment-failed`,
    });
    console.log('Stripe checkout session created with URL:', session.url);

    const foundUser = await User.findByIdAndUpdate(
      req.user,
      {
        roles: {
          BasicUser: 101,
          ProUser: 102,
        },
      },
      { new: true }
    );
    if (!foundUser) {
      console.log('User not found with ID:', req.user);
      return res.status(401).json({ message: 'User not found' });
    }
    console.log('User updated successfully:', foundUser._id);

    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: foundUser._id,
          name: foundUser.name,
          email: foundUser.email,
          profilePicture: foundUser.profilePicture,
          roles: roles,
          favorites: foundUser.favorites,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ url: session.url, accessToken });
  } catch (error) {
    console.error('Subscription error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      stripeError: error.raw ? error.raw : 'N/A',
    });
    next(error);
  }
};

module.exports = { subscribe };