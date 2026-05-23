import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  uid: {
    type: String,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true,
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please add a license number'],
    unique: true,
    trim: true,
  },
  availability: {
    type: String,
    enum: ['Available', 'On Duty', 'Unavailable'],
    default: 'Available',
  },
  assignedDeliveries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate random UID before saving if not provided
driverSchema.pre('save', function (next) {
  if (!this.uid) {
    this.uid = 'DRV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Driver', driverSchema);
