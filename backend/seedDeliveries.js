import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Delivery from './models/Delivery.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/transport-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const customerNames = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Neha Gupta', 'Vikram Singh',
  'Anjali Mehta', 'Rahul Verma', 'Pooja Joshi', 'Suresh Reddy', 'Kavita Nair',
  'Deepak Yadav', 'Sunita Agarwal', 'Manoj Kumar', 'Rekha Devi', 'Sanjay Singh',
  'Meena Kumari', 'Ravi Prasad', 'Lakshmi Devi', 'Sunil Kumar', 'Saroja Devi',
  'Krishna Murthy', 'Radha Rani', 'Venkat Rao', 'Lalitha Devi', 'Ramesh Babu',
  'Savitri Devi', 'Chandra Shekhar', 'Kalyani Devi', 'Narendra Kumar', 'Shanti Devi',
  'Mohan Lal', 'Geeta Devi', 'Prakash Singh', 'Kamala Devi', 'Rajendra Prasad',
  'Bimla Devi', 'Shiv Kumar', 'Munni Devi', 'Brijesh Kumar', 'Savitri Devi',
  'Dinesh Kumar', 'Kaushalya Devi', 'Rajiv Kumar', 'Anita Devi', 'Suresh Kumar',
  'Kiran Devi', 'Mahesh Kumar', 'Meena Devi', 'Rakesh Kumar', 'Sunita Devi'
];

const addresses = [
  '123 MG Road, Bangalore',
  '456 Anna Salai, Chennai',
  '789 Connaught Place, New Delhi',
  '321 Marine Drive, Mumbai',
  '654 Park Street, Kolkata',
  '987 Brigade Road, Bangalore',
  '147 T Nagar, Chennai',
  '258 Nehru Place, New Delhi',
  '369 Bandra Kurla Complex, Mumbai',
  '741 Salt Lake, Kolkata',
  '852 Koramangala, Bangalore',
  '963 Adyar, Chennai',
  '159 Saket, New Delhi',
  '357 Andheri East, Mumbai',
  '458 Dumdum, Kolkata',
  '263 Indiranagar, Bangalore',
  '174 Mylapore, Chennai',
  '585 Vasant Kunj, New Delhi',
  '396 Powai, Mumbai',
  '472 Howrah, Kolkata',
  '581 HSR Layout, Bangalore',
  '693 Besant Nagar, Chennai',
  '814 Gurgaon, New Delhi',
  '925 Thane, Mumbai',
  '136 South 24 Parganas, Kolkata',
  '247 Whitefield, Bangalore',
  '358 Velachery, Chennai',
  '469 Noida, New Delhi',
  '571 Navi Mumbai, Mumbai',
  '682 North 24 Parganas, Kolkata'
];

const vehicles = [
  'TRK-001', 'TRK-002', 'TRK-003', 'TRK-004', 'TRK-005',
  'TRK-006', 'TRK-007', 'TRK-008', 'TRK-009', 'TRK-010'
];

const statuses = ['Pending', 'Scheduled', 'In Transit', 'Delivered'];

const generateRandomPhone = () => {
  const prefix = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
  const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
  const randomDigits = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return randomPrefix + randomDigits;
};

const generateRandomDate = () => {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 30);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
};

const generateRandomTime = () => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const seedDeliveries = async () => {
  try {
    console.log('Starting to seed deliveries...');
    
    // Clear existing deliveries (optional - comment out if you want to keep existing data)
    // await Delivery.deleteMany({});
    // console.log('Cleared existing deliveries');

    const deliveries = [];
    const driverUid = 'DRV-70JQY8';

    for (let i = 1; i <= 50; i++) {
      const delivery = {
        orderId: `ORD-${(i + 1000).toString()}`,
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        deliveryAddress: addresses[Math.floor(Math.random() * addresses.length)],
        phoneNumber: generateRandomPhone(),
        assignedDriver: driverUid,
        assignedVehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
        deliveryDate: generateRandomDate(),
        deliveryTime: generateRandomTime(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        notes: i % 5 === 0 ? 'Fragile items - handle with care' : '',
      };
      deliveries.push(delivery);
    }

    await Delivery.insertMany(deliveries);
    console.log('Successfully seeded 50 deliveries for driver DRV-70JQY8');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding deliveries:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDeliveries();
