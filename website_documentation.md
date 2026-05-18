# E-commerce Web Application - Comprehensive Documentation

This document provides a complete overview of your E-commerce website's functionalities, APIs, and overall system architecture. It is designed to give you all the technical details required to fully understand and explain the system during your presentation.

---

## 1. Project Overview

This web application is built using the **MERN Stack**:
* **MongoDB**: NoSQL database used for storing all application data.
* **Express.js & Node.js**: Used to build the robust backend server and RESTful APIs.
* **React.js**: Used for creating a dynamic and interactive Frontend (User Interface).

The system operates with 3 primary user roles:
1. **Customer**: Users who browse the website, add items to their cart, and make purchases.
2. **Seller**: Vendors who register on the platform to list and manage their products and orders.
3. **Admin**: The system administrator who oversees and controls the entire website, including users and sellers.

---

## 2. Database Models

Data is structured and stored in MongoDB using various Collections (Models). The core models include:

* **User**: Stores customer information (name, email, hashed password).
* **Seller**: Stores vendor details, store information, and business credentials.
* **Admin**: Stores administrator credentials and details.
* **Product**: Contains details of items for sale (name, price, images, stock quantity, description).
* **Category**: Organizes products into specific groups (e.g., Electronics, Clothing).
* **Order**: Stores billing and shipping details for completed purchases.
* **Cart**: Temporarily holds products that a customer intends to buy.
* **Review**: Stores customer ratings and feedback for specific products.
* **Offer**: Manages discounts and promotional offers applied to products.
* **Wishlist**: Stores a list of products a customer has saved for future purchase.

---

## 3. Backend APIs & Core Endpoints

The backend handles all the business logic and database interactions via RESTful APIs. Here are the primary routes and their functionalities:

### 1. Authentication APIs (`/api/auth`)
* `POST /login`: Authenticates users, sellers, and admins. It generates a JSON Web Token (JWT) that is saved securely in cookies for session management.
* `POST /register`: Registers a new customer into the database.

### 2. User APIs (`/api/users`)
* `GET /profile`: Retrieves the currently logged-in customer's profile information.
* `PUT /profile`: Allows a customer to update their personal details.

### 3. Product APIs (`/api/products`)
* `GET /`: Fetches a list of all active products (used on the Home and Shop pages).
* `GET /:id`: Retrieves the complete details of a specific product (used on the Product Details page).
* `POST /`: Allows authenticated sellers to create and list a new product.

### 4. Cart APIs (`/api/cart`)
* `GET /`: Retrieves the items currently in the logged-in customer's cart.
* `POST /add`: Adds a selected product to the user's cart.
* `DELETE /remove/:id`: Removes a specific item from the cart.

### 5. Order APIs (`/api/orders`)
* `POST /create`: Generates a new order when a customer successfully checks out.
* `GET /myorders`: Fetches the order history for the currently logged-in customer.

### 6. Seller APIs (`/api/seller`)
* `POST /register`: Registers a new seller (usually requires admin approval).
* `GET /dashboard`: Fetches vital statistics for the seller dashboard (e.g., total sales, product count).
* `GET /orders`: Retrieves a list of customer orders specifically for the seller's products.

### 7. Admin APIs (`/api/admin`)
* `GET /users`, `GET /sellers`: Retrieves a complete list of all registered customers and sellers.
* `DELETE /user/:id`: Allows the admin to remove or ban a user from the platform.
* `GET /dashboard`: Fetches overall website statistics for the admin dashboard.

### 8. Recommendation APIs (`/api/recommendation`)
* Analyzes customer preferences and purchase history to suggest personalized products using AI-powered recommendations.

---

## 4. KRL (Prolog) & AI Integration

This e-commerce platform leverages **Knowledge Representation Language (KRL)** through **Prolog** for intelligent product recommendations, combined with modern AI packages for enhanced user experience.

### 4.1 Prolog (KRL) - Intelligent Recommendation Engine

**What is Prolog?**
Prolog is a logic programming language used for knowledge representation and reasoning. In this project, it powers the intelligent product recommendation system by processing user preferences and product attributes through logical rules.

**Backend Service: `Backend/services/prologService.js`**
This service manages all Prolog interactions:
- **`syncProductFacts(products)`**: Dynamically generates Prolog facts from MongoDB product data
- **`getRecommendationsFromProlog(userId, preferences)`**: Executes Prolog queries to generate personalized recommendations

