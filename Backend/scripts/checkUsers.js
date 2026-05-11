require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');
const User = require('../models/User');

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        const users = await User.find({});
        users.forEach(u => console.log(`Email: ${u.email}, Password Hash: ${u.password}`));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
checkUsers();
