const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accessLevel: { type: String, enum: ['superadmin', 'moderator'], default: 'superadmin' },
    permissions: [{ type: String }]
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
