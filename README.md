<<<<<<< HEAD
# Servify — Premium Home Services Marketplace

A production-grade full-stack MERN application — a home services marketplace inspired by Urban Company.

## Tech Stack

**Backend:** Node.js · Express.js · MongoDB · Mongoose · JWT · bcryptjs
**Frontend:** React · Vite · TypeScript · Tailwind CSS · Framer Motion · Recharts · React Hook Form

## Quick Start

### 1. Start MongoDB
Make sure MongoDB is running locally on port 27017.

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env   # Edit .env with your MONGO_URI and JWT_SECRET
npm run seed           # Seed the database with 5 services
npm run dev            # Starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev            # Starts on http://localhost:5173
```

## Features

### Customer
- Register/Login with JWT authentication
- Browse services by category with search & filter
- Book services with address, date/time, and notes
- Real-time booking status tracking
- Customer dashboard with stats
- Cancel pending/accepted bookings
- Profile management

### Provider
- Dedicated provider dashboard with earnings overview
- Accept or reject incoming booking requests
- Mark jobs as completed
- Monthly earnings analytics (Recharts AreaChart + BarChart)
- Availability toggle
- Provider profile management

### Design
- Dark glassmorphism UI (indigo/purple palette)
- Framer Motion page & component animations
- Fully responsive (mobile, tablet, desktop)
- Role-based route protection
- Toast notification system
- Loading states & empty states

## Project Structure

```
servify/
├── server/                  # Express API
│   ├── config/db.js
│   ├── middleware/          # auth, errorHandler
│   ├── models/             # User, ProviderProfile, Service, Booking
│   ├── controllers/        # authController, bookingController, providerController, serviceController
│   ├── routes/             # auth, bookings, providers, services
│   ├── utils/              # generateToken, apiResponse
│   ├── seed/seed.js        # Database seeder
│   └── server.js
└── client/                  # React + Vite app
    └── src/
        ├── components/     # 13 reusable components
        ├── pages/          # Landing, Auth, Customer, Provider pages
        ├── context/        # AuthContext, ToastContext
        ├── hooks/          # useAuth
        ├── types/          # TypeScript interfaces
        └── utils/          # Axios instance, helpers
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/services | Get all services |
| POST | /api/bookings | Create booking |
| GET | /api/bookings | Get customer bookings |
| GET | /api/bookings/dashboard | Customer dashboard stats |
| PATCH | /api/bookings/:id/cancel | Cancel booking |
| GET | /api/providers/dashboard | Provider dashboard stats |
| GET | /api/providers/analytics | Monthly earnings analytics |
| PATCH | /api/providers/bookings/:id/accept | Accept booking |
| PATCH | /api/providers/bookings/:id/reject | Reject booking |
| PATCH | /api/providers/bookings/:id/complete | Complete booking |
=======
# servify
•Servify– Home Services Marketplace Full Stack Web Application for booking and managing home services– Tech Stack: React.js, Node.js, Express.js, MongoDB, JWT, bcryptjs, Recharts, Framer Motion.
>>>>>>> d08078c199a04a15b3ea5ccea3774e59f105733d
