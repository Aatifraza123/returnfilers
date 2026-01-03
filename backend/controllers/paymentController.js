const Payment = require('../models/paymentModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay (only if keys are provided)
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('⚠️ Razorpay keys not configured. Payment functionality will be limited.');
}

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
const createOrder = async (req, res) => {
  try {
    console.log('=== createOrder called ===');
    console.log('Request body:', req.body);
    
    if (!razorpay) {
      console.error('Razorpay not initialized');
      return res.status(500).json({ message: 'Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file.' });
    }

    const { amount, serviceId, customerDetails } = req.body;
    console.log('Parsed data:', { amount, serviceId, customerDetails });

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid amount' });
    }

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // Fetch service details if serviceId provided
    let serviceName = '';
    let serviceDescription = '';
    let serviceCategory = '';
    let servicePrice = null;
    
    if (serviceId) {
      try {
        const Service = require('../models/serviceModel');
        const service = await Service.findById(serviceId);
        if (service) {
          serviceName = service.title || '';
          serviceDescription = service.description || '';
          serviceCategory = service.category || '';
          servicePrice = service.price ? Number(service.price) : null;
          console.log('Service details fetched:', { serviceName, serviceCategory, servicePrice });
        }
      } catch (err) {
        console.log('Could not fetch service details:', err.message);
      }
    }

    // Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        serviceId: serviceId || '',
        serviceName: serviceName,
        customerName: customerDetails?.name || '',
        customerEmail: customerDetails?.email || '',
      },
    };

    const order = await razorpay.orders.create(options);

    // Save payment record to database
    const payment = await Payment.create({
      orderId: order.id,
      amount: amount,
      currency: 'INR',
      status: 'pending',
      serviceId: serviceId || null,
      serviceName: serviceName,
      serviceDescription: serviceDescription,
      serviceCategory: serviceCategory,
      servicePrice: servicePrice,
      customerDetails: {
        name: customerDetails?.name || '',
        email: customerDetails?.email || '',
        phone: customerDetails?.phone || '',
      },
      razorpayOrderId: order.id,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
};

// @desc    Verify payment and save to database
// @route   POST /api/payments/verify
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Find payment record
    const payment = await Payment.findOne({ razorpayOrderId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    // Update payment record
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.paymentId = razorpayPaymentId;
    payment.status = 'captured';
    await payment.save();

    // Send emails (non-blocking)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      setImmediate(() => {
        sendPaymentEmails(payment).catch(err => {
          console.error('Payment email error:', err);
        });
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and saved successfully',
      payment: payment,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to send payment emails using Resend
const sendPaymentEmails = async (payment) => {
  const { sendEmail } = require('../utils/emailService');
  const adminEmail = process.env.EMAIL_USER || 'razaaatif658@gmail.com';

  try {
    // Customer confirmation email
    if (payment.customerDetails?.email) {
      const customerSubject = payment.serviceName 
        ? `Payment Confirmed - ${payment.serviceName} - ₹${payment.amount.toLocaleString()}`
        : `Payment Confirmed - ₹${payment.amount.toLocaleString()}`;

      const customerHtml = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
                  <tr>
                    <td style="background-color: #0B1530; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">Payment Confirmed ✓</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <p style="color: #333; font-size: 16px;">Dear <strong>${payment.customerDetails.name}</strong>,</p>
                      <p style="color: #666; font-size: 14px;">Your payment has been successfully processed.</p>
                      <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
                        <table width="100%" cellpadding="8">
                          <tr><td style="color: #666;"><strong>Amount:</strong></td><td style="text-align: right; color: #0B1530; font-weight: bold;">₹${payment.amount.toLocaleString()}</td></tr>
                          <tr><td style="color: #666;"><strong>Payment ID:</strong></td><td style="text-align: right; font-family: monospace; font-size: 12px;">${payment.razorpayPaymentId}</td></tr>
                          ${payment.serviceName ? `<tr><td style="color: #666;"><strong>Service:</strong></td><td style="text-align: right;">${payment.serviceName}</td></tr>` : ''}
                          <tr><td style="color: #666;"><strong>Date:</strong></td><td style="text-align: right;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
                        </table>
                      </div>
                      <p style="color: #666; font-size: 14px;">For queries, call us at <strong>+91 84471 27264</strong></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                      <p style="color: #D4AF37; margin: 0; font-weight: bold;">Tax Filer</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      await sendEmail({
        to: payment.customerDetails.email,
        subject: customerSubject,
        html: customerHtml
      });
      console.log('✅ Payment confirmation email sent to customer');
    }

    // Admin notification email
    const adminSubject = payment.serviceName 
      ? `New Payment - ${payment.serviceName} - ₹${payment.amount.toLocaleString()}`
      : `New Payment - ₹${payment.amount.toLocaleString()}`;

    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
                <tr>
                  <td style="background-color: #0B1530; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">New Payment Received</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                      <table width="100%" cellpadding="8">
                        <tr><td style="color: #666;"><strong>Amount:</strong></td><td style="text-align: right; color: #0B1530; font-weight: bold; font-size: 18px;">₹${payment.amount.toLocaleString()}</td></tr>
                        <tr><td style="color: #666;"><strong>Customer:</strong></td><td style="text-align: right;">${payment.customerDetails?.name || 'N/A'}</td></tr>
                        <tr><td style="color: #666;"><strong>Email:</strong></td><td style="text-align: right;">${payment.customerDetails?.email || 'N/A'}</td></tr>
                        <tr><td style="color: #666;"><strong>Phone:</strong></td><td style="text-align: right;">${payment.customerDetails?.phone || 'N/A'}</td></tr>
                        <tr><td style="color: #666;"><strong>Payment ID:</strong></td><td style="text-align: right; font-family: monospace; font-size: 11px;">${payment.razorpayPaymentId}</td></tr>
                        ${payment.serviceName ? `<tr><td style="color: #666;"><strong>Service:</strong></td><td style="text-align: right;">${payment.serviceName}</td></tr>` : ''}
                        <tr><td style="color: #666;"><strong>Date:</strong></td><td style="text-align: right;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
                      </table>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                    <p style="color: #D4AF37; margin: 0; font-weight: bold;">Tax Filer</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await sendEmail({
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml
    });
    console.log('✅ Payment notification email sent to admin');

  } catch (error) {
    console.error('❌ Payment email error:', error.message);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPayments,
  getPaymentById,
};

