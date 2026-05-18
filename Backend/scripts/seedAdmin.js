require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');
const User = require('../models/User');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB connected for seeding.');

       
        let adminUser = await User.findOne({ email: 'admin@admin.com' });

        if (adminUser) {
            console.log('Admin user already exists.');
        } else {
            adminUser = await User.create({
                name: 'Super Admin',
                email: 'admin@admin.com',
                password: 'admin123', 
                role: 'admin'
            });
            console.log('Admin user created successfully.');
        }

       
        let adminProfile = await Admin.findOne({ user: adminUser._id });
        if (!adminProfile) {
            adminProfile = await Admin.create({
                user: adminUser._id,
                accessLevel: 'superadmin',
                permissions: ['all']
            });
            console.log('Admin profile created successfully.');
            
            adminUser.adminProfile = adminProfile._id;
            await adminUser.save();
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
