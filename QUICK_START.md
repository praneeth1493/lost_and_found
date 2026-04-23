# Quick Start Guide - 5 Minutes to Running App

## Prerequisites (1 minute)
```bash
# Check Node.js is installed
node --version
# Should show v14 or higher

# Check npm is installed
npm --version
```

If not installed, download from: https://nodejs.org/

## Installation (2 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start MongoDB
Choose one option:

**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - MongoDB Atlas (Cloud):**
1. Already configured in .env
2. Or update MONGODB_URI in .env with your connection string

### Step 3: Start Server
```bash
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📱 Access the app at http://localhost:5000
```

## Access Application (1 minute)
Open browser: **http://localhost:5000**

## Quick Test (1 minute)

### Create First User
1. Click "Sign Up"
2. Enter:
   - Name: Test User
   - Email: test@test.com
   - Phone: 1234567890
   - Password: test123
3. Click "Sign Up" → You're logged in!

### Report Lost Item
1. Click "Report Item"
2. Select "Lost"
3. Fill:
   - Title: Black iPhone
   - Description: Lost my phone
   - Category: Mobile
   - Location: Central Park
   - Date: Today
4. Click "Submit Report"

### Test Matching (Open New Incognito Window)
1. Sign up as different user (test2@test.com)
2. Report "Found" item:
   - Title: Found iPhone
   - Category: Mobile (same!)
   - Location: Central Park (same!)
3. Submit → **See match notification! 🎉**

## That's It!
Your Lost & Found System is running!

## Common Issues

**MongoDB not connecting?**
```bash
# Make sure MongoDB is running
mongod
```

**Port 5000 in use?**
Change PORT in .env file:
```
PORT=3000
```

**Need help?**
Check SETUP_INSTRUCTIONS.md for detailed guide.

## Next Steps
- Browse items
- Check dashboard
- Try search filters
- Upload images
- Read documentation

Enjoy! 🚀
