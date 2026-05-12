const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config({ path: '../.env' });

async function check() {
    await mongoose.connect(process.env.MONGODB_URL);
    const products = await Product.find().populate('category');
    console.log(JSON.stringify(products, null, 2));
    process.exit(0);
}
check();
