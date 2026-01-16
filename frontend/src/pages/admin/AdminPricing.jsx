import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FaPlus, FaEdit, FaTrash, FaStar, FaRupeeSign, FaCheck, FaTimes,
  FaFileInvoiceDollar, FaBalanceScale, FaBuilding, FaChartLine
} from 'react-icons/fa';

const AdminPricing = () => {
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    category: 'tax',
    categoryTitle: 'Tax Filing Services',
    categoryIcon: 'FaFileInvoiceDollar',
    name: '',
    price: '',
    popular: false,
    description: '',
    features: [''],
    notIncluded: [''],
    billingCycle: 'one-time',
    active: true,
    order: 0,
  });

  const categories = [
    { value: 'tax', label: 'Tax Filing', icon: 'FaFileInvoiceDollar', title: 'Tax Filing Services' },
    { value: 'gst', label: 'GST Services', icon: 'FaBalanceScale', title: 'GST Services' },
    { value: 'company', label: 'Company Registration', icon: 'FaBuilding', title: 'Company Registration' },
    { value: 'advisory', label: 'Advisory', icon: 'FaChartLine', title: 'Advisory Services' },
  ];

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const { data } = await api.get('/pricing/admin/all');
      if (data.success) {
        setPricingPlans(data.data);
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Failed to load pricing plans');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find(cat => cat.value === e.target.value);
    setFormData(prev => ({
      ...prev,
      category: selectedCategory.value,
      categoryTitle: selectedCategory.title,
      categoryIcon: selectedCategory.icon,
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleNotIncludedChange = (index, value) => {
    const newNotIncluded = [...formData.notIncluded];
    newNotIncluded[index] = value;
    setFormData(prev => ({ ...prev, notIncluded: newNotIncluded }));
  };

  const addNotIncluded = () => {
    setFormData(prev => ({ ...prev, notIncluded: [...prev.notIncluded, ''] }));
  };

  const removeNotIncluded = (index) => {
    setFormData(prev => ({
      ...prev,
      notIncluded: prev.notIncluded.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty features and notIncluded
    const cleanedData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== ''),
      notIncluded: formData.notIncluded.filter(n => n.trim() !== ''),
    };

    try {
      if (editingPlan) {
        await api.put(`/pricing/${editingPlan._id}`, cleanedData);
        toast.success('Pricing plan updated successfully');
      } else {
        await api.post('/pricing', cleanedData);
        toast.success('Pricing plan created successfully');
      }
      fetchPricing();
      closeModal();
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Failed to save pricing plan');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      category: plan.category,
      categoryTitle: plan.categoryTitle,
      categoryIcon: plan.categoryIcon,
      name: plan.name,
      price: plan.price,
      popular: plan.popular,
      description: plan.description,
      features: plan.features.length > 0 ? plan.features : [''],
      notIncluded: plan.notIncluded.length > 0 ? plan.notIncluded : [''],
      billingCycle: plan.billingCycle,
      active: plan.active,
      order: plan.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing plan?')) return;
    
    try {
      await api.delete(`/pricing/${id}`);
      toast.success('Pricing plan deleted successfully');
      fetchPricing();
    } catch (error) {
      console.error('Error deleting pricing:', error);
      toast.error('Failed to delete pricing plan');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({
      category: 'tax',
      categoryTitle: 'Tax Filing Services',
      categoryIcon: 'FaFileInvoiceDollar',
      name: '',
      price: '',
      popular: false,
      description: '',
      features: [''],
      notIncluded: [''],
      billingCycle: 'one-time',
      active: true,
      order: 0,
    });
  };

  const filteredPlans = filterCategory === 'all' 
    ? pricingPlans 
    : pricingPlans.filter(plan => plan.category === filterCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
        >
          <FaPlus /> Add Pricing Plan
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filterCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setFilterCategory(cat.value)}
            className={`px-4 py-2 rounded-lg font-medium ${
              filterCategory === cat.value
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Pricing Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <motion.div
            key={plan._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-lg border-2 p-6 ${
              plan.popular ? 'border-secondary' : 'border-gray-200'
            } ${!plan.active ? 'opacity-50' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">{plan.categoryTitle}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{plan.name}</h3>
              </div>
              {plan.popular && (
                <span className="flex items-center gap-1 text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">
                  <FaStar size={10} /> POPULAR
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-primary">₹{plan.price}</span>
              {plan.billingCycle !== 'one-time' && (
                <span className="text-gray-500 text-sm">/{plan.billingCycle}</span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {plan.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <FaCheck className="text-secondary mt-1 flex-shrink-0" size={12} />
                  <span>{feature}</span>
                </div>
              ))}
              {plan.features.length > 3 && (
                <p className="text-xs text-gray-500">+{plan.features.length - 3} more features</p>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEdit(plan)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
              >
                <FaEdit size={12} /> Edit
              </button>
              <button
                onClick={() => handleDelete(plan._id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
              >
                <FaTrash size={12} /> Delete
              </button>
            </div>

            {!plan.active && (
              <div className="mt-2 text-center text-xs text-red-500 font-semibold">
                INACTIVE
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No pricing plans found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-5 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingPlan ? 'Edit Pricing Plan' : 'Add Pricing Plan'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Category, Name & Price in one row */}
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                    placeholder="e.g. Basic ITR"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                    placeholder="999"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                  placeholder="Brief description of the plan"
                  required
                />
              </div>

              {/* Billing Cycle, Order & Checkboxes */}
              <div className="grid md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Billing Cycle</label>
                  <select
                    name="billingCycle"
                    value={formData.billingCycle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                  >
                    <option value="one-time">One-time</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="popular"
                      checked={formData.popular}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-gray-700">Popular</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              {/* Features & Not Included in 2 columns */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Features */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Features (Included)</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-secondary"
                          placeholder="Feature"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-2 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-xs text-secondary font-semibold hover:underline mt-2"
                  >
                    + Add Feature
                  </button>
                </div>

                {/* Not Included */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Not Included (Optional)</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {formData.notIncluded.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleNotIncludedChange(index, e.target.value)}
                          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-secondary"
                          placeholder="Excluded feature"
                        />
                        <button
                          type="button"
                          onClick={() => removeNotIncluded(index)}
                          className="px-2 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addNotIncluded}
                    className="text-xs text-secondary font-semibold hover:underline mt-2"
                  >
                    + Add Excluded
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3 border-t">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm bg-secondary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPricing;