**KRL Knowledge Base Files (Backend/ai/):**
1. **`productFacts.pl`**: Contains dynamically generated product facts with attributes (ID, Name, Category, Budget, Brand, Purpose)
   ```prolog
   product('60d5ec49f1b2c8d1e9c3a1b2', 'Gaming Laptop', 'electronics', 'high', 'premium', 'gaming').
   product('60d5ec49f1b2c8d1e9c3a1b3', 'Budget Mouse', 'electronics', 'low', 'budget', 'work').
   ```

2. **`userFacts.pl`**: Stores user preferences dynamically during recommendation queries
   ```prolog
   user_pref('userId123', category, 'gaming').
   user_pref('userId123', budget, 'medium').
   ```

3. **`rules.pl`**: Contains core recommendation logic and rules for matching user preferences with products

4. **`recommendation.pl`**: Main recommendation engine that queries rules and returns ranked product suggestions

**How It Works:**
1. When a user requests recommendations, their preferences (category, budget, purpose, brand) are extracted
2. These preferences are injected as facts into Prolog dynamically using `assertz()`
3. The Prolog engine executes the recommendation query against product facts and rules
4. The system returns a ranked list of recommended products based on logical match scoring
5. The results are parsed from Prolog output and sent to the frontend

### 4.2 AI & Smart Features Packages

The backend incorporates several powerful packages to enhance AI and intelligent features:

**Image Intelligence & Processing:**
- **`cloudinary` (v1.41.3)**: Cloud-based image processing platform used for:
  - Uploading and storing product images securely
  - Image optimization and transformations
  - CDN delivery for faster image loading
  - Integrated with `multer-storage-cloudinary` for seamless file uploads

**Real-Time Communication:**
- **`socket.io` (v4.8.3)**: Enables real-time bidirectional communication for:
  - Live notifications (orders, offers, reviews)
  - Real-time order status updates
  - Seller-to-customer messaging capabilities
  - Implemented via `Backend/services/socket/socketHandler.js`

**Security & Data Protection (AI-related):**
- **`bcryptjs` (v3.0.3)**: Cryptographic hashing for:
  - Securing user passwords using salted hashing
  - Protecting credential data before storage in MongoDB
  - Enabling secure authentication without storing plaintext passwords

**Data Validation & Quality:**
- **`express-rate-limit` (v8.5.1)**: API rate limiting to prevent abuse and protect AI service endpoints
- **`helmet` (v8.1.0)**: Security middleware protecting application headers and preventing common attacks

**Email & User Engagement:**
- **`nodemailer` (v8.0.7)**: Transactional email service for:
  - Order confirmations and tracking
  - Personalized product recommendations sent via email
  - User engagement campaigns

**Core Dependencies:**
- **`express` (v5.2.1)**: REST API framework for serving recommendation and product APIs
- **`mongoose` (v9.6.1)**: MongoDB ODM for managing data required by the recommendation engine
- **`jsonwebtoken` (v9.0.3)**: JWT-based authentication securing API access
- **`multer` (v2.1.1)**: File upload middleware for product images
- **`morgan` (v1.10.1)**: HTTP request logging for debugging and analytics
- **`cookie-parser` (v1.4.7)**: Session management using secure cookies

### 4.3 Recommendation Controller Integration

**File: `Backend/controllers/recommendationController.js`**
- Handles `/api/recommendation` endpoints
- Receives user preferences from the frontend
- Calls `prologService.getRecommendationsFromProlog()`
- Returns personalized product recommendations based on KRL logic

**Sample Recommendation Flow:**
```javascript
// Frontend sends user preferences
GET /api/recommendation?category=gaming&budget=medium

// Backend processes through Prolog
1. Extract user preferences
2. Query Prolog with these preferences
3. Prolog engine matches against product facts and rules
4. Return sorted recommendations based on match score
5. Frontend displays personalized product suggestions
```

---

## 5. Dependencies & Packages Overview

