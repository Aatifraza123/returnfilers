import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaCalculator, FaRupeeSign, FaArrowRight, FaCheckCircle,
  FaFileInvoiceDollar, FaBuilding, FaShoppingCart
} from 'react-icons/fa';

const Calculator = () => {
  const [activeCalculator, setActiveCalculator] = useState('tax');
  
  // Tax Savings Calculator
  const [taxIncome, setTaxIncome] = useState('');
  const [taxDeductions, setTaxDeductions] = useState('');
  const [taxSavings, setTaxSavings] = useState(null);

  // GST Calculator
  const [gstAmount, setGstAmount] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [gstResult, setGstResult] = useState(null);

  // Business Setup Cost Calculator
  const [businessType, setBusinessType] = useState('pvt-ltd');
  const [businessCost, setBusinessCost] = useState(null);

  const calculateTaxSavings = () => {
    const income = parseFloat(taxIncome) || 0;
    const deductions = parseFloat(taxDeductions) || 0;
    const taxableIncome = income - deductions;
    
    let tax = 0;
    if (taxableIncome > 1500000) {
      tax = (taxableIncome - 1500000) * 0.30 + 187500;
    } else if (taxableIncome > 1200000) {
      tax = (taxableIncome - 1200000) * 0.20 + 127500;
    } else if (taxableIncome > 900000) {
      tax = (taxableIncome - 900000) * 0.15 + 82500;
    } else if (taxableIncome > 600000) {
      tax = (taxableIncome - 600000) * 0.10 + 52500;
    } else if (taxableIncome > 300000) {
      tax = (taxableIncome - 300000) * 0.05 + 37500;
    } else if (taxableIncome > 250000) {
      tax = (taxableIncome - 250000) * 0.05;
    }

    const taxWithoutDeductions = income > 1500000 ? (income - 1500000) * 0.30 + 187500 : 
                                  income > 1200000 ? (income - 1200000) * 0.20 + 127500 :
                                  income > 900000 ? (income - 900000) * 0.15 + 82500 :
                                  income > 600000 ? (income - 600000) * 0.10 + 52500 :
                                  income > 300000 ? (income - 300000) * 0.05 + 37500 :
                                  income > 250000 ? (income - 250000) * 0.05 : 0;

    const savings = taxWithoutDeductions - tax;
    
    setTaxSavings({
      taxableIncome: taxableIncome.toFixed(2),
      taxPayable: tax.toFixed(2),
      savings: savings.toFixed(2),
      effectiveRate: ((tax / income) * 100).toFixed(2)
    });
  };

  const calculateGST = () => {
    const amount = parseFloat(gstAmount) || 0;
    const rate = parseFloat(gstRate) || 0;
    const gst = (amount * rate) / 100;
    const total = amount + gst;

    setGstResult({
      baseAmount: amount.toFixed(2),
      gstAmount: gst.toFixed(2),
      totalAmount: total.toFixed(2),
      rate: rate
    });
  };

  const calculateBusinessCost = () => {
    const costs = {
      'pvt-ltd': { registration: 15000, compliance: 25000, total: 40000 },
      'llp': { registration: 10000, compliance: 15000, total: 25000 },
      'partnership': { registration: 5000, compliance: 8000, total: 13000 },
      'proprietorship': { registration: 3000, compliance: 5000, total: 8000 }
    };

    setBusinessCost(costs[businessType]);
  };

  const calculators = [
    { id: 'tax', name: 'Tax Savings', icon: <FaFileInvoiceDollar /> },
    { id: 'gst', name: 'GST Calculator', icon: <FaRupeeSign /> },
    { id: 'business', name: 'Business Setup', icon: <FaBuilding /> }
  ];

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
              <FaCalculator className="text-primary text-2xl" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            Financial Calculators
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Calculate your tax savings, GST, and business setup costs instantly
          </p>
        </div>
      </section>

      {/* Calculator Tabs */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-wrap justify-center gap-4">
            {calculators.map((calc) => (
              <button
                key={calc.id}
                onClick={() => setActiveCalculator(calc.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeCalculator === calc.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {calc.icon}
                {calc.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* Tax Savings Calculator */}
          {activeCalculator === 'tax' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tax Savings Calculator</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Annual Income (₹)
                  </label>
                  <input
                    type="number"
                    value={taxIncome}
                    onChange={(e) => setTaxIncome(e.target.value)}
                    placeholder="e.g., 1000000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Deductions (₹)
                  </label>
                  <input
                    type="number"
                    value={taxDeductions}
                    onChange={(e) => setTaxDeductions(e.target.value)}
                    placeholder="e.g., 150000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include 80C, 80D, HRA, and other deductions
                  </p>
                </div>

                <button
                  onClick={calculateTaxSavings}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary hover:text-primary transition-all"
                >
                  Calculate Tax Savings
                </button>

                {taxSavings && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Results:</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxable Income:</span>
                        <span className="font-bold text-gray-900">₹{parseFloat(taxSavings.taxableIncome).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax Payable:</span>
                        <span className="font-bold text-gray-900">₹{parseFloat(taxSavings.taxPayable).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-3">
                        <span className="text-gray-600 font-semibold">Tax Savings:</span>
                        <span className="font-bold text-secondary text-xl">₹{parseFloat(taxSavings.savings).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Effective Tax Rate:</span>
                        <span className="font-bold text-gray-900">{taxSavings.effectiveRate}%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* GST Calculator */}
          {activeCalculator === 'gst' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">GST Calculator</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Base Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={gstAmount}
                    onChange={(e) => setGstAmount(e.target.value)}
                    placeholder="e.g., 10000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GST Rate (%)
                  </label>
                  <select
                    value={gstRate}
                    onChange={(e) => setGstRate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>

                <button
                  onClick={calculateGST}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary hover:text-primary transition-all"
                >
                  Calculate GST
                </button>

                {gstResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Results:</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Amount:</span>
                        <span className="font-bold text-gray-900">₹{parseFloat(gstResult.baseAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST ({gstResult.rate}%):</span>
                        <span className="font-bold text-gray-900">₹{parseFloat(gstResult.gstAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-3">
                        <span className="text-gray-600 font-semibold">Total Amount:</span>
                        <span className="font-bold text-secondary text-xl">₹{parseFloat(gstResult.totalAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Business Setup Cost Calculator */}
          {activeCalculator === 'business' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Setup Cost Calculator</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="pvt-ltd">Private Limited Company</option>
                    <option value="llp">Limited Liability Partnership (LLP)</option>
                    <option value="partnership">Partnership Firm</option>
                    <option value="proprietorship">Sole Proprietorship</option>
                  </select>
                </div>

                <button
                  onClick={calculateBusinessCost}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary hover:text-primary transition-all"
                >
                  Calculate Setup Cost
                </button>

                {businessCost && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Estimated Costs:</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registration Fees:</span>
                        <span className="font-bold text-gray-900">₹{businessCost.registration.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">First Year Compliance:</span>
                        <span className="font-bold text-gray-900">₹{businessCost.compliance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-3">
                        <span className="text-gray-600 font-semibold">Total Cost:</span>
                        <span className="font-bold text-secondary text-xl">₹{businessCost.total.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      * Costs are approximate and may vary based on specific requirements
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
            Need Expert Advice?
          </h2>
          <p className="text-gray-600 mb-8">
            Get personalized consultation from our tax and business experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm md:text-base bg-secondary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-md"
            >
              Get Custom Quote <FaArrowRight size={12} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm md:text-base border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Calculator;

