import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';
export const createOrder = async (req, res) => {
  try {
    const { userId, productId, customerName, customerCompany, time, quantity, sellingPrice } = req.body;

    // Check if all required fields are provided
    if (!userId || !productId || !customerName || !customerCompany || !time || !quantity || !sellingPrice) {
      return res.status(400).json({ message: 'Please provide all required fields, including selling price.' });
    }

    // Retrieve the product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product has enough quantity available
    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient product quantity available' });
    }

    // Calculate the total price and profit for this order
    const totalPrice = sellingPrice * quantity;
    const profit = (sellingPrice - product.costPrice) * quantity;

    // Create a new order
    const order = new Order({
      userId,
      productId,
      customerName,
      customerCompany,
      date: new Date(),
      time,
      quantity,
      totalPrice,
    });

    // Save the order to the database
    await order.save();

    // Update product quantity and profit earned
    product.quantity -= quantity;
    product.profitEarned += profit;
    await product.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    // Extract userId from the authenticated user (from the protect middleware)
    const { userId } = req.user.userId;

    // If userId is provided, fetch orders for that user, else fetch all orders
    const orders = userId
      ? await Order.find({ userId }) // Filter by userId
      : await Order.find(); // Fetch all orders

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error: error.message });
  }
};

export const getOrdersByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    // Find orders associated with the provided product ID
    const orders = await Order.find({ productId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this product' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: 'Error fetching orders for the product', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate if orderId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    // Find the order by orderId
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

export const getOrdersSortedByTotalPrice = async (req, res) => {
  try {
    // Get the sort order from query parameter ('asc' for ascending, 'desc' for descending)
    const { order = 'desc' } = req.query;  // Default to descending if not provided

    // Fetch all orders for the user
    const orders = await Order.find({ userId: req.user.userId });  // Ensure you're filtering by userId

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    // Sort orders based on totalPrice
    orders.sort((a, b) => {
      if (order === 'asc') {
        return a.totalPrice - b.totalPrice;  // Ascending order
      } else if (order === 'desc') {
        return b.totalPrice - a.totalPrice;  // Descending order
      } else {
        return 0;  // In case of invalid sorting order, return as is
      }
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: 'Error fetching and sorting orders by totalPrice', error: error.message });
  }
};
