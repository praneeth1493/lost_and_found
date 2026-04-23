# Testing Guide - Lost and Found System

## Table of Contents
1. [Manual Testing](#manual-testing)
2. [API Testing](#api-testing)
3. [Feature Testing](#feature-testing)
4. [Test Scenarios](#test-scenarios)
5. [Browser Testing](#browser-testing)

---

## Manual Testing

### Prerequisites
- Application running on http://localhost:5000
- MongoDB connected
- Browser with developer tools

---

## Feature Testing

### 1. User Registration (Signup)

**Test Case 1.1: Successful Registration**
```
Steps:
1. Navigate to http://localhost:5000
2. Click "Sign Up" button
3. Fill in form:
   - Name: John Doe
   - Email: john@test.com
   - Phone: 1234567890
   - Password: test123
4. Click "Sign Up"

Expected Result:
✅ Success notification appears
✅ User is automatically logged in
✅ Redirected to dashboard
✅ Navigation shows "Dashboard", "Report Item", "Logout"
```

**Test Case 1.2: Duplicate Email**
```
Steps:
1. Try to register with same email again

Expected Result:
✅ Error message: "User already exists with this email"
```

**Test Case 1.3: Validation**
```
Steps:
1. Try to submit with empty fields
2. Try password less than 6 characters
3. Try invalid email format

Expected Result:
✅ Form validation prevents submission
✅ Appropriate error messages shown
```

---

### 2. User Login

**Test Case 2.1: Successful Login**
```
Steps:
1. Click "Login"
2. Enter:
   - Email: john@test.com
   - Password: test123
3. Click "Login"

Expected Result:
✅ Success notification
✅ Redirected to dashboard
✅ User menu appears
```

**Test Case 2.2: Invalid Credentials**
```
Steps:
1. Try login with wrong password

Expected Result:
✅ Error message: "Invalid credentials"
✅ User remains on login page
```

---

### 3. Report Lost Item

**Test Case 3.1: Report Lost Item**
```
Steps:
1. Login as user
2. Click "Report Item"
3. Select "Lost" radio button
4. Fill form:
   - Title: Black iPhone 13
   - Description: Lost my phone near fountain
   - Category: Mobile
   - Location: Central Park
   - Date: Today's date
5. Click "Submit Report"

Expected Result:
✅ Success notification
✅ Redirected to dashboard
✅ Item appears in "My Items"
✅ Status shows "Active"
```

**Test Case 3.2: Report with Image**
```
Steps:
1. Follow steps above
2. Upload an image (JPG/PNG, < 5MB)
3. Submit

Expected Result:
✅ Image uploaded successfully
✅ Image appears in item card
✅ Image stored in uploads folder
```

**Test Case 3.3: Image Validation**
```
Steps:
1. Try to upload non-image file (PDF, TXT)
2. Try to upload image > 5MB

Expected Result:
✅ Error message for invalid file type
✅ Error message for file too large
```

---

### 4. Report Found Item

**Test Case 4.1: Report Found Item**
```
Steps:
1. Login as different user (or use incognito)
2. Register as: jane@test.com
3. Click "Report Item"
4. Select "Found" radio button
5. Fill form:
   - Title: iPhone found
   - Description: Found iPhone near fountain
   - Category: Mobile (same as lost item)
   - Location: Central Park (same as lost item)
   - Date: Today's date
6. Submit

Expected Result:
✅ Success notification
✅ Match notification appears!
✅ "Potential matches found!" message
✅ Item status changes to "Matched"
```

---

### 5. Matching System

**Test Case 5.1: Perfect Match**
```
Setup:
- User A reports lost iPhone in Central Park
- User B reports found iPhone in Central Park

Expected Result:
✅ Both items matched automatically
✅ Status updated to "Matched"
✅ Real-time notification sent
✅ Both users can see match details
```

**Test Case 5.2: No Match**
```
Setup:
- User A reports lost wallet in Times Square
- User B reports found keys in Brooklyn

Expected Result:
✅ No match found (different category)
✅ Items remain "Active"
✅ No notification sent
```

**Test Case 5.3: Partial Match**
```
Setup:
- User A reports lost mobile in "Central Park"
- User B reports found mobile in "central park" (different case)

Expected Result:
✅ Match found (case-insensitive)
✅ Location matching works
```

---

### 6. Browse Items

**Test Case 6.1: View All Items**
```
Steps:
1. Click "Browse Items"
2. View items grid

Expected Result:
✅ All active items displayed
✅ Items show type badge (Lost/Found)
✅ Items show category and location
✅ Items show date
✅ Images displayed if available
```

**Test Case 6.2: Filter by Type**
```
Steps:
1. Select "Lost Items" from type filter
2. Click "Apply Filters"

Expected Result:
✅ Only lost items shown
✅ Found items hidden
```

**Test Case 6.3: Filter by Category**
```
Steps:
1. Select "Mobile" from category filter
2. Click "Apply Filters"

Expected Result:
✅ Only mobile items shown
✅ Other categories hidden
```

**Test Case 6.4: Search by Keyword**
```
Steps:
1. Enter "iPhone" in search box
2. Click "Apply Filters"

Expected Result:
✅ Only items with "iPhone" in title/description shown
```

**Test Case 6.5: Multiple Filters**
```
Steps:
1. Select Type: Lost
2. Select Category: Mobile
3. Enter Location: Central Park
4. Click "Apply Filters"

Expected Result:
✅ Only items matching ALL filters shown
```

**Test Case 6.6: Clear Filters**
```
Steps:
1. Apply some filters
2. Click "Clear" button

Expected Result:
✅ All filters reset
✅ All items shown again
```

---

### 7. Item Details

**Test Case 7.1: View Item Details**
```
Steps:
1. Click on any item card

Expected Result:
✅ Modal opens
✅ Full item details shown
✅ Contact information visible
✅ Image displayed (if available)
✅ Match information shown (if matched)
```

**Test Case 7.2: Close Modal**
```
Steps:
1. Click X button or outside modal

Expected Result:
✅ Modal closes
✅ Returns to items grid
```

---

### 8. Dashboard

**Test Case 8.1: View Dashboard**
```
Steps:
1. Login and click "Dashboard"

Expected Result:
✅ Statistics cards shown:
   - Total Items
   - Matched Items
   - Active Items
✅ All user's items displayed
✅ Items show current status
```

**Test Case 8.2: Dashboard Updates**
```
Steps:
1. Report new item
2. Check dashboard

Expected Result:
✅ Total items count increases
✅ New item appears in list
✅ Statistics update automatically
```

---

### 9. Real-time Notifications

**Test Case 9.1: Socket.IO Connection**
```
Steps:
1. Open browser console
2. Check for Socket.IO connection message

Expected Result:
✅ "New client connected" in server logs
✅ No connection errors
```

**Test Case 9.2: Match Notification**
```
Steps:
1. User A logged in on one browser
2. User B reports matching item on another browser

Expected Result:
✅ User A receives instant notification
✅ Notification shows match details
✅ Items auto-refresh
```

---

### 10. Logout

**Test Case 10.1: Logout**
```
Steps:
1. Click "Logout" button

Expected Result:
✅ Success notification
✅ Redirected to home page
✅ Auth-required sections hidden
✅ Login/Signup buttons shown
✅ Token removed from localStorage
```

---

## API Testing (Using Postman or curl)

### Setup Postman Collection

**Base URL**: `http://localhost:5000/api`

---

### 1. Authentication APIs

**POST /api/auth/signup**
```json
Request:
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "phone": "1234567890"
}

Expected Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "role": "user"
  }
}
```

**POST /api/auth/login**
```json
Request:
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}

Expected Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "...",
  "user": { ... }
}
```

**GET /api/auth/me**
```json
Request:
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE

Expected Response (200):
{
  "success": true,
  "user": { ... }
}
```

---

### 2. Items APIs

**POST /api/items**
```json
Request:
POST http://localhost:5000/api/items
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

Form Data:
- type: lost
- title: Black iPhone
- description: Lost my phone
- category: mobile
- location: Central Park
- date: 2024-01-15
- image: [file] (optional)

Expected Response (201):
{
  "success": true,
  "message": "Item reported successfully",
  "item": { ... },
  "matchesFound": 0
}
```

**GET /api/items**
```json
Request:
GET http://localhost:5000/api/items

Expected Response (200):
{
  "success": true,
  "count": 10,
  "items": [ ... ]
}
```

**GET /api/items?type=lost&category=mobile**
```json
Request:
GET http://localhost:5000/api/items?type=lost&category=mobile

Expected Response (200):
{
  "success": true,
  "count": 5,
  "items": [ ... filtered items ... ]
}
```

**GET /api/items/my-items**
```json
Request:
GET http://localhost:5000/api/items/my-items
Authorization: Bearer YOUR_TOKEN_HERE

Expected Response (200):
{
  "success": true,
  "count": 3,
  "items": [ ... user's items ... ]
}
```

**GET /api/items/:id**
```json
Request:
GET http://localhost:5000/api/items/507f1f77bcf86cd799439011

Expected Response (200):
{
  "success": true,
  "item": { ... }
}
```

---

## Browser Testing

### Browsers to Test
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (Chrome, Safari)

### Responsive Testing
- ✅ Desktop (1920x1080)
- ✅ Laptop (1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

---

## Performance Testing

### Load Time
```
Expected:
- Initial page load: < 2 seconds
- API response: < 500ms
- Image load: < 1 second
```

### Concurrent Users
```
Test:
- 10 users simultaneously
- All can register, login, report items
- No crashes or errors
```

---

## Security Testing

### Authentication
- ✅ Cannot access protected routes without token
- ✅ Invalid token returns 401
- ✅ Expired token returns 401
- ✅ Password not returned in responses

### Authorization
- ✅ Users can only edit/delete own items
- ✅ Admin can edit/delete any item
- ✅ Role-based access working

### File Upload
- ✅ Only images accepted
- ✅ File size limit enforced
- ✅ Malicious files rejected

---

## Test Data

### Test Users
```javascript
User 1:
- Name: John Doe
- Email: john@test.com
- Password: test123
- Phone: 1234567890

User 2:
- Name: Jane Smith
- Email: jane@test.com
- Password: test123
- Phone: 0987654321
```

### Test Items
```javascript
Lost Item:
- Type: lost
- Title: Black iPhone 13
- Description: Lost near fountain
- Category: mobile
- Location: Central Park
- Date: 2024-01-15

Found Item (Matching):
- Type: found
- Title: iPhone found
- Description: Found near fountain
- Category: mobile
- Location: Central Park
- Date: 2024-01-15
```

---

## Automated Testing (Future)

### Unit Tests (Jest)
```javascript
// Example test structure
describe('Matching Algorithm', () => {
  test('should match items with same category', () => {
    // Test logic
  });
});
```

### Integration Tests (Supertest)
```javascript
// Example API test
describe('POST /api/items', () => {
  test('should create new item', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send(itemData);
    expect(res.status).toBe(201);
  });
});
```

---

## Bug Reporting Template

```markdown
**Bug Title**: Brief description

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**:
What should happen

**Actual Result**:
What actually happened

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Node version: 14.17.0

**Screenshots**:
[Attach if applicable]

**Console Errors**:
[Paste any errors]
```

---

## Testing Checklist

### Before Submission
- [ ] All features working
- [ ] No console errors
- [ ] All API endpoints tested
- [ ] Responsive on all devices
- [ ] Images upload correctly
- [ ] Matching algorithm works
- [ ] Real-time notifications work
- [ ] Authentication secure
- [ ] Forms validate properly
- [ ] Error handling works

### Before Deployment
- [ ] All tests pass
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Database indexes created
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Error logging setup

---

**Testing Status**: Ready for comprehensive testing! ✅
