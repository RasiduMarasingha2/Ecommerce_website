const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config({ path: '../.env' });

async function check() {
    await mongoose.connect(process.env.MONGODB_URL);
    const p = await Product.findOne().populate('category');
    console.log(JSON.stringify(p, null, 2));
    process.exit(0);
}
check();
