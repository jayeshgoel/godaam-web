import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createOrder, getOrders, getOrdersByProductId, getOrderById, getOrdersSortedByTotalPrice } from '../controllers/orderController.js';

const router = express.Router();

// Route to create an order (protected route)
router.put('/create', protect, createOrder);
router.get('/get-orders', protect, getOrders);
router.get('/product/:productId', protect, getOrdersByProductId);
router.get('/order/:orderId', protect, getOrderById);
router.get('/orders-sorted-by-price', protect, getOrdersSortedByTotalPrice );  // Sort orders by profit

export default router;
