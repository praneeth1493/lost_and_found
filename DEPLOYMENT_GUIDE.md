# Deployment Guide - Lost and Found System

## Table of Contents
1. [Local Development](#local-development)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Heroku Deployment](#heroku-deployment)
4. [Environment Variables](#environment-variables)
5. [Production Checklist](#production-checklist)

---

## Local Development

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start MongoDB (if local)
mongod

# Start development server
npm run dev
```

Access at: http://localhost:5000

---

## MongoDB Atlas Setup (Cloud Database)

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new project

### Step 2: Create Cluster
1. Click "Build a Cluster"
2. Choose FREE tier (M0)
3. Select region closest to you
4. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User
1. Click "Database Access" in left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `lostfound`
5. Password: Generate secure password
6. User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Click "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Clusters" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `lost-and-found`

Example:
```
mongodb+srv://lostfound:<password>@cluster0.xxxxx.mongodb.net/lost-and-found?retryWrites=true&w=majority
```

### Step 6: Update .env
```env
MONGODB_URI=mongodb+srv://lostfound:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/lost-and-found?retryWrites=true&w=majority
```

---

## Heroku Deployment

### Prerequisites
- Heroku account (free)
- Heroku CLI installed
- Git installed

### Step 1: Install Heroku CLI
```bash
# Windows (download installer)
https://devcenter.heroku.com/articles/heroku-cli

# Mac
brew tap heroku/brew && brew install heroku

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Prepare Application

Create `Procfile` in root directory:
```
web: node server.js
```

Update `package.json` to specify Node version:
```json
{
  "engines": {
    "node": "14.x",
    "npm": "6.x"
  }
}
```

### Step 4: Initialize Git (if not already)
```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 5: Create Heroku App
```bash
heroku create your-app-name
# Or let Heroku generate name:
heroku create
```

### Step 6: Set Environment Variables
```bash
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_secure_random_string"
heroku config:set JWT_EXPIRE="7d"
heroku config:set NODE_ENV="production"

# Optional: Email configuration
heroku config:set EMAIL_HOST="smtp.gmail.com"
heroku config:set EMAIL_PORT="587"
heroku config:set EMAIL_USER="your_email@gmail.com"
heroku config:set EMAIL_PASS="your_app_password"
```

### Step 7: Deploy
```bash
git push heroku main
# Or if using master branch:
git push heroku master
```

### Step 8: Open Application
```bash
heroku open
```

### Step 9: View Logs (if issues)
```bash
heroku logs --tail
```

---

## Environment Variables

### Required Variables
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_very_secure_random_string_here
JWT_EXPIRE=7d
```

### Optional Variables
```env
# Email Notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Generate Secure JWT Secret
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or online
https://www.grc.com/passwords.htm
```

---

## Production Checklist

### Security
- [ ] Change JWT_SECRET to strong random string
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Enable HTTPS (Heroku provides free SSL)
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Remove console.logs (or use proper logging)
- [ ] Validate all user inputs
- [ ] Set secure cookie flags (if using cookies)

### Performance
- [ ] Enable compression middleware
- [ ] Set up CDN for static files (optional)
- [ ] Configure caching headers
- [ ] Optimize images before upload
- [ ] Use connection pooling (MongoDB default)
- [ ] Add rate limiting (optional)

### Monitoring
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Set up performance monitoring
- [ ] Configure alerts for errors
- [ ] Monitor database performance

### Backup
- [ ] Enable MongoDB Atlas automated backups
- [ ] Export database regularly
- [ ] Backup uploaded images
- [ ] Version control all code

### Testing
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test file uploads
- [ ] Test matching algorithm
- [ ] Test on multiple devices
- [ ] Test real-time notifications

---

## Additional Deployment Options

### AWS EC2

1. Launch EC2 instance (Ubuntu)
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies
5. Configure environment variables
6. Use PM2 for process management
7. Configure Nginx as reverse proxy
8. Set up SSL with Let's Encrypt

### DigitalOcean

1. Create Droplet (Ubuntu)
2. Follow similar steps as AWS EC2
3. Use DigitalOcean's managed MongoDB (optional)

### Vercel (Frontend Only)

1. Deploy frontend to Vercel
2. Deploy backend to Heroku
3. Update API_URL in frontend
4. Configure CORS on backend

---

## Post-Deployment

### Update Frontend API URL

In `public/js/app.js`, update:
```javascript
// Change from:
const API_URL = 'http://localhost:5000/api';

// To:
const API_URL = 'https://your-app-name.herokuapp.com/api';

// Or use environment detection:
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : 'https://your-app-name.herokuapp.com/api';
```

### Update Socket.IO URL

In `public/js/app.js`, update:
```javascript
// Change from:
const socket = io('http://localhost:5000');

// To:
const socket = io('https://your-app-name.herokuapp.com');

// Or use environment detection:
const socket = io(window.location.origin);
```

---

## Troubleshooting

### Application Crashes
```bash
# View logs
heroku logs --tail

# Restart application
heroku restart
```

### Database Connection Issues
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check database user credentials
- Ensure database name is correct

### File Upload Issues
- Heroku has ephemeral filesystem
- Consider using AWS S3 or Cloudinary for production
- Files uploaded will be lost on dyno restart

### Socket.IO Not Working
- Ensure WebSocket support is enabled
- Check CORS configuration
- Verify Socket.IO client version matches server

---

## Scaling

### Heroku Dynos
```bash
# Scale to multiple dynos
heroku ps:scale web=2

# View current dynos
heroku ps
```

### Database Scaling
- Upgrade MongoDB Atlas tier
- Enable sharding for large datasets
- Add read replicas

### CDN for Static Files
- Use Cloudflare
- Use AWS CloudFront
- Use Fastly

---

## Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
```

### Database Maintenance
- Regular backups
- Monitor disk usage
- Optimize indexes
- Clean old data

### Monitoring
- Set up health check endpoint
- Monitor response times
- Track error rates
- Monitor user activity

---

## Cost Estimation

### Free Tier (Development)
- Heroku: Free (1 dyno)
- MongoDB Atlas: Free (512MB)
- Total: $0/month

### Production (Small Scale)
- Heroku Hobby: $7/month
- MongoDB Atlas M10: $57/month
- Total: ~$64/month

### Production (Medium Scale)
- Heroku Standard: $25-50/month
- MongoDB Atlas M30: $200/month
- CDN: $10-20/month
- Total: ~$235-270/month

---

## Support Resources

- Heroku Docs: https://devcenter.heroku.com/
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Node.js Docs: https://nodejs.org/docs/
- Express Docs: https://expressjs.com/

---

## Quick Commands Reference

```bash
# Heroku
heroku login
heroku create
heroku config:set KEY=value
heroku logs --tail
heroku restart
heroku ps
heroku open

# Git
git add .
git commit -m "message"
git push heroku main

# npm
npm install
npm start
npm run dev
npm update
```

---

**Deployment Status**: Ready for production! 🚀
