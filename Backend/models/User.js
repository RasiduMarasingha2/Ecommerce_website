const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    accountId: { type: String, default: () => Math.floor(10000 + Math.random() * 90000).toString() },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    phone: { type: String },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
    preferences: { type: [String], default: [] }, // AI input
    recommendationAnswers: { type: Map, of: String }, // AI prolog answers
    sellerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    adminProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

// Password Hashing Middleware
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
