require('dotenv').config();
const cloudinary = require('./Backend/config/cloudinary');

async function testCloudinary() {
    try {
        const result = await cloudinary.api.ping();
        console.log("Cloudinary Connection Success:", result);
    } catch (err) {
        console.error("Cloudinary Connection Failed:", err);
    }
}

testCloudinary();
