# Online Lost and Found Reporting System

A complete web application that allows users to report lost and found items, search and filter items, and receive automatic notifications when matching items are found.

## 🚀 Features

### Core Features
- **User Authentication**: Secure signup and login using JWT tokens
- **Password Security**: Passwords hashed using bcrypt
- **Lost Item Reporting**: Submit detailed reports with images
- **Found Item Reporting**: Report found items with complete details
- **Advanced Search & Filter**: Filter by category, location, and keywords
- **Automatic Matching**: Smart algorithm matches lost and found items
- **Real-time Notifications**: Socket.IO powered instant notifications
- **User Dashboard**: Track all reported items and their status
- **Responsive Design**: Mobile-friendly interface using Flexbox/Grid

### Advanced Features
- **Image Upload**: Multer-based image handling (max 5MB)
- **Real-time Updates**: Socket.IO for instant match notifications
- **Email Notifications**: Optional email alerts using Nodemailer
- **Admin Panel**: Manage all reports (admin role required)

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (Flexbox, Grid)
- Vanilla JavaScript
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Socket.IO for real-time features
- Nodemailer for emails (optional)

## 📁 Project Structure

```
lost-and-found-system/
├── models/
│   ├── User.js              # User schema
│   └── Item.js              # Item schema
├── routes/
│   ├── auth.js              # Authentication routes
│   └── items.js             # Item CRUD routes
├── middleware/
│   ├── auth.js              # JWT verification middleware
│   └── upload.js            # Multer configuration
├── utils/
│   └── matching.js          # Matching algorithm
├── public/
│   ├── index.html           # Main HTML file
│   ├── css/
│   │   └── style.css        # Styles
│   └── js/
│       └── app.js           # Frontend JavaScript
├── uploads/                 # Uploaded images (auto-created)
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md               # Documentation
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone or Extract Project
```bash
cd lost-and-found-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Edit the `.env` file with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lost-and-found
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d

# Optional: Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Step 4: Start MongoDB
Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod
```

Or use MongoDB Atlas (cloud) by updating MONGODB_URI in .env

### Step 5: Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Step 6: Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

## 📊 Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  role: String (enum: ['user', 'admin']),
  createdAt: Date
}
```

### Item Schema
```javascript
{
  type: String (enum: ['lost', 'found']),
  title: String (required),
  description: String (required),
  category: String (enum: categories),
  location: String (required),
  date: Date (required),
  image: String (optional),
  user: ObjectId (ref: User),
  status: String (enum: ['active', 'matched', 'resolved']),
  matchedWith: ObjectId (ref: Item),
  contactInfo: {
    name: String,
    email: String,
    phone: String
  },
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Items
- `POST /api/items` - Create new item (protected)
- `GET /api/items` - Get all items with filters
- `GET /api/items/my-items` - Get user's items (protected)
- `GET /api/items/:id` - Get single item
- `PUT /api/items/:id` - Update item (protected)
- `DELETE /api/items/:id` - Delete item (protected)
- `GET /api/items/admin/all` - Get all items (admin only)

### Query Parameters for GET /api/items
- `type` - Filter by lost/found
- `category` - Filter by category
- `location` - Filter by location (partial match)
- `search` - Text search in title/description
- `status` - Filter by status

## 🎯 Matching Algorithm

The system automatically matches items based on:
1. **Opposite Type**: Lost items match with found items and vice versa
2. **Same Category**: Items must be in the same category
3. **Similar Location**: Location matching (case-insensitive)
4. **Active Status**: Only matches active items

When a match is found:
- Both items' status updated to "matched"
- Real-time notification sent via Socket.IO
- Optional email notification sent to both users

## 🧪 Sample Test Data

### Test User 1
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

### Test User 2
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "+0987654321"
}
```

### Test Lost Item
```json
{
  "type": "lost",
  "title": "Black iPhone 13",
  "description": "Lost my black iPhone 13 with a blue case",
  "category": "mobile",
  "location": "Central Park",
  "date": "2024-01-15"
}
```

### Test Found Item
```json
{
  "type": "found",
  "title": "iPhone with blue case",
  "description": "Found an iPhone near the fountain",
  "category": "mobile",
  "location": "Central Park",
  "date": "2024-01-15"
}
```

## 🎨 Categories Available
- Mobile
- Wallet
- Documents
- Keys
- Bag
- Electronics
- Jewelry
- Clothing
- Other

## 🔐 Security Features
- JWT token-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Protected routes with middleware
- Role-based access control (user/admin)
- File upload validation (type and size)
- Input validation and sanitization

## 📱 Responsive Design
- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly interface
- Optimized images and assets

## 🚀 Deployment Tips

### For Production:
1. Change JWT_SECRET to a strong random string
2. Use MongoDB Atlas for database
3. Enable HTTPS
4. Set up proper CORS configuration
5. Use environment-specific configs
6. Enable email notifications
7. Set up proper logging
8. Use PM2 for process management

### Deploy to Heroku:
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

## 🎓 Viva Questions & Answers

### 1. What is JWT and why did you use it?
JWT (JSON Web Token) is a secure way to transmit information between parties. I used it for stateless authentication - the server doesn't need to store session data, making it scalable.

### 2. How does the matching algorithm work?
The algorithm compares new items with existing items of opposite type (lost vs found), matching by category and location. When a match is found, both users are notified in real-time.

### 3. What is middleware in Express?
Middleware functions have access to request and response objects. I used middleware for authentication (JWT verification), file uploads (Multer), and error handling.

### 4. How does Socket.IO work?
Socket.IO enables real-time bidirectional communication between client and server using WebSockets. I used it to send instant notifications when items are matched.

### 5. Why MongoDB over SQL?
MongoDB's flexible schema is perfect for this project as item attributes can vary. It's also easier to scale horizontally and works seamlessly with Node.js.

### 6. How is password security handled?
Passwords are hashed using bcrypt with 10 salt rounds before storing. The original password is never stored, and comparison is done using bcrypt's compare function.

### 7. What is Multer used for?
Multer is middleware for handling multipart/form-data, primarily for file uploads. I configured it to accept only images up to 5MB with unique filenames.

### 8. How would you improve this system?
- Add geolocation for precise location tracking
- Implement AI-based image matching
- Add chat feature between users
- SMS notifications
- Multi-language support
- Advanced analytics dashboard

## 📝 License
This project is created for educational purposes.

## 👨‍💻 Author
Created as a full-stack development project demonstrating MERN stack capabilities.

## 🤝 Support
For issues or questions, please create an issue in the repository.
