import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, 'Please add a vehicle number'],
    unique: true,
    trim: true,
  },
  vehicleType: {
    type: String,
    required: [true, 'Please add a vehicle type'],
    enum: ['Truck', 'Van', 'Motorcycle', 'Car', 'Other'],
    trim: true,
  },
  capacity: {
    type: String,
    required: [true, 'Please add capacity'],
    trim: true,
  },
  availability: {
    type: String,
    enum: ['Available', 'In Use', 'Maintenance', 'Unavailable'],
    default: 'Available',
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
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
vehicleSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Vehicle', vehicleSchema);
