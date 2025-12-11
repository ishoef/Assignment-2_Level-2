# 🚗 Vehicle Rental System

A backend-powered Vehicle Rental Management System with authentication, vehicle inventory, customer accounts, and booking operations.

🔗 **Live URL:** https://assignment-2-vehicle-rental.vercel.app/

---

## 📌 Features

### 🔐 Authentication & Authorization
- Secure **JWT-based authentication**
- **Role-based access control** (Admin & Customer)
- Password hashing using **bcrypt**

### 🚘 Vehicle Management
- Add, update, delete vehicles (Admin only)
- View all vehicles or a single vehicle (Public)
- Track availability: **available / booked**

### 👤 User Management
- Admin can manage all users
- Customers can update their own profile
- Prevent deletion if active bookings exist

### 📅 Booking Management
- Create bookings with automatic price calculation
- Validate vehicle availability before booking
- Admin can mark bookings as "returned"
- Customer can cancel bookings before start date
- Auto-update vehicle status upon return

---

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**
- **Express.js** (REST API framework)
- **PostgreSQL** (database)
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT authentication)

---

## 🌐 API Overview
- **Auth:** `/api/v1/auth/signup`, `/signin`
- **Vehicles:** CRUD endpoints (Admin), public view
- **Users:** Admin or self-update
- **Bookings:** Create, cancel, return, role-based access

---

## 🗄️ Database Schema

### **Users Table**
| Field | Details |
|-------|---------|
| id | Auto-generated |
| name | Required |
| email | Unique, lowercase |
| password | Hashed |
| phone | Required |
| role | `admin` or `customer` |

### **Vehicles Table**
| Field | Details |
|-------|---------|
| id | Auto-generated |
| vehicle_name | Required |
| type | car, bike, van, suv |
| registration_number | Unique |
| daily_rent_price | Positive |
| availability_status | available, booked |

### **Bookings Table**
| Field | Details |
|-------|---------|
| id | Auto-generated |
| customer_id | FK (Users) |
| vehicle_id | FK (Vehicles) |
| rent_start_date | Required |
| rent_end_date | Required |
| total_price | Positive |
| status | active, cancelled, returned |

---

## 🌐 API Endpoints

📖 Full documentation available in **API_REFERENCE.md**

### **Auth Endpoints**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/signup` | Public | Register a user |
| POST | `/api/v1/auth/signin` | Public | Login & receive JWT |

### **Vehicle Endpoints**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/vehicles` | Admin | Add new vehicle |
| GET | `/api/v1/vehicles` | Public | Get all vehicles |
| GET | `/api/v1/vehicles/:vehicleId` | Public | Get vehicle details |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin | Update vehicle |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin | Delete vehicle |

### **User Endpoints**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users` | Admin | View all users |
| PUT | `/api/v1/users/:userId` | Admin/Owner | Update profile/role |
| DELETE | `/api/v1/users/:userId` | Admin | Delete user |

### **Booking Endpoints**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/bookings` | Customer/Admin | Create booking |
| GET | `/api/v1/bookings` | Role-based | Admin: all, Customer: own |
| PUT | `/api/v1/bookings/:bookingId` | Role-based | Cancel/Return |

---

