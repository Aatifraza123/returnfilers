const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {string} base64Image - Base64 encoded image
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<object>} - Upload result with URL and public_id
 */
const uploadImage = async (base64Image, folder = 'services') => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: `returnfilers/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<object>} - Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    if (!publicId) return { result: 'ok' };
    
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('🗑️ Cloudinary image deleted:', publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Don't throw error, just log it
    return { result: 'error', error: error.message };
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // Extract public_id from URL
    // Example: https://res.cloudinary.com/derzj7d4u/image/upload/v1234567890/returnfilers/services/abc123.jpg
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload/v123456789/'
    const pathParts = parts.slice(uploadIndex + 2); // Skip 'upload' and version
    const publicIdWithExt = pathParts.join('/');
    
    // Remove file extension
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  extractPublicId,
  cloudinary
};
