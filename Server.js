
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require('dns');
dns.setServers(["1.1.1.1","8.8.8.8"]);

// 1. Load Environment Variables
dotenv.config();    

const app = express();
const port = process.env.PORT || 8070;

// 2. Middlewares
app.use(cors());
app.use(bodyParser.json());

// 3. MongoDB Connection
const URL = process.env.MONGODB_URL;


mongoose.connect(URL)
    .then(() => {
        console.log("MongoDB connection success! ");
    })
    .catch((err) => {
        console.error("MongoDB connection error", err);
        console.error("Please check your MongoDB connection string and ensure that your database server is running.");
    });

   

// 4. Start Server
app.listen(port, () => {
    console.log(`Server is up and running on port number: ${port}`);
});