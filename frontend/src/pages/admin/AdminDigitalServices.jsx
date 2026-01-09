import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes, FaCode, FaChartBar } from 'react-icons/fa';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminDigitalServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: 'FaCode',
    price: '',
    timeline: '',
    description: '',
    features: [''],
    packages: [],
    active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/digital-services');
      setServices(data.services || []);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const addPackage = () => {
    setFormData({
      ...formData,
      packages: [
        ...formData.packages,
        { name: '', price: '', timeline: '', features: [''] }
      ]
    });
  };

  const removePackage = (index) => {
    const newPackages = formData.packages.filter((_, i) => i !== index);
    setFormData({ ...formData, packages: newPackages });
  };

  const handlePackageChange = (pkgIndex, field, value) => {
    const newPackages = [...formData.packages];
    newPackages[pkgIndex][field] = value;
    setFormData({ ...formData, packages: newPackages });
  };

  const handlePackageFeatureChange = (pkgIndex, featureIndex, value) => {
    const newPackages = [...formData.packages];
    newPackages[pkgIndex].features[featureIndex] = value;
    setFormData({ ...formData, packages: newPackages });
  };

  const addPackageFeature = (pkgIndex) => {
    const newPackages = [...formData.packages];
    newPackages[pkgIndex].features.push('');
    setFormData({ ...formData, packages: newPackages });
  };

  const removePackageFeature = (pkgIndex, featureIndex) => {
    const newPackages = [...formData.packages];
    newPackages[pkgIndex].features = newPackages[pkgIndex].features.filter((_, i) => i !== featureIndex);
    setFormData({ ...formData, packages: newPackages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredFeatures = formData.features.filter(f => f.trim() !== '');
      const dataToSend = { ...formData, features: filteredFeatures };

      if (editMode) {
        await api.put(`/digital-services/${currentService._id}`, dataToSend);
        toast.success('Service updated successfully');
      } else {
        await api.post('/digital-services', dataToSend);
        toast.success('Service created successfully');
      }
      
      fetchServices();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      icon: service.icon,
      price: service.price,
      timeline: service.timeline,
      description: service.description,
      features: service.features.length > 0 ? service.features : [''],
      packages: service.packages || [],
      active: service.active
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Delete Service?</p>
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/digital-services/${id}`);
                toast.success('Service deleted successfully');
                fetchServices();
              } catch (error) {
                toast.error('Failed to delete service');
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      slug: '',
      icon: 'FaCode',
      price: '',
      timeline: '',
      description: '',
      features: [''],
      packages: [],
      active: true
    });
    setEditMode(false);
    setCurrentService(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentService(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0B1530]">Digital Services</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B1530] text-white rounded-lg hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors"
        >
          <FaPlus /> Add Service
        </button>
      </div>

      <div className="space-y-6">
        {services.map((service) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
          >
            {/* Service Header */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0B1530] rounded-lg flex items-center justify-center text-[#C9A227] text-xl">
                    {service.icon === 'FaCode' ? <FaCode /> : <FaChartBar />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1530]">{service.title}</h3>
                    <p className="text-sm text-gray-500">{service.timeline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    service.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-3">{service.description}</p>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <FaEdit /> Edit Service
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>

            {/* Packages */}
            {service.packages && service.packages.length > 0 && (
              <div className="p-6">
                <h4 className="font-bold text-[#0B1530] mb-4 flex items-center gap-2">
                  <span className="text-[#C9A227]">📦</span> Packages ({service.packages.length})
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {service.packages.map((pkg, idx) => (
                    <div key={idx} className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#C9A227] transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-[#0B1530] text-sm">{pkg.name}</h5>
                        {pkg.name === 'Business Website' && (
                          <span className="text-xs bg-[#C9A227] text-white px-2 py-0.5 rounded-full">Popular</span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-[#C9A227] mb-1">₹{pkg.price}</p>
                      <p className="text-xs text-gray-500 mb-3">{pkg.timeline}</p>
                      <ul className="space-y-1">
                        {pkg.features.slice(0, 3).map((feature, fIdx) => (
                          <li key={fIdx} className="text-xs text-gray-600 flex items-start gap-1">
                            <span className="text-[#C9A227] mt-0.5">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                        {pkg.features.length > 3 && (
                          <li className="text-xs text-gray-400 italic">+{pkg.features.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No digital services found. Add your first service!
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0B1530]">
                {editMode ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-500">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="web-development"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Icon</label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                  >
                    <option value="FaCode">Code (Web Dev)</option>
                    <option value="FaChartBar">Chart (Data Analysis)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="14999"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Timeline *</label>
                  <input
                    type="text"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    required
                    placeholder="7-15 Days"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Feature description"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-sm text-[#C9A227] hover:text-[#0B1530] font-semibold"
                >
                  + Add Feature
                </button>
              </div>

              {/* Packages Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Packages (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addPackage}
                    className="text-sm px-3 py-1 bg-[#C9A227] text-[#0B1530] rounded-lg hover:bg-[#0B1530] hover:text-white font-semibold"
                  >
                    + Add Package
                  </button>
                </div>

                {formData.packages.map((pkg, pkgIndex) => (
                  <div key={pkgIndex} className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-[#0B1530]">Package {pkgIndex + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removePackage(pkgIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => handlePackageChange(pkgIndex, 'name', e.target.value)}
                        placeholder="Package Name"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={pkg.price}
                        onChange={(e) => handlePackageChange(pkgIndex, 'price', e.target.value)}
                        placeholder="Price (e.g., 9999)"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={pkg.timeline}
                        onChange={(e) => handlePackageChange(pkgIndex, 'timeline', e.target.value)}
                        placeholder="Timeline (e.g., 5-7 Days)"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-2 block">Package Features</label>
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handlePackageFeatureChange(pkgIndex, featureIndex, e.target.value)}
                            placeholder="Feature"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          {pkg.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePackageFeature(pkgIndex, featureIndex)}
                              className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs"
                            >
                              <FaTrash size={10} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addPackageFeature(pkgIndex)}
                        className="text-xs text-[#C9A227] hover:text-[#0B1530] font-semibold"
                      >
                        + Add Feature
                      </button>
                    </div>
                  </div>
                ))}

                {formData.packages.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No packages added. Click "+ Add Package" to create pricing tiers.</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#C9A227] focus:ring-[#C9A227]"
                />
                <label className="text-sm font-semibold text-gray-700">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#0B1530] text-white rounded-lg font-semibold hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors"
                >
                  {editMode ? 'Update Service' : 'Create Service'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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

export default AdminDigitalServices;
