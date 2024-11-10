import mongoose from 'mongoose';

// Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  profitEarned: {
    type: Number,
    default: 0,
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: true 
  },
  quantityUpdatedAt: {
    type: Date,
    default: Date.now, // Set the default value to the current timestamp
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Product = mongoose.model('Product', productSchema);

export default Product;
