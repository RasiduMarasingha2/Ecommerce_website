require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');
const User = require('../models/User');
const Seller = require('../models/Seller');

const seedSeller = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB connected for seeding seller.');

        
        await User.deleteOne({ email: 'seller@seller.com' });
        await Seller.deleteOne({ storeName: 'Premium Seller Store' });

        
        const sellerUser = await User.create({
            name: 'Default Seller',
            email: 'seller@seller.com',
            password: 'seller123',
            role: 'seller',
            phone: '0712345678'
        });

        console.log('Seller user created successfully.');

        // Create Seller Profile
        const sellerProfile = await Seller.create({
            user: sellerUser._id,
            storeName: 'Premium Seller Store',
            sellerVerification: 'approved',
            revenue: 0,
            analytics: {
                totalViews: 0,
                totalSales: 0
            }
        });

        
        sellerUser.sellerProfile = sellerProfile._id;
        await sellerUser.save();

        console.log('Seller profile created successfully.');
        console.log('Seeding complete. You can login with seller@seller.com / seller123');
        process.exit();
    } catch (error) {
        console.error('Error seeding seller:', error);
        process.exit(1);
    }
};

seedSeller();
