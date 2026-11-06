# Transport Management System

A full-stack MERN (MongoDB, Express, React, Node.js) Transport Management System with JWT Authentication and UID-based driver assignment system.

## 🚀 Features

### User Management
- **Role-Based Access Control (RBAC)**: Admin and Driver roles with different permissions
- **JWT Authentication**: Secure token-based authentication
- **Driver UID System**: Unique driver IDs (e.g., DRV-ABC123) for easy assignment
- **Profile Management**: View and edit user profile information

### Delivery Management
- **Create Deliveries**: Admin can create new delivery assignments
- **UID-Based Assignment**: Assign deliveries using driver UIDs
- **Status Tracking**: Track delivery status (Pending, Scheduled, In Transit, Delivered)
- **Search Functionality**: Search deliveries by Order ID, Customer Name, or Address
- **Real-time Updates**: View and update delivery information

### Driver Management
- **Driver Registration**: Self-registration with auto-generated UID
- **Driver Dashboard**: View assigned deliveries and status
- **Availability Management**: Track driver availability status
- **License Management**: Store and manage driver license information

### Vehicle Management
- **Vehicle Registration**: Add and manage transport vehicles
- **Vehicle Assignment**: Assign vehicles to deliveries
- **Usage Tracking**: Monitor vehicle availability and usage

### Dashboard & Analytics
- **Real-time Statistics**: View delivery counts, status breakdown
- **Recent Deliveries**: Quick view of recent delivery activities
- **Visual Charts**: Delivery statistics with visual representations
- **Role-Based Views**: Different dashboard views for admin and drivers

### UI/UX Features
- **Responsive Design**: Mobile-friendly interface
- **Loading States**: Loading skeletons for better UX
- **Empty States**: Informative messages when no data exists
- **Toast Notifications**: Feedback for all user actions
- **Confirmation Modals**: Prevent accidental deletions
- **Search & Filter**: Easy data navigation
- **Professional Styling**: Clean, modern UI with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **Recharts** - Chart library for analytics

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
mern/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── deliveryController.js
│   │   ├── driverController.js
│   │   └── vehicleController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Driver.js          # Driver model with UID
│   │   ├── Delivery.js        # Delivery model
│   │   └── Vehicle.js         # Vehicle model
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── deliveryRoutes.js  # Delivery CRUD routes
│   │   ├── driverRoutes.js    # Driver CRUD routes
│   │   └── vehicleRoutes.js   # Vehicle CRUD routes
│   ├── utils/
│   │   └── generateToken.js   # JWT token generation
│   ├── server.js              # Backend entry point
│   ├── seedDeliveries.js      # Database seeding script
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Top navigation bar
│   │   │   ├── Sidebar.jsx    # Side navigation
│   │   │   ├── Toast.jsx      # Toast notifications
│   │   │   ├── DeliveryList.jsx
│   │   │   ├── AddDeliveryModal.jsx
│   │   │   ├── EditDeliveryModal.jsx
│   │   │   ├── DeleteConfirmation.jsx
│   │   │   ├── RecentDeliveries.jsx
│   │   │   ├── AnalyticsCard.jsx
│   │   │   ├── DeliveryChart.jsx
│   │   │   └── VehicleUsageChart.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Register.jsx   # Registration page
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── Deliveries.jsx # Deliveries management
│   │   │   ├── Drivers.jsx     # Drivers management
│   │   │   ├── Vehicles.jsx    # Vehicles management
│   │   │   ├── Schedule.jsx    # Delivery schedule
│   │   │   ├── Reports.jsx     # Reports and analytics
│   │   │   └── Profile.jsx     # User profile
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx  # Main layout wrapper
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── deliveryService.js
│   │   │   ├── driverService.js
│   │   │   └── vehicleService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🔧 Installation

### Backend Setup

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure your `.env` file:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/transport-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

5. **Start the backend server:**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure your `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start the frontend development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🚀 Startup Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Development mode with nodemon
npm start            # Production mode
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Development mode
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get user profile | Protected |

### Delivery Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/deliveries` | Get all deliveries | Protected |
| POST | `/api/deliveries` | Create new delivery | Protected |
| GET | `/api/deliveries/:id` | Get delivery by ID | Protected |
| PUT | `/api/deliveries/:id` | Update delivery | Protected |
| DELETE | `/api/deliveries/:id` | Delete delivery | Protected |
| PATCH | `/api/deliveries/:id/status` | Update delivery status | Protected |

### Driver Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/drivers` | Get all drivers | Protected |
| POST | `/api/drivers` | Create new driver | Protected (Admin) |
| GET | `/api/drivers/:id` | Get driver by ID | Protected |
| PUT | `/api/drivers/:id` | Update driver | Protected (Admin) |
| DELETE | `/api/drivers/:id` | Delete driver | Protected (Admin) |
| PATCH | `/api/drivers/:id/availability` | Update driver availability | Protected |