### 5.1 Backend Packages (`Backend/package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| **express** | ^5.2.1 | Core web framework for building REST APIs |
| **mongoose** | ^9.6.1 | MongoDB object modeling & database connection |
| **jsonwebtoken** | ^9.0.3 | JWT authentication token generation & verification |
| **bcryptjs** | ^3.0.3 | Cryptographic hashing for secure password storage |
| **cors** | ^2.8.6 | Cross-Origin Resource Sharing middleware |
| **cookie-parser** | ^1.4.7 | Parse and manage HTTP cookies for sessions |
| **dotenv** | ^17.4.2 | Load environment variables from .env files |
| **helmet** | ^8.1.0 | Security middleware for setting HTTP headers |
| **express-rate-limit** | ^8.5.1 | Rate limiting to prevent API abuse |
| **morgan** | ^1.10.1 | HTTP request logging middleware |
| **multer** | ^2.1.1 | File upload handling middleware |
| **multer-storage-cloudinary** | ^4.0.0 | Cloudinary integration for file uploads |
| **cloudinary** | ^1.41.3 | Cloud image storage & manipulation service |
| **socket.io** | ^4.8.3 | Real-time bidirectional communication |
| **nodemailer** | ^8.0.7 | Email sending service for notifications |

**Backend Dev Dependencies:**
- Minimal setup; no dev dependencies specified for production

### 5.2 Frontend Packages (`Frontend/package.json`)

#### Core Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **react** | ^19.2.5 | Core library for building UI components |
| **react-dom** | ^19.2.5 | React rendering in the DOM |
| **vite** | ^8.0.10 | Lightning-fast build tool and dev server |
| **react-router-dom** | ^7.14.2 | Client-side routing between pages |
| **axios** | ^1.16.0 | HTTP client for API calls to backend |

#### State Management & Data
| Package | Version | Purpose |
|---------|---------|---------|
| **@reduxjs/toolkit** | ^2.11.2 | Modern Redux for global state management |
| **react-redux** | ^9.2.0 | React bindings for Redux state integration |

#### UI & Styling
| Package | Version | Purpose |
|---------|---------|---------|
| **tailwindcss** | ^4.2.4 | Utility-first CSS framework for styling |
| **@tailwindcss/vite** | ^4.2.4 | Vite plugin for Tailwind CSS |
| **@tailwindcss/postcss** | ^4.2.4 | PostCSS plugin for Tailwind (dev) |
| **react-icons** | ^5.6.0 | Icon library with popular icon sets |
| **sonner** | ^2.0.7 | Toast notifications & alerts |

#### Animations & Motion
| Package | Version | Purpose |
|---------|---------|---------|
| **framer-motion** | ^12.38.0 | Smooth animations and transitions |
| **gsap** | ^3.15.0 | High-performance animation library |

#### 3D Graphics & Visualization
| Package | Version | Purpose |
|---------|---------|---------|
| **three** | ^0.184.0 | 3D graphics library for WebGL |
| **@react-three/fiber** | ^9.6.1 | React renderer for Three.js |
| **@react-three/drei** | ^10.7.7 | Useful helpers & components for Fiber |
| **@splinetool/react-spline** | ^4.1.0 | Spline 3D design integration |
| **@splinetool/runtime** | ^1.12.92 | Spline runtime for 3D models |

#### Data Visualization
| Package | Version | Purpose |
|---------|---------|---------|
| **recharts** | ^3.8.1 | Composable charting library for dashboards |

#### Development Tools (devDependencies)
| Package | Version | Purpose |
|---------|---------|---------|
| **@vitejs/plugin-react** | ^6.0.1 | Vite plugin for React Fast Refresh |
| **eslint** | ^10.2.1 | Code quality & style linting |
| **@eslint/js** | ^10.0.1 | ESLint rules for JavaScript |
| **eslint-plugin-react-hooks** | ^7.1.1 | ESLint rules for React Hooks |
| **eslint-plugin-react-refresh** | ^0.5.2 | ESLint rules for React Fast Refresh |
| **autoprefixer** | ^10.5.0 | CSS vendor prefix auto-adding (PostCSS) |
| **postcss** | ^8.5.13 | CSS transformation engine |
| **@types/react** | ^19.2.14 | TypeScript types for React |
| **@types/react-dom** | ^19.2.3 | TypeScript types for React DOM |
| **globals** | ^17.5.0 | Global variables for ESLint |

---

## 6. Frontend Architecture

The user interface is built with **React.js** and styled using **Tailwind CSS**. **Redux Toolkit** is utilized for global state management (handling states like user authentication, cart data, etc.).

### Primary Pages
1. **Home (`/`)**: The landing page displaying new arrivals, offers, and categories.
2. **Login & Register (`/login`, `/register`)**: Pages for user authentication and onboarding.
3. **Product Details (`/product/:id`)**: Displays comprehensive product information, images, pricing, and user reviews.
4. **Checkout (`/checkout`)**: The final step in purchasing where users provide shipping and payment details.
5. **Register Seller (`/register-seller`)**: A dedicated onboarding page for new vendors.

