import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaCheck, FaTimes, FaRupeeSign, FaStar, FaArrowRight,
  FaFileInvoiceDollar, FaBuilding, FaBalanceScale, FaChartLine
} from 'react-icons/fa';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('one-time');
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeService, setActiveService] = useState('tax');

  // Icon mapping
  const iconMap = {
    FaFileInvoiceDollar: <FaFileInvoiceDollar />,
    FaBalanceScale: <FaBalanceScale />,
    FaBuilding: <FaBuilding />,
    FaChartLine: <FaChartLine />,
  };

  // Fetch pricing data from backend
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data } = await api.get('/pricing');
        if (data.success) {
          setPricingData(data.data);
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
        toast.error('Failed to load pricing plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  // Group pricing by category
  const pricingPlans = pricingData.reduce((acc, plan) => {
    if (!acc[plan.category]) {
      acc[plan.category] = {
        title: plan.categoryTitle,
        icon: iconMap[plan.categoryIcon] || <FaRupeeSign />,
        plans: []
      };
    }
    acc[plan.category].plans.push(plan);
    return acc;
  }, {});

  // Get unique categories
  const categories = Object.keys(pricingPlans);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <main className="font-sans bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary py-12 md:py-16 pt-20 md:pt-28">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <FaRupeeSign className="text-primary text-2xl" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            Transparent Pricing
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            No hidden charges. Clear, upfront pricing for all our services
          </p>
        </div>
      </section>

      {/* Service Tabs */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((key) => (
              <button
                key={key}
                onClick={() => setActiveService(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeService === key
                    ? 'border-secondary bg-secondary/10 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`text-2xl mb-2 ${activeService === key ? 'text-secondary' : 'text-gray-600'}`}>
                  {pricingPlans[key].icon}
                </div>
                <h3 className={`text-sm font-bold ${activeService === key ? 'text-primary' : 'text-gray-700'}`}>
                  {pricingPlans[key].title}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {pricingPlans[activeService] && pricingPlans[activeService].plans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans[activeService].plans.map((plan, index) => (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                    plan.popular
                      ? 'border-2 border-secondary shadow-2xl scale-105'
                      : 'border border-gray-200 hover:border-secondary/50 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-secondary text-primary px-4 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1">
                      <FaStar size={10} /> POPULAR
                    </div>
                  )}

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-4xl font-bold text-primary">₹{plan.price}</span>
                      {plan.billingCycle === 'monthly' && (
                        <span className="text-gray-500 text-sm">/month</span>
                      )}
                      {plan.billingCycle === 'yearly' && (
                        <span className="text-gray-500 text-sm">/year</span>
                      )}
                    </div>

                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <FaCheck className="text-secondary mt-1 flex-shrink-0" size={14} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded && plan.notIncluded.length > 0 && (
                        <>
                          {plan.notIncluded.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3 opacity-50">
                              <FaTimes className="text-gray-400 mt-1 flex-shrink-0" size={14} />
                              <span className="text-sm text-gray-500">{feature}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    <Link
                      to="/quote"
                      className={`block w-full py-3 rounded-lg font-semibold text-center transition-all ${
                        plan.popular
                          ? 'bg-secondary text-primary hover:bg-primary hover:text-white'
                          : 'bg-primary text-white hover:bg-secondary hover:text-primary'
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No pricing plans available for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-serif font-bold text-center text-gray-900 mb-12">
            What's Included in All Plans
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-secondary text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">100% Compliance</h3>
              <p className="text-gray-600 text-sm">
                All filings done as per latest regulations and guidelines
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-secondary text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600 text-sm">
                Dedicated tax consultants available for all your queries
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-secondary text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Confidential</h3>
              <p className="text-gray-600 text-sm">
                Bank-grade encryption for all your financial data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-3">
            Need a Custom Package?
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Every business is unique. Get a personalized quote tailored to your specific needs
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm md:text-base bg-secondary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-md"
            >
              Get Custom Quote <FaArrowRight size={12} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm md:text-base border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Pricing;

