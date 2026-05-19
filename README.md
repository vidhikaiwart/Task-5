Authentication System

A full-stack authentication system with role-based access control, built with React, Redux, Node.js, Express, and MongoDB.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your settings

# Start development server
npm run dev

# Or for production
npm start
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
```

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for access tokens |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens |

---

## Project Architecture

```
nucleus/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── authController.js  # Auth logic (login, register, etc.)
│   ├── middleware/
│   │   ├── authMiddleware.js  # protect & admin middleware
│   │   └── errorHandler.js    # Error handling
│   ├── models/
│   │   └── User.js            # User schema
│   ├── routes/
│   │   └── authRoutes.js      # API routes
│   ├── utils/
│   │   └── generateToken.js   # JWT token generation
│   ├── validators/
│   │   └── authValidator.js   # Input validation
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Entry point
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js       # Axios instance with interceptors
    │   ├── app/
    │   │   ├── persistConfig.js  # Redux persist config
    │   │   └── store.js       # Redux store
    │   ├── features/
    │   │   └── auth/          # Auth slice, thunks, API
    │   ├── pages/
    │   │   ├── Login.jsx      # Login page
    │   │   ├── Register.jsx   # Registration page
    │   │   ├── Dashboard.jsx  # Main dashboard (routes to User/Admin)
    │   │   ├── UserDashboard.jsx   # Regular user view
    │   │   └── AdminDashboard.jsx  # Admin user view
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx  # Auth protection
    │   ├── App.jsx            # Main app component
    │   └── main.jsx           # Entry point
    ├── package.json
    └── vite.config.js
```

### Technology Stack

**Backend:**
- Express.js - Web framework
- MongoDB with Mongoose - Database
- JSON Web Token (JWT) - Authentication
- Bcrypt.js - Password hashing
- Helmet - Security headers
- CORS - Cross-origin resource sharing

**Frontend:**
- React 19 - UI library
- Redux Toolkit - State management
- Redux Persist - Local storage persistence
- React Router v7 - Routing
- Axios - HTTP client
- React Hot Toast - Notifications
- Tailwind CSS - Styling
- Yup - Form validation

---

## API Documentation

### Base URL
```
http://localhost:5000/api/auth
```

### Endpoints

#### 1. Register User
**POST** `/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "user"  // optional: "user" or "admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Errors:**
- 400: User already exists / Validation failed

---

#### 2. Login User
**POST** `/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Errors:**
- 400: Invalid credentials

---

#### 3. Refresh Token
**POST** `/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJ..."
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Errors:**
- 401: Invalid or expired refresh token

---

#### 4. Logout
**POST** `/logout`

**Headers:** None required (works without auth)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### 5. Get Profile (Protected)
**GET** `/profile`

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Errors:**
- 401: Unauthorized

---

#### 6. Get All Users (Admin Only)
**GET** `/users`

**Headers:** `Authorization: Bearer <adminAccessToken>`

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  ]
}
```

**Errors:**
- 401: Unauthorized
- 403: Access denied (non-admin)

---

#### 7. Update User Role (Admin Only)
**PUT** `/users/:id/role`

**Headers:** `Authorization: Bearer <adminAccessToken>`

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**Errors:**
- 400: Invalid role value
- 404: User not found

---

#### 8. Delete User (Admin Only)
**DELETE** `/users/:id`

**Headers:** `Authorization: Bearer <adminAccessToken>`

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Errors:**
- 404: User not found

---


