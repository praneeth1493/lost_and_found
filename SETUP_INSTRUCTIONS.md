# Quick Setup Instructions

## Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js installed (v14+): `node --version`
- ✅ MongoDB installed or MongoDB Atlas account
- ✅ npm installed: `npm --version`

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)
```bash
npm install
```

This installs:
- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- multer (file uploads)
- socket.io (real-time features)
- nodemailer (email notifications)
- cors (cross-origin requests)
- dotenv (environment variables)

### 2. Setup MongoDB (3 minutes)

#### Option A: Local MongoDB
```bash
# Start MongoDB service
mongod

# Or on Windows:
net start MongoDB

# Or on Mac with Homebrew:
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `.env` file with your connection string

### 3. Configure Environment (1 minute)
The `.env` file is already created. Update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lost-and-found
JWT_SECRET=change_this_to_random_string_in_production
JWT_EXPIRE=7d
```

**Important**: Change JWT_SECRET to a random string for security!

### 4. Create Uploads Folder (automatic)
The uploads folder is created automatically when you start the server.

### 5. Start the Server (1 minute)
```bash
# Development mode (auto-restart on changes)
npm run dev

# OR Production mode
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📱 Access the app at http://localhost:5000
```

### 6. Access the Application
Open your browser and go to:
```
http://localhost:5000
```

## Testing the Application

### Test Flow 1: User Registration & Login
1. Click "Sign Up"
2. Fill in details:
   - Name: John Doe
   - Email: john@test.com
   - Phone: 1234567890
   - Password: test123
3. Click "Sign Up"
4. You'll be automatically logged in

### Test Flow 2: Report Lost Item
1. After login, click "Report Item"
2. Select "Lost"
3. Fill in:
   - Title: Black iPhone 13
   - Description: Lost near fountain
   - Category: Mobile
   - Location: Central Park
   - Date: Today's date
4. Optionally upload an image
5. Click "Submit Report"

### Test Flow 3: Report Found Item (Create Match)
1. Open a new incognito/private window
2. Sign up with different email (jane@test.com)
3. Click "Report Item"
4. Select "Found"
5. Fill in:
   - Title: iPhone found
   - Description: Found iPhone near fountain
   - Category: Mobile (same as lost item)
   - Location: Central Park (same as lost item)
   - Date: Today's date
6. Submit
7. **You should see a notification about the match!**

### Test Flow 4: Browse & Search
1. Go to "Browse Items"
2. Try filters:
   - Filter by type (Lost/Found)
   - Filter by category
   - Search by keyword
3. Click on any item to see details

### Test Flow 5: Dashboard
1. Click "Dashboard"
2. View your statistics
3. See all your reported items
4. Check matched items

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in .env file or kill the process using port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Install dependencies
```bash
npm install
```

### Image Upload Not Working
**Solution**: Check if uploads folder exists and has write permissions
```bash
mkdir uploads
chmod 755 uploads
```

### JWT Token Invalid
**Solution**: Clear browser localStorage and login again
```javascript
// In browser console:
localStorage.clear()
```

## Email Notifications Setup (Optional)

To enable email notifications:

1. Get Gmail App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

2. Update .env:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

3. Restart server

## Creating Admin User

To create an admin user, use MongoDB shell:

```bash
# Connect to MongoDB
mongosh

# Use database
use lost-and-found

# Update user to admin
db.users.updateOne(
  { email: "john@test.com" },
  { $set: { role: "admin" } }
)
```

## Development Tips

### Watch for Changes
```bash
npm run dev
```
Uses nodemon to auto-restart on file changes

### View Logs
Server logs appear in terminal. Watch for:
- ✅ Success messages (green)
- ❌ Error messages (red)
- 📊 Request logs

### Test API with Postman
Import these endpoints:
- POST http://localhost:5000/api/auth/signup
- POST http://localhost:5000/api/auth/login
- GET http://localhost:5000/api/items
- POST http://localhost:5000/api/items

### Database GUI Tools
Use MongoDB Compass to view data:
1. Download from https://www.mongodb.com/products/compass
2. Connect to: mongodb://localhost:27017
3. Browse collections: users, items

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Can't login | Check MongoDB is running |
| Images not showing | Check uploads folder exists |
| No matches found | Ensure category and location match |
| Socket not connecting | Check port 5000 is not blocked |
| CORS error | Server and client must use same domain |

## Next Steps

After successful setup:
1. ✅ Test all features
2. ✅ Customize styling in public/css/style.css
3. ✅ Add more categories in models/Item.js
4. ✅ Configure email notifications
5. ✅ Deploy to production

## Production Deployment Checklist

Before deploying:
- [ ] Change JWT_SECRET to strong random string
- [ ] Use MongoDB Atlas instead of local MongoDB
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Set up error logging (e.g., Sentry)
- [ ] Enable email notifications
- [ ] Add rate limiting
- [ ] Set up backups
- [ ] Configure CDN for images

## Support

If you encounter issues:
1. Check this guide first
2. Review error messages in terminal
3. Check MongoDB connection
4. Verify all dependencies installed
5. Clear browser cache and localStorage

## Success Indicators

You'll know setup is successful when:
- ✅ Server starts without errors
- ✅ Can access http://localhost:5000
- ✅ Can sign up and login
- ✅ Can report items
- ✅ Can see items in browse section
- ✅ Matches are detected and notified
- ✅ Dashboard shows statistics

Enjoy using the Lost & Found System! 🎉
