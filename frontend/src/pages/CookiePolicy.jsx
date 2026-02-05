import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const CookiePolicy = () => {
  return (
    <>
      <SEO 
        title="Cookie Policy - ReturnFilers"
        description="Learn about how ReturnFilers uses cookies to enhance your browsing experience."
      />
      
      <div className="min-h-screen bg-gray-50 py-12 pt-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-primary mb-8">Cookie Policy</h1>
            
            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Are Cookies?</h2>
                <p className="text-gray-600 leading-relaxed">
                  Cookies are small text files that are placed on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and 
                  understanding how you use our site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Cookies</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Essential Cookies</h3>
                    <p className="text-gray-600">
                      These cookies are necessary for the website to function properly. They enable basic 
                      functions like page navigation, secure areas access, and authentication.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Analytics Cookies</h3>
                    <p className="text-gray-600">
                      We use Google Analytics to understand how visitors interact with our website. 
                      This helps us improve our services and user experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Marketing Cookies</h3>
                    <p className="text-gray-600">
                      These cookies track your online activity to help advertisers deliver more relevant 
                      advertising or to limit how many times you see an ad.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Security Cookies</h3>
                    <p className="text-gray-600">
                      We use reCAPTCHA to protect our forms from spam and abuse. This service uses cookies 
                      to distinguish between humans and bots.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Cookies</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the following third-party services that may set cookies:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Google Analytics - For website analytics</li>
                  <li>Google Tag Manager - For managing marketing tags</li>
                  <li>Facebook Pixel - For social media marketing</li>
                  <li>Google reCAPTCHA - For spam protection</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Managing Cookies</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You can control and manage cookies in various ways:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Use our cookie consent banner to accept or decline cookies</li>
                  <li>Configure your browser settings to block or delete cookies</li>
                  <li>Use browser extensions to manage cookies</li>
                  <li>Opt-out of Google Analytics tracking</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Please note that blocking certain cookies may impact your experience on our website 
                  and limit the functionality available to you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookie Duration</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our cookies are stored for different periods:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                  <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                  <li><strong>Persistent Cookies:</strong> Remain for up to 1 year</li>
                  <li><strong>Consent Cookie:</strong> Stored for 1 year to remember your choice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Updates to This Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Cookie Policy from time to time. Any changes will be posted on 
                  this page with an updated revision date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about our use of cookies, please contact us at{' '}
                  <a href="mailto:info@returnfilers.in" className="text-primary hover:underline">
                    info@returnfilers.in
                  </a>
                </p>
              </section>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Last Updated: January 26, 2026
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;
