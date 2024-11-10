import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerCompany: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,  // Automatically set to current date
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Canceled'],
    default: 'Pending',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,  // Quantity should be at least 1
  },
  totalPrice: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,  // Adds createdAt and updatedAt timestamps
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
