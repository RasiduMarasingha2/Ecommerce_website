const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ecommerce/products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
});

const modelStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ecommerce/models',
        allowed_formats: ['glb', 'gltf', 'obj'],
        resource_type: 'raw' // Required for non-image files in Cloudinary
    }
});

const uploadImage = multer({ storage: imageStorage });
const uploadModel = multer({ storage: modelStorage });

module.exports = { uploadImage, uploadModel };
