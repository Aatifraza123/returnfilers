require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const defaultSettings = {
  companyName: 'ReturnFilers',
  email: 'info@returnfilers.in',
  phone: '+91 84471 27264',
  address: '',
  privacyPolicy: `1. Information We Collect
We collect information that you provide directly to us, including your name, email address, phone number, billing address, and payment details when you engage with our services or fill out a form on our website.

2. How We Use Your Information
We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and invoice reminders, and respond to your comments and service inquiries efficiently.

3. Information Sharing
We do not share your personal information with third parties except as described in this policy. We may share strict necessary data with secure service providers (like payment gateways) who perform essential services on our behalf.

4. Data Security
We implement industry-standard security measures, including SSL encryption and secure server protocols, to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.

5. Your Rights
You have the right to access, update, correction, or deletion of your personal information at any time. You may also opt-out of receiving promotional communications from us by following the instructions in those messages.

6. Contact Us
If you have any questions regarding this Privacy Policy or your personal data, please contact us at: info@returnfilers.in`,

  termsConditions: `1. Introduction
These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to be bound by these terms. If you disagree with any part of these terms, you may not access the service.

2. Services
We provide professional chartered accountancy services including tax consulting, auditing, and financial advisory. All services are subject to these terms and any specific engagement letters signed between us and the client.

3. Payments
All payments must be made in advance unless otherwise agreed in writing. We accept bank transfers, UPI, and major credit cards. Late payments may incur additional interest charges of 1.5% per month.

4. Refunds
Our refund policy is strictly outlined in our separate Refund Policy document. Generally, fees paid for completed services are non-refundable. Retainers may be refunded on a pro-rata basis if the engagement is terminated early.

5. Intellectual Property
All content on this website, including text, graphics, logos, and software, is the property of ReturnFilers and is protected by international copyright laws.

6. Limitation of Liability
We are not liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.

7. Changes to Terms
We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.

8. Contact Us
For any questions regarding these Terms & Conditions, please contact us at: info@returnfilers.in`,

  refundPolicy: `1. Refund Eligibility
Refunds are generally available only for services that have not yet commenced or been delivered. Once our team has started working on your file (e.g., tax analysis, document verification), full refunds are no longer applicable to cover the billable hours used.

2. Refund Process
To request a refund, you must contact our support team within 7 days of the initial payment. All requests must include the transaction ID and a valid reason for cancellation. Approved refunds will be processed back to the original payment method within 7-14 business days.

3. Non-Refundable Items
Certain services are strictly non-refundable. These include government fees paid on your behalf (e.g., MCA filing fees, GST registration fees), expedited service charges, and digital products/reports that have already been downloaded or emailed.

4. Partial Refunds
If partial work has been completed but the service cannot be fully delivered due to unforeseen circumstances or client cancellation, a partial refund may be issued at our sole discretion. We will deduct a fair amount for the hours and resources already utilized.

5. Contact Us
For any questions regarding refunds or billing discrepancies, please email us at: info@returnfilers.in`,

  lastUpdated: new Date()
};

const seedSettings = async () => {
  try {
    await connectDB();

    // Delete existing settings
    await Settings.deleteMany({});
    console.log('✓ Cleared existing settings');

    // Create new settings
    const settings = await Settings.create(defaultSettings);
    console.log('✓ Settings seeded successfully');
    console.log('Settings ID:', settings._id);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding settings:', error);
    process.exit(1);
  }
};

seedSettings();