### Vehicle Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/vehicles` | Get all vehicles | Protected |
| POST | `/api/vehicles` | Create new vehicle | Protected (Admin) |
| GET | `/api/vehicles/:id` | Get vehicle by ID | Protected |
| PUT | `/api/vehicles/:id` | Update vehicle | Protected (Admin) |
| DELETE | `/api/vehicles/:id` | Delete vehicle | Protected (Admin) |

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: Users can register with email, password, and role (admin/driver)
2. **Login**: Upon successful login, a JWT token is generated and returned
3. **Protected Routes**: All API routes (except register/login) require a valid JWT token in the Authorization header
4. **Token Format**: `Authorization: Bearer <token>`

## 👥 User Roles

### Admin
- Full access to all features
- Can create, edit, delete drivers
- Can create, edit, delete vehicles
- Can create, edit, delete deliveries
- Can view all deliveries and statistics
- Can assign deliveries using driver UIDs

### Driver
- Can view their assigned deliveries only
- Can update delivery status
- Can view their profile and UID
- Cannot manage other drivers or vehicles
- Cannot delete deliveries

## 🌐 UID-Based Driver Assignment

The system uses a unique UID (User Identifier) system for drivers:

1. **Driver Registration**: When a driver registers, they automatically receive a unique UID (e.g., DRV-ABC123)
2. **UID Display**: Drivers can see their UID in their profile and dashboard
3. **Delivery Assignment**: Admin assigns deliveries by entering the driver's UID
4. **Delivery Filtering**: Drivers only see deliveries assigned to their UID

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Loading Skeletons**: Visual placeholders while data is loading
- **Empty States**: Informative messages when no data is available
- **Toast Notifications**: Real-time feedback for user actions
- **Confirmation Modals**: Prevent accidental data deletion
- **Search Functionality**: Quick search across deliveries
- **Professional Dashboard**: Clean, modern interface with analytics
- **Indian Currency**: All amounts displayed in Indian Rupees (₹)

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['admin', 'driver']),
  phone: String,
  driverUid: String (for drivers)
}
```

### Driver Model
```javascript
{
  uid: String (unique, auto-generated),
  name: String,
  phone: String,
  licenseNumber: String (unique),
  availability: String (enum: ['Available', 'On Duty', 'Unavailable']),
  assignedDeliveries: [ObjectId]
}
```

### Delivery Model
```javascript
{
  orderId: String (unique),
  customerName: String,
  deliveryAddress: String,
  phoneNumber: String,
  assignedDriver: String (driver UID),
  assignedVehicle: String,
  deliveryDate: Date,
  deliveryTime: String,
  status: String (enum: ['Pending', 'Scheduled', 'In Transit', 'Delivered']),
  notes: String
}
```

### Vehicle Model
```javascript
{
  vehicleNumber: String (unique),
  model: String,
  capacity: Number,
  availability: String (enum: ['Available', 'In Use', 'Maintenance']),
  assignedDeliveries: [ObjectId]
}
```

## 🧪 Database Seeding

To populate the database with sample data:

```bash
cd backend
node seedDeliveries.js
```

This will add 50 sample deliveries to driver UID `DRV-1VMJ3Z`.

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for admin and driver roles
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

## 🐛 Development Notes

- Backend uses ES modules (`"type": "module"` in package.json)
- Frontend uses Vite for fast development and hot module replacement
- Tailwind CSS is configured for styling
- MongoDB connection includes error handling
- All API routes are protected with JWT authentication middleware
- CORS is configured to allow frontend requests

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/transport-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚦 Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas for production database
4. Set `FRONTEND_URL` to production frontend URL
5. Use a process manager like PM2: `pm2 start server.js`

#### Render

For a Render Web Service, set the root directory to `backend`, the build command
to `npm install`, and the start command to `npm start`. Add these environment
variables in the Render dashboard:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<password>@<atlas-cluster-host>/transport-management
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=https://<your-frontend-domain>
```

The Atlas cluster host must be copied from the MongoDB Atlas connection dialog.
If Render reports `querySrv ENOTFOUND`, the `MONGODB_URI` hostname is invalid,
the cluster no longer exists, or its DNS record is unavailable. Replace the
variable with the current Atlas connection string and allow Render's outbound
IP access in the Atlas network settings.

### Frontend
1. Run `npm run build` to create production build
2. Deploy the `dist` folder to a hosting service (Vercel, Netlify, etc.)
3. Set `VITE_API_URL` to production backend URL

## 📄 License

ISC

## 👨‍💻 Author

Transport Management System - MERN Stack Application

## 🙏 Acknowledgments

- React Icons for icon library
- Tailwind CSS for styling
- Recharts for data visualization
