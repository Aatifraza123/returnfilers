const Payment = require('../models/paymentModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

    // Send confirmation email to customer
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && payment.customerDetails?.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const emailSubject = payment.serviceName 
          ? `✅ Payment Confirmed - ${payment.serviceName} - ₹${payment.amount.toLocaleString()}`
          : `✅ Payment Confirmed - ₹${payment.amount.toLocaleString()}`;

        const mailOptions = {
          from: `"CA Associates" <${process.env.EMAIL_USER}>`,
          to: payment.customerDetails.email,
          subject: emailSubject,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #0B1530 0%, #1a2b5c 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                          <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: bold;">Payment Confirmed! 🎉</h1>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 30px;">
                          <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">Dear <strong>${payment.customerDetails.name}</strong>,</p>
                          
                          <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                            Thank you for your payment! Your transaction has been successfully processed.
                          </p>
                          
                          <div style="background-color: #f0fdf4; border: 2px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 8px;">
                            <h3 style="color: #16a34a; margin: 0 0 15px 0; font-size: 18px;">💰 Payment Details</h3>
                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Amount Paid:</strong></td>
                                <td style="color: #0B1530; font-size: 16px; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${payment.amount.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Payment ID:</strong></td>
                                <td style="color: #666; font-size: 12px; font-family: monospace; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${payment.razorpayPaymentId}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Order ID:</strong></td>
                                <td style="color: #666; font-size: 12px; font-family: monospace; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${payment.razorpayOrderId}</td>
                              </tr>
                              <tr>
                                <td style="color: #666; font-size: 14px; padding: 8px 0;"><strong>Date:</strong></td>
                                <td style="color: #666; font-size: 14px; padding: 8px 0; text-align: right;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                              </tr>
                            </table>
                          </div>
                          
                          ${payment.serviceName ? `
                          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #D4AF37; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            <h3 style="color: #0B1530; margin: 0 0 12px 0; font-size: 16px; font-weight: bold;">📋 Service Details</h3>
                            <table width="100%" cellpadding="6" cellspacing="0">
                              <tr>
                                <td style="color: #666; font-size: 13px; padding: 6px 0; width: 30%;"><strong>Service Name:</strong></td>
                                <td style="color: #0B1530; font-size: 14px; font-weight: bold; padding: 6px 0;">${payment.serviceName}</td>
                              </tr>
                              ${payment.serviceCategory ? `
                              <tr>
                                <td style="color: #666; font-size: 13px; padding: 6px 0;"><strong>Category:</strong></td>
                                <td style="color: #666; font-size: 13px; padding: 6px 0;">
                                  <span style="background-color: #D4AF37; color: #0B1530; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">${payment.serviceCategory}</span>
                                </td>
                              </tr>
                              ` : ''}
                              ${payment.serviceDescription ? `
                              <tr>
                                <td style="color: #666; font-size: 13px; padding: 6px 0; vertical-align: top;"><strong>Description:</strong></td>
                                <td style="color: #666; font-size: 13px; padding: 6px 0; line-height: 1.5;">${payment.serviceDescription}</td>
                              </tr>
                              ` : ''}
                              ${payment.servicePrice ? `
                              <tr>
                                <td style="color: #666; font-size: 13px; padding: 6px 0;"><strong>Service Price:</strong></td>
                                <td style="color: #0B1530; font-size: 14px; font-weight: bold; padding: 6px 0;">₹${payment.servicePrice.toLocaleString()}</td>
                              </tr>
                              ` : ''}
                            </table>
                          </div>
                          ` : ''}
                          
                          <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 20px 0;">
                            Your payment receipt has been generated. Please keep this email for your records.
                          </p>
                          
                          <div style="background-color: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #004085; font-size: 14px;">
                              <strong>📧 Need Help?</strong><br>
                              If you have any questions about this payment, please contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #0B1530; font-weight: bold;">${process.env.EMAIL_USER}</a>
                            </p>
                          </div>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                          <p style="color: #D4AF37; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">CA Associates</p>
                          <p style="color: #ffffff; margin: 0; font-size: 12px;">Professional Tax & Financial Services</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Payment confirmation email sent to:', payment.customerDetails.email);
      } catch (emailErr) {
        console.error('Email Service Failed:', emailErr.message);
        // Don't fail payment if email fails
      }
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

module.exports = {
  createOrder,
  verifyPayment,
  getPayments,
  getPaymentById,
};

