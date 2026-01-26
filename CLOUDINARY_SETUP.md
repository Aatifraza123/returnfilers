# Cloudinary Image Upload Setup

## ✅ Features Added:
- **Image Upload**: Admin can upload service images
- **Cloudinary Storage**: Images stored in cloud
- **Auto Delete**: Old images automatically removed when updated
- **Optimized**: Images auto-resized and optimized

## 🔧 Setup Instructions:

### 1. Install Cloudinary Package:
```bash
cd backend
npm install cloudinary
```

### 2. Get Cloudinary Credentials:
1. Go to: https://cloudinary.com/
2. Sign up / Login
3. Go to Dashboard
4. Copy:
   - **Cloud Name**: (already set: `derzj7d4u`)
   - **API Key**: Copy from dashboard
   - **API Secret**: Copy from dashboard

### 3. Update .env File:
```env
CLOUDINARY_CLOUD_NAME=derzj7d4u
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 📸 How It Works:

### **Admin Panel - Add/Edit Service:**
1. **Upload Image**: Select image file
2. **Auto Upload**: Image uploads to Cloudinary
3. **URL Saved**: Cloudinary URL saved in database
4. **Display**: Image shows on website

### **Update Service:**
1. **New Image**: Upload new image
2. **Auto Delete**: Old image deleted from Cloudinary
3. **New URL**: New image URL saved
4. **Seamless**: No manual cleanup needed

### **Delete Service:**
1. **Service Deleted**: Service removed from database
2. **Image Deleted**: Image automatically removed from Cloudinary
3. **Clean**: No orphaned images left

## 🎯 Technical Details:

### **Image Optimization:**
- **Max Size**: 800x600px
- **Quality**: Auto-optimized
- **Format**: Auto (WebP for modern browsers)
- **Folder**: `returnfilers/services/`

### **Supported Formats:**
- JPG/JPEG
- PNG
- WebP
- GIF

### **File Size:**
- **Recommended**: Under 2MB
- **Max**: 10MB

## 🔐 Security:
- **API Keys**: Stored in .env (never committed)
- **Signed URLs**: Secure upload/delete
- **Access Control**: Only admin can upload

## 📊 Database Schema:
```javascript
{
  image: String,          // Cloudinary URL
  imagePublicId: String   // For deletion
}
```

## 🚀 Deployment:

### **VPS Setup:**
```bash
# 1. Update code
git pull origin main

# 2. Install cloudinary
npm install

# 3. Add credentials to .env
nano .env
# Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET

# 4. Restart backend
pm2 restart backend
```

## ✅ Testing:
1. **Upload**: Add service with image
2. **Update**: Change image, check old one deleted
3. **Delete**: Remove service, check image deleted
4. **View**: Check image displays on website

## 🎉 Benefits:
- ✅ **Fast Loading**: CDN delivery
- ✅ **Auto Optimization**: Better performance
- ✅ **No Storage Issues**: Cloud-based
- ✅ **Auto Cleanup**: No manual deletion needed
- ✅ **Responsive**: Auto-sized for devices