### Dashboards
* **Customer Dashboard**: Where customers manage their profile, view past orders, and access their wishlist.
* **Seller Dashboard**: The vendor portal for adding new products, updating stock, and processing received orders.
* **Admin Dashboard**: The centralized control panel for managing users, approving sellers, and monitoring site activity.

---

## 7. Main Functions & User Flow

To effectively explain the system during your presentation, you can walk through these primary user journeys:

### 1. Customer Checkout Flow:
* **Step 1:** The customer browses the website and clicks on a product to view its details.
* **Step 2:** The customer clicks "Add to Cart" (Triggers the `/api/cart/add` API).
* **Step 3:** The customer navigates to their Cart and proceeds to Checkout.
* **Step 4:** On the Checkout page, they enter their shipping information and confirm the order.
* **Step 5:** The system validates the request and creates a new Order in the database (Triggers `/api/orders/create`).
* **Step 6:** The customer's cart is cleared, and they receive an order confirmation.

### 2. Seller Product Listing Flow:
* **Step 1:** A vendor registers on the platform via the Seller Registration page.
* **Step 2:** Once approved by the Admin, the Seller logs into their dashboard.
* **Step 3:** The Seller navigates to the "Add New Product" section.
* **Step 4:** They fill in the product details (name, price, stock) and upload images. (Images are securely uploaded to a cloud service like Cloudinary).
* **Step 5:** Upon submission, the new Product is saved to the database and becomes instantly visible to customers on the frontend.

---

## 8. Security & Best Practices
* **JWT Authentication**: Ensures secure, stateless authentication for all users via JSON Web Tokens.
* **Password Hashing**: Passwords are never stored in plain text; they are securely encrypted using `bcryptjs`.
* **Role-Based Access Control (RBAC)**: Private routes ensure that Customers cannot access Admin pages, and Sellers cannot access Customer data.
* **Secure Image Uploads**: Product images are handled safely using `multer` and `cloudinary` for optimized cloud storage.

---

## 9. Code Connection Examples (How Frontend talks to Backend)

Here is a practical look at how the code connects the Frontend to the Backend Database, using the **Fetch All Products** feature as an example.

### 1. Server Configuration (`Backend/Server.js`)
The main Express server maps the base URL (`/api/products`) to the specific route file.
```javascript
// Backend/Server.js
const express = require("express");
const app = express();

// Route configuration
app.use("/api/products", require("./routes/productRoutes"));
```

### 2. Route Definition (`Backend/routes/productRoutes.js`)
The Router maps the specific HTTP method (GET, POST, etc.) and URL path to a Controller function.
```javascript
// Backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');

// Maps GET /api/products/ to the getProducts controller
router.get('/', getProducts);

module.exports = router;
```

### 3. Controller Logic (`Backend/controllers/productController.js`)
The Controller interacts with the MongoDB database using Mongoose models. It fetches the data and sends it back to the client as JSON.
```javascript
// Backend/controllers/productController.js
const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
    try {
        // Fetch all products from MongoDB using Mongoose
        const products = await Product.find({})
            .populate('category', 'name')
            .populate('seller', 'storeName')
            .sort({ createdAt: -1 }); // Sort by newest
            
        // Send data back to the Frontend
        res.json(products);
    } catch (error) {
        next(error);
    }
};

module.exports = { getProducts };
```

### 4. Frontend API Client (`Frontend/src/api/axiosClient.js`)
The Frontend uses `axios` to define a base client that automatically points to the backend server.
```javascript
// Frontend/src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8070/api', // Points to Express Backend
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Crucial for sending JWT cookies
});

export default axiosClient;
```

### 5. Frontend React Component (`Frontend/src/pages/Home.jsx`)
Finally, the React component uses the `axiosClient` inside a `useEffect` hook to call the API when the page loads, and then stores the result in Redux.
```javascript
// Frontend/src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProducts } from '../redux/slices/productSlice';
import axiosClient from '../api/axiosClient';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        
        // Calls GET http://localhost:8070/api/products

        const { data } = await axiosClient.get('/products');
        
        // Save the fetched data into Redux State
        dispatch(setProducts(data));
      } catch (error) {
        console.error('Failed to load products', error);
      }
    };
    
    fetchAllProducts(); // Execute function
  }, [dispatch]);

  
};
```

This documentation equips you with all the necessar0y details to confidently present and explain the inner workings of your e-commerce platform!
