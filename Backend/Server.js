const express = require("express");
const dns = require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const http = require("http");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const initSocket = require("./services/socket/socketHandler");


dotenv.config();


connectDB();

const app = express();
const server = http.createServer(app);


initSocket(server);


app.use(helmet());
app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174'
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", limiter);


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/seller", require("./routes/sellerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/recommendation", require("./routes/recommendationRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));


app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8070;

server.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});