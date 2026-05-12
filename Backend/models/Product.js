const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: String, default: () => Math.floor(10000 + Math.random() * 90000).toString() },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    model3D: { type: String }, // Cloudinary URL for .glb/.gltf
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    variants: [{
        name: String,
        options: [String]
    }],
    colors: [String],
    sizes: [String],
    tags: [String],
    discount: { type: Number, default: 0 },
    analytics: {
        views: { type: Number, default: 0 },
        purchases: { type: Number, default: 0 }
    },
    inFlashSale: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
