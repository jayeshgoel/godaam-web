import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createProduct, getProductById, getProducts, searchProductsByName, updateQuantity } from '../controllers/productController.js';
import Product from '../models/productModel.js';
const router = express.Router();

// Route to update the quantity of a product (protected route)
router.put('/add-quantity', protect, updateQuantity);  // Only authenticated users can update quantity
// Route to add a new product (protected route)
router.post('/create', protect, createProduct);  // Only authenticated users can add products

router.get('/get-products', protect , getProducts)

router.get('/search', protect, searchProductsByName);
router.get('/:id', protect, getProductById)



export default router;
