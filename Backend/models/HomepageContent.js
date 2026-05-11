const mongoose = require('mongoose');

const homepageContentSchema = new mongoose.Schema({
    heroTitle: { type: String, default: 'Welcome to Our Store' },
    heroSubtitle: { type: String, default: 'Discover the best products at unbeatable prices.' },
    heroImage: { type: String },
    announcementText: { type: String },
    announcementLink: { type: String },
    featuredCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    featuredProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    footerText: { type: String, default: '© 2026 E-commerce. All rights reserved.' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const HomepageContent = mongoose.model('HomepageContent', homepageContentSchema);
module.exports = HomepageContent;
