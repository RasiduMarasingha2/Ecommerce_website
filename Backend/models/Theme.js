const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    primaryColor: { type: String, default: '#3B82F6' }, // blue-500
    secondaryColor: { type: String, default: '#10B981' }, // emerald-500
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#111827' },
    fontFamily: { type: String, default: 'Inter, sans-serif' },
    buttonStyle: { type: String, enum: ['rounded', 'square', 'pill'], default: 'rounded' },
    mode: { type: String, enum: ['light', 'dark'], default: 'light' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Theme = mongoose.model('Theme', themeSchema);
module.exports = Theme;
