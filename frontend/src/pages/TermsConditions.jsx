import { motion } from 'framer-motion';
import { FaFileContract, FaShieldAlt, FaUserShield, FaExclamationTriangle } from 'react-icons/fa';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-32">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <FaFileContract className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-8 space-y-8"
        >
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-secondary" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to ReturnFilers. By accessing and using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
            </p>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Our Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ReturnFilers provides professional tax filing, GST registration, business incorporation, and financial advisory services. We are committed to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Accurate and timely tax return filing</li>
              <li>Complete GST compliance and registration</li>
              <li>Business registration and incorporation services</li>
              <li>Professional financial advisory and consultation</li>
              <li>Document preparation and submission</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <FaUserShield className="text-secondary" />
              User Responsibilities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a user of our services, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Submit all required documents in a timely manner</li>
              <li>Maintain confidentiality of your account credentials</li>
              <li>Comply with all applicable tax laws and regulations</li>
              <li>Pay for services as per agreed terms</li>
              <li>Notify us immediately of any changes in your information</li>
            </ul>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Payment Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All fees for our services are clearly communicated before engagement. Payment terms include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Fees are due as per the agreed payment schedule</li>
              <li>We accept online payments, bank transfers, and other specified methods</li>
              <li>Refunds are subject to our refund policy</li>
              <li>Late payments may result in service suspension</li>
            </ul>
          </section>

          {/* Confidentiality */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Confidentiality & Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              We maintain strict confidentiality of all client information. Your personal and financial data is protected under our Privacy Policy and applicable data protection laws. We will never share your information with third parties without your explicit consent, except as required by law.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <FaExclamationTriangle className="text-secondary" />
              Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              While we strive for accuracy and excellence:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>We are not liable for errors resulting from incorrect information provided by clients</li>
              <li>Our liability is limited to the fees paid for the specific service</li>
              <li>We are not responsible for delays caused by government authorities</li>
              <li>Force majeure events are beyond our control</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on our website, including text, graphics, logos, and software, is the property of ReturnFilers and protected by copyright laws. You may not reproduce, distribute, or use any content without our written permission.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              Either party may terminate services with written notice. Upon termination, all outstanding fees become immediately due. We reserve the right to terminate services for violation of these terms or non-payment.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Continued use of our services after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Ghaziabad, Uttar Pradesh.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> info@returnfilers.in</p>
              <p><strong>Phone:</strong> +91 84471 27264</p>
              <p><strong>Address:</strong> SA-28 First Floor, Jaipuria Sunrise Plaza, 12A Ahinsa Khand-I, Indrapuram, Ghaziabad, Uttar Pradesh 201014</p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsConditions;
