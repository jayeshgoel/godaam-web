import express from 'express';
import connectDB from './db.js';
import userRoutes from './routes/userRoute.js';  // Import user routes
import productRoutes from './routes/productRoute.js';  // Import product routes
import orderRoutes from './routes/orderRoute.js'
import cookieParser from 'cookie-parser';  // Import cookie-parser
// import { createOrder } from './controllers/orderController.js';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: 'http://localhost:5173',  // Set the frontend's origin here
  credentials: true                 // Enable credentials for cookies
}))
// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());  // Middleware to parse incoming JSON requests
app.use(cookieParser());  // Middleware to parse cookies

// Use the user and product routes
app.use('/api/user', userRoutes);  // All user routes will be prefixed with /api/users
app.use('/api/product', productRoutes);  // All product routes will be prefixed with /api/products
app.use('/api/order', orderRoutes)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
