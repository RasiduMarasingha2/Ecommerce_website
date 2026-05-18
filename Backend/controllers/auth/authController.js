const User = require('../../models/User');
const Seller = require('../../models/Seller');
const generateToken = require('../../utils/generateToken');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');


const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            return next(new Error('User already exists'));
        }

        const user = await User.create({ name, email, password, role, phone });

        if (user) {
            generateToken(res, user._id, user.role);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                accountId: user.accountId,
            });
        } else {
            res.status(400);
            next(new Error('Invalid user data'));
        }
    } catch (error) {
        next(error);
    }
};


const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id, user.role);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                accountId: user.accountId,
            });
        } else {
            res.status(401);
            next(new Error('Invalid email or password'));
        }
    } catch (error) {
        next(error);
    }
};


const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};


const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

        if (!user) {
            res.status(404);
            return next(new Error('User with this email does not exist'));
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP and set expiry (10 mins)
        user.resetPasswordOTP = crypto.createHash('sha256').update(otp).digest('hex');
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                <h2 style="color: #008000;">Password Reset Request</h2>
                <p>Hello ${user.name},</p>
                <p>You requested to reset your password. Here is your 6-digit OTP code:</p>
                <h1 style="color: #000; background: #fff; padding: 10px 20px; display: inline-block; border-radius: 8px; border: 1px solid #ddd; letter-spacing: 5px;">${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        `;
           
        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP - ECOMMERCE',
                html
            });
            res.status(200).json({ message: 'OTP sent to email successfully' });
        } catch (error) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.status(500);
            return next(new Error('Email could not be sent'));
        }

    } catch (error) {
        next(error);
    }
};


const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email: new RegExp(`^${email}$`, 'i'),
            resetPasswordOTP: hashedOTP,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400);
            return next(new Error('Invalid or expired OTP'));
        }

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        next(error);
    }
};


const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email: new RegExp(`^${email}$`, 'i'),
            resetPasswordOTP: hashedOTP,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400);
            return next(new Error('Invalid or expired OTP'));
        }

        
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        next(error);
    }
};


const registerSeller = async (req, res, next) => {
    try {
        const { name, email, password, phone, storeName } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            return next(new Error('User already exists'));
        }

        const storeExists = await Seller.findOne({ storeName });
        if (storeExists) {
            res.status(400);
            return next(new Error('Store name already exists. Please choose another one.'));
        }

     
        const user = await User.create({ name, email, password, role: 'seller', phone });

        if (user) {
           
            const sellerProfile = await Seller.create({
                user: user._id,
                storeName: storeName,
                sellerVerification: 'pending',
                revenue: 0,
                analytics: { totalViews: 0, totalSales: 0 }
            });

          
            user.sellerProfile = sellerProfile._id;
            await user.save();

            generateToken(res, user._id, user.role);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                accountId: user.accountId,
                storeName: sellerProfile.storeName
            });
        } else {
            res.status(400);
            next(new Error('Invalid user data'));
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser, logoutUser, forgotPassword, verifyOTP, resetPassword, registerSeller };
