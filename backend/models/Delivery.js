import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'Please add an order ID'],
    unique: true,
    trim: true,
  },
  customerName: {
    type: String,
    required: [true, 'Please add a customer name'],
    trim: true,
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Please add a delivery address'],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true,
  },
  assignedDriver: {
    type: String,
    default: null,
  },
  assignedVehicle: {
    type: String,
    default: null,
  },
  deliveryDate: {
    type: Date,
    required: [true, 'Please add a delivery date'],
  },
  deliveryTime: {
    type: String,
    required: [true, 'Please add a delivery time'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'In Transit', 'Delivered'],
    default: 'Pending',
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
deliverySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Delivery', deliverySchema);
