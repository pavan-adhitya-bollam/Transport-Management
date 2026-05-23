import Delivery from '../models/Delivery.js';
import Driver from '../models/Driver.js';
import Vehicle from '../models/Vehicle.js';

// @desc    Get delivery statistics by status
// @route   GET /api/reports/delivery-stats
// @access  Private
export const getDeliveryStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};

    if (startDate && endDate) {
      dateFilter = {
        deliveryDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const total = await Delivery.countDocuments(dateFilter);
    const pending = await Delivery.countDocuments({ ...dateFilter, status: 'Pending' });
    const scheduled = await Delivery.countDocuments({ ...dateFilter, status: 'Scheduled' });
    const inTransit = await Delivery.countDocuments({ ...dateFilter, status: 'In Transit' });
    const delivered = await Delivery.countDocuments({ ...dateFilter, status: 'Delivered' });

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

// @desc    Get monthly delivery statistics
// @route   GET /api/reports/monthly-stats
// @access  Private
export const getMonthlyStats = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const monthlyStats = await Delivery.aggregate([
      {
        $match: {
          deliveryDate: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$deliveryDate' },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.month': 1 },
      },
    ]);

    // Format the data for charts
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const formattedData = months.map((month, index) => {
      const monthData = monthlyStats.filter((stat) => stat._id.month === index + 1);
      return {
        month,
        Pending: monthData.find((d) => d._id.status === 'Pending')?.count || 0,
        Scheduled: monthData.find((d) => d._id.status === 'Scheduled')?.count || 0,
        'In Transit': monthData.find((d) => d._id.status === 'In Transit')?.count || 0,
        Delivered: monthData.find((d) => d._id.status === 'Delivered')?.count || 0,
      };
    });

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get driver performance statistics
// @route   GET /api/reports/driver-performance
// @access  Private
export const getDriverPerformance = async (req, res) => {
  try {
    const drivers = await Driver.find().populate('assignedDeliveries', 'status deliveryDate');

    const driverStats = drivers.map((driver) => {
      const deliveries = driver.assignedDeliveries || [];
      const completed = deliveries.filter((d) => d.status === 'Delivered').length;
      const inProgress = deliveries.filter((d) => d.status === 'In Transit').length;
      const total = deliveries.length;

      return {
        _id: driver._id,
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        totalDeliveries: total,
        completedDeliveries: completed,
        inProgressDeliveries: inProgress,
        completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) : 0,
      };
    });

    res.json(driverStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vehicle usage statistics
// @route   GET /api/reports/vehicle-usage
// @access  Private
export const getVehicleUsage = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    const vehicleStats = vehicles.map((vehicle) => {
      const deliveries = Delivery.countDocuments({ assignedVehicle: vehicle.vehicleNumber });
      
      return {
        _id: vehicle._id,
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,
        capacity: vehicle.capacity,
        availability: vehicle.availability,
        assignedDriver: vehicle.assignedDriver,
        totalDeliveries: deliveries,
      };
    });

    // Get usage by vehicle type
    const usageByType = await Vehicle.aggregate([
      {
        $group: {
          _id: '$vehicleType',
          count: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$availability', 'Available'] }, 1, 0] },
          },
          inUse: {
            $sum: { $cond: [{ $eq: ['$availability', 'In Use'] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      vehicleStats,
      usageByType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get deliveries by date for schedule
// @route   GET /api/reports/schedule
// @access  Private
export const getSchedule = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};

    if (startDate && endDate) {
      dateFilter = {
        deliveryDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else {
      // Default to current month
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      dateFilter = {
        deliveryDate: {
          $gte: firstDay,
          $lte: lastDay,
        },
      };
    }

    const deliveries = await Delivery.find(dateFilter)
      .populate('assignedDriver', 'name phone')
      .sort({ deliveryDate: 1, deliveryTime: 1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get overall dashboard statistics
// @route   GET /api/reports/dashboard-stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const totalDeliveries = await Delivery.countDocuments();
    const completedDeliveries = await Delivery.countDocuments({ status: 'Delivered' });
    const pendingDeliveries = await Delivery.countDocuments({ status: 'Pending' });
    const inTransitDeliveries = await Delivery.countDocuments({ status: 'In Transit' });

    const totalDrivers = await Driver.countDocuments();
    const availableDrivers = await Driver.countDocuments({ availability: 'Available' });
    const onDutyDrivers = await Driver.countDocuments({ availability: 'On Duty' });

    const totalVehicles = await Vehicle.countDocuments();
    const availableVehicles = await Vehicle.countDocuments({ availability: 'Available' });
    const inUseVehicles = await Vehicle.countDocuments({ availability: 'In Use' });

    res.json({
      deliveries: {
        total: totalDeliveries,
        completed: completedDeliveries,
        pending: pendingDeliveries,
        inTransit: inTransitDeliveries,
      },
      drivers: {
        total: totalDrivers,
        available: availableDrivers,
        onDuty: onDutyDrivers,
      },
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        inUse: inUseVehicles,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
