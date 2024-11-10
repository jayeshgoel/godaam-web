import Product from '../models/productModel.js';
import mongoose from 'mongoose';
// Add a new product
export const createProduct = async (req, res) => {
  try {
    const { name, category, type, quantity, costPrice, companyName, profileEarned } = req.body;

    // Create a new product instance
    const newProduct = new Product({
      name,
      category,
      type,
      quantity,
      costPrice,
      companyName,
      profileEarned,
      user: req.user.userId, // Associate product with the logged-in user
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// Function to update the quantity of a product
export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the quantity and the timestamp
    product.quantity = product.quantity + quantity;  // Add the quantity provided in the request body
    product.quantityUpdatedAt = Date.now();  // Set the current timestamp for the update

    // Save the updated product
    await product.save();

    res.status(200).json({ message: 'Product quantity updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product quantity', error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    // Find products associated with the logged-in user's ID
    const products = await Product.find({
      user: req.user.userId,
    });
    
    res.status(200).json(products); // Send products if found
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: 'Error fetching products' }); // Send error response
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id: productId } = req.params;

    // Validate if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    // Find the product by ID and user ID
    const product = await Product.findOne({ _id: productId, user: req.user.userId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'Error fetching product' }); // Send error response
  }
};

export const searchProductsByName = async (req, res) => {
  try {
    const { name } = req.query;

    // Validate if the name parameter is provided
    if (!name) {
      return res.status(400).json({ message: 'Please provide a product name to search' });
    }

    // Perform a substring search for products by name (case-insensitive)
    const products = await Product.find({
      name: { $regex: `.*${name}.*`, $options: 'i' }, // '.*' allows for substring matching
      user: req.user.userId // Assuming each user has their own products
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found with the specified name' });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'Error searching for products' }); // Send error response
  }
};