# Lost and Found System

Online Lost and Found Reporting System with separate backend and frontend structure.

## Project Structure

```
├── backend/          # Node.js/Express backend
│   ├── server.js     # Main server file
│   ├── routes/       # API routes
│   ├── models/       # Database models
│   ├── middleware/   # Custom middleware
│   ├── utils/        # Utility functions
│   ├── uploads/      # Uploaded images
│   └── .env          # Environment variables
│
└── frontend/         # Static frontend files
    ├── index.html    # Main page
    ├── admin.html    # Admin panel
    ├── css/          # Stylesheets
    └── js/           # Client-side JavaScript
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend

The frontend is served automatically by the backend server. Once the backend is running, access:
- Main app: http://localhost:5000
- Admin panel: http://localhost:5000/admin

## Features

- User authentication (register/login)
- Report lost items
- Report found items
- Match lost and found items
- Admin panel for management
- Real-time notifications with Socket.IO
- Image upload support

## Technologies Used

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Socket.IO
- Multer (file uploads)

**Frontend:**
- HTML5, CSS3, JavaScript
- Responsive design
