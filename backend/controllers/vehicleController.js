import Vehicle from '../models/Vehicle.js';

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
export const getVehicles = async (req, res) => {
  try {
    const { availability, vehicleType, search } = req.query;
    let query = {};

    // Filter by availability
    if (availability) {
      query.availability = availability;
    }

    // Filter by vehicle type
    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    // Search by vehicle number
    if (search) {
      query.vehicleNumber = { $regex: search, $options: 'i' };
    }

    const vehicles = await Vehicle.find(query)
      .populate('assignedDriver', 'name phone')
      .sort({ createdAt: -1 });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      'assignedDriver',
      'name phone licenseNumber'
    );

    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private
export const createVehicle = async (req, res) => {
  try {
    const { vehicleNumber, vehicleType, capacity, availability, assignedDriver } = req.body;

    // Check if vehicle number already exists
    const existingVehicle = await Vehicle.findOne({ vehicleNumber });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle number already exists' });
    }

    const vehicle = await Vehicle.create({
      vehicleNumber,
      vehicleType,
      capacity,
      availability,
      assignedDriver,
    });

    const populatedVehicle = await Vehicle.findById(vehicle._id).populate(
      'assignedDriver',
      'name phone'
    );

    res.status(201).json(populatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if vehicle number is being changed and already exists
    if (req.body.vehicleNumber && req.body.vehicleNumber !== vehicle.vehicleNumber) {
      const existingVehicle = await Vehicle.findOne({ vehicleNumber: req.body.vehicleNumber });
      if (existingVehicle) {
        return res.status(400).json({ message: 'Vehicle number already exists' });
      }
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedDriver', 'name phone');

    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vehicle availability
// @route   PATCH /api/vehicles/:id/availability
// @access  Private
export const updateVehicleAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    vehicle.availability = availability;
    await vehicle.save();

    const populatedVehicle = await Vehicle.findById(vehicle._id).populate(
      'assignedDriver',
      'name phone'
    );

    res.json(populatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if vehicle is assigned to a driver
    if (vehicle.assignedDriver) {
      return res.status(400).json({ 
        message: 'Cannot delete vehicle with assigned driver. Please unassign driver first.' 
      });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vehicle statistics
// @route   GET /api/vehicles/stats/summary
// @access  Private
export const getVehicleStats = async (req, res) => {
  try {
    const total = await Vehicle.countDocuments();
    const available = await Vehicle.countDocuments({ availability: 'Available' });
    const inUse = await Vehicle.countDocuments({ availability: 'In Use' });
    const maintenance = await Vehicle.countDocuments({ availability: 'Maintenance' });
    const unavailable = await Vehicle.countDocuments({ availability: 'Unavailable' });

    const byType = await Vehicle.aggregate([
      {
        $group: {
          _id: '$vehicleType',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      total,
      available,
      inUse,
      maintenance,
      unavailable,
      byType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
