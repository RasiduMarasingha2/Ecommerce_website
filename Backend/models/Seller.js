const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeName: { type: String, required: true, unique: true },
    sellerVerification: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    revenue: { type: Number, default: 0 },
    analytics: {
        totalViews: { type: Number, default: 0 },
        totalSales: { type: Number, default: 0 }
    }
}, { timestamps: true });

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;
