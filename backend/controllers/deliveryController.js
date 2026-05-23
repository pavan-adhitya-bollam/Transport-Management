import Delivery from '../models/Delivery.js';

// @desc    Get all deliveries
// @route   GET /api/deliveries
// @access  Private
export const getDeliveries = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by customer name or order ID
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
      ];
    }

    const deliveries = await Delivery.find(query)
      .populate('assignedDriver', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single delivery
// @route   GET /api/deliveries/:id
// @access  Private
export const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate(
      'assignedDriver',
      'name email phone'
    );

    if (delivery) {
      res.json(delivery);
    } else {
      res.status(404).json({ message: 'Delivery not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new delivery
// @route   POST /api/deliveries
// @access  Private
export const createDelivery = async (req, res) => {
  try {
    const {
      orderId,
      customerName,
      deliveryAddress,
      phoneNumber,
      assignedDriver,
      assignedVehicle,
      deliveryDate,
      deliveryTime,
      notes,
    } = req.body;

    // Check if order ID already exists
    const existingDelivery = await Delivery.findOne({ orderId });
    if (existingDelivery) {
      return res.status(400).json({ message: 'Order ID already exists' });
    }

    const delivery = await Delivery.create({
      orderId,
      customerName,
      deliveryAddress,
      phoneNumber,
      assignedDriver,
      assignedVehicle,
      deliveryDate,
      deliveryTime,
      notes,
    });

    const populatedDelivery = await Delivery.findById(delivery._id).populate(
      'assignedDriver',
      'name email phone'
    );

    res.status(201).json(populatedDelivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery
// @route   PUT /api/deliveries/:id
// @access  Private
export const updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedDriver', 'name email phone');

    res.json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery status
// @route   PATCH /api/deliveries/:id/status
// @access  Private
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    delivery.status = status;
    await delivery.save();

    const populatedDelivery = await Delivery.findById(delivery._id).populate(
      'assignedDriver',
      'name email phone'
    );

    res.json(populatedDelivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete delivery
// @route   DELETE /api/deliveries/:id
// @access  Private
export const deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    await delivery.deleteOne();
    res.json({ message: 'Delivery removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get delivery statistics
// @route   GET /api/deliveries/stats/summary
// @access  Private
export const getDeliveryStats = async (req, res) => {
  try {
    const total = await Delivery.countDocuments();
    const pending = await Delivery.countDocuments({ status: 'Pending' });
    const scheduled = await Delivery.countDocuments({ status: 'Scheduled' });
    const inTransit = await Delivery.countDocuments({ status: 'In Transit' });
    const delivered = await Delivery.countDocuments({ status: 'Delivered' });

    res.json({
      total,
      pending,
      scheduled,
      inTransit,
      delivered,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
