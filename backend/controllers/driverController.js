import Driver from '../models/Driver.js';

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private
export const getDrivers = async (req, res) => {
  try {
    const { availability, search } = req.query;
    let query = {};

    // Filter by availability
    if (availability) {
      query.availability = availability;
    }

    // Search by name or license number
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const drivers = await Driver.find(query)
      .populate('assignedDeliveries', 'orderId status')
      .sort({ createdAt: -1 });

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Private
export const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate(
      'assignedDeliveries',
      'orderId status deliveryDate'
    );

    if (driver) {
      res.json(driver);
    } else {
      res.status(404).json({ message: 'Driver not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new driver
// @route   POST /api/drivers
// @access  Private
export const createDriver = async (req, res) => {
  try {
    const { name, phone, licenseNumber, availability } = req.body;

    // Check if license number already exists
    const existingDriver = await Driver.findOne({ licenseNumber });
    if (existingDriver) {
      return res.status(400).json({ message: 'License number already exists' });
    }

    const driver = await Driver.create({
      name,
      phone,
      licenseNumber,
      availability,
    });

    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private
export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Check if license number is being changed and already exists
    if (req.body.licenseNumber && req.body.licenseNumber !== driver.licenseNumber) {
      const existingDriver = await Driver.findOne({ licenseNumber: req.body.licenseNumber });
      if (existingDriver) {
        return res.status(400).json({ message: 'License number already exists' });
      }
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedDriver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update driver availability
// @route   PATCH /api/drivers/:id/availability
// @access  Private
export const updateDriverAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.availability = availability;
    await driver.save();

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private
export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Check if driver has assigned deliveries
    if (driver.assignedDeliveries && driver.assignedDeliveries.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete driver with assigned deliveries. Please reassign deliveries first.' 
      });
    }

    await driver.deleteOne();
    res.json({ message: 'Driver removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get driver statistics
// @route   GET /api/drivers/stats/summary
// @access  Private
export const getDriverStats = async (req, res) => {
  try {
    const total = await Driver.countDocuments();
    const available = await Driver.countDocuments({ availability: 'Available' });
    const onDuty = await Driver.countDocuments({ availability: 'On Duty' });
    const unavailable = await Driver.countDocuments({ availability: 'Unavailable' });

    res.json({
      total,
      available,
      onDuty,
      unavailable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
