const Newsletter = require('../models/Newsletter');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('📧 Newsletter subscription request received');

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if already subscribed
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        // Reactivate subscription
        existingSubscriber.status = 'active';
        await existingSubscriber.save();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      });
    }

    // Create new subscriber
    await Newsletter.create({
      email: email.trim().toLowerCase()
    });

    console.log('✅ Newsletter subscription added');

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });
  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to subscribe'
    });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ status: 'active' })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers
    });
  } catch (error) {
    console.error('❌ Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete newsletter subscriber
// @route   DELETE /api/newsletter/:id
// @access  Private/Admin
const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    await Newsletter.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete subscriber error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unsubscribe from newsletter (public)
// @route   GET /api/newsletter/unsubscribe/:email
// @access  Public
const unsubscribe = async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    
    console.log('📧 Unsubscribe request received');

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (!subscriber) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Already Unsubscribed - ReturnFilers</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border: 1px solid #e0e0e0; text-align: center; }
            h1 { color: #333; margin: 0 0 20px 0; font-size: 24px; }
            p { color: #666; line-height: 1.6; margin: 0 0 20px 0; }
            a { color: #000; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Already Unsubscribed</h1>
            <p>This email address is not in our mailing list.</p>
            <p><a href="https://returnfilers.in">Return to ReturnFilers</a></p>
          </div>
        </body>
        </html>
      `);
    }

    // Update status to unsubscribed instead of deleting
    subscriber.status = 'unsubscribed';
    await subscriber.save();

    console.log('✅ User unsubscribed successfully');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribed Successfully - ReturnFilers</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border: 1px solid #e0e0e0; text-align: center; }
          h1 { color: #333; margin: 0 0 20px 0; font-size: 24px; }
          p { color: #666; line-height: 1.6; margin: 0 0 20px 0; }
          .success { color: #22c55e; font-weight: 600; font-size: 18px; margin: 20px 0; }
          a { color: #000; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✓ Unsubscribed Successfully</h1>
          <p class="success">You have been unsubscribed from our mailing list.</p>
          <p>We're sorry to see you go. You will no longer receive promotional emails from ReturnFilers.</p>
          <p>If you change your mind, you can always subscribe again on our website.</p>
          <p><a href="https://returnfilers.in">Return to ReturnFilers</a></p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('❌ Unsubscribe error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Error - ReturnFilers</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border: 1px solid #e0e0e0; text-align: center; }
          h1 { color: #ef4444; margin: 0 0 20px 0; font-size: 24px; }
          p { color: #666; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Error</h1>
          <p>Something went wrong. Please try again later or contact us at info@returnfilers.in</p>
        </div>
      </body>
      </html>
    `);
  }
};

module.exports = {
  subscribe,
  getSubscribers,
  deleteSubscriber,
  unsubscribe
};









