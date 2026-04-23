# System Architecture Diagrams

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   HTML5      │  │    CSS3      │  │  JavaScript  │    │
│  │              │  │              │  │              │    │
│  │ - Structure  │  │ - Flexbox    │  │ - Fetch API  │    │
│  │ - Forms      │  │ - Grid       │  │ - DOM        │    │
│  │ - Modal      │  │ - Responsive │  │ - Events     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │           Socket.IO Client                       │     │
│  │         (Real-time Communication)                │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │              Express.js Server                   │     │
│  │                                                   │     │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────┐ │     │
│  │  │   Routes   │  │ Middleware │  │  Socket   │ │     │
│  │  │            │  │            │  │   .IO     │ │     │
│  │  │ - Auth     │  │ - JWT      │  │           │ │     │
│  │  │ - Items    │  │ - Multer   │  │ - Events  │ │     │
│  │  │ - Admin    │  │ - CORS     │  │ - Rooms   │ │     │
│  │  └────────────┘  └────────────┘  └───────────┘ │     │
│  │                                                   │     │
│  │  ┌────────────────────────────────────────────┐ │     │
│  │  │         Business Logic                     │ │     │
│  │  │                                            │ │     │
│  │  │  - Matching Algorithm                     │ │     │
│  │  │  - Notification System                    │ │     │
│  │  │  - File Upload Handler                    │ │     │
│  │  └────────────────────────────────────────────┘ │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │              MongoDB Database                    │     │
│  │                                                   │     │
│  │  ┌──────────────┐         ┌──────────────┐     │     │
│  │  │    Users     │         │    Items     │     │     │
│  │  │  Collection  │         │  Collection  │     │     │
│  │  │              │         │              │     │     │
│  │  │ - name       │         │ - type       │     │     │
│  │  │ - email      │         │ - title      │     │     │
│  │  │ - password   │         │ - category   │     │     │
│  │  │ - phone      │         │ - location   │     │     │
│  │  │ - role       │         │ - status     │     │     │
│  │  └──────────────┘         └──────────────┘     │     │
│  │                                                   │     │
│  │  Indexes:                                        │     │
│  │  - email (unique)                                │     │
│  │  - category + location + type (compound)         │     │
│  │  - title + description (text)                    │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Flow Diagram

### User Registration Flow
```
┌──────┐                                                    ┌──────────┐
│Client│                                                    │  Server  │
└──┬───┘                                                    └────┬─────┘
   │                                                             │
   │  1. POST /api/auth/signup                                  │
   │  { name, email, password, phone }                          │
   ├────────────────────────────────────────────────────────────>
   │                                                             │
   │                                    2. Validate Input        │
   │                                    ┌────────────────┐       │
   │                                    │ Check required │       │
   │                                    │ fields         │       │
   │                                    └────────────────┘       │
   │                                                             │
   │                                    3. Check Duplicate       │
   │                                    ┌────────────────┐       │
   │                                    │ Query MongoDB  │       │
   │                                    │ for email      │       │
   │                                    └────────────────┘       │
   │                                                             │
   │                                    4. Hash Password         │
   │                                    ┌────────────────┐       │
   │                                    │ bcrypt.hash()  │       │
   │                                    │ 10 salt rounds │       │
   │                                    └────────────────┘       │
   │                                                             │
   │                                    5. Create User           │
   │                                    ┌────────────────┐       │
   │                                    │ User.create()  │       │
   │                                    │ Save to DB     │       │
   │                                    └────────────────┘       │
   │                                                             │
   │                                    6. Generate JWT          │
   │                                    ┌────────────────┐       │
   │                                    │ jwt.sign()     │       │
   │                                    │ with user ID   │       │
   │                                    └────────────────┘       │
   │                                                             │
   │  7. Response: { success, token, user }                     │
   <────────────────────────────────────────────────────────────┤
   │                                                             │
   │  8. Store token in localStorage                            │
   │  9. Update UI (show dashboard)                             │
   │                                                             │
```

---

### Item Reporting & Matching Flow
```
┌──────┐                                                    ┌──────────┐
│Client│                                                    │  Server  │
└──┬───┘                                                    └────┬─────┘
   │                                                             │
   │  1. POST /api/items (with JWT token)                       │
   │  FormData: { type, title, category, location, image }     │
   ├────────────────────────────────────────────────────────────>
   │                                                             │
   │                                    2. Verify JWT            │
   │                                    ┌────────────────┐       │
   │                                    │ Middleware     │       │
   │                                    │ checks token   │       │
   │                                    └────────────────┘       │
   │                                                             │
   │                                    3. Process Image         │
   │                                    ┌────────────────┐       │
   │                                    │ Multer saves   │       │
   │                                    │ to uploads/    │       │
   │                                    └────────────────┘       │
   │                                                             │
   │                                    4. Create Item           │
   │                                    ┌────────────────┐       │
   │                                    │ Item.create()  │       │
   │                                    │ Save to DB     │       │
   │                                    └────────────────┘       │
   │                                                             │
   │                                    5. Find Matches          │
   │                                    ┌────────────────┐       │
   │                                    │ Query opposite │       │
   │                                    │ type items     │       │
   │                                    │ Same category  │       │
   │                                    │ Similar loc    │       │
   │                                    └────────────────┘       │
   │                                                             │
   │                                    6. If Match Found        │
   │                                    ┌────────────────┐       │
   │                                    │ Update status  │       │
   │                                    │ Link items     │       │
   │                                    │ Emit Socket.IO │       │
   │                                    │ Send email     │       │
   │                                    └────────────────┘       │
   │                                                             │
   │  7. Response: { success, item, matchesFound }              │
   <────────────────────────────────────────────────────────────┤
   │                                                             │
   │  8. Socket.IO: 'match-found' event                         │
   <────────────────────────────────────────────────────────────┤
   │                                                             │
   │  9. Show notification                                      │
   │  10. Reload items                                          │
   │                                                             │
```

---

## Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                               │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId (Primary Key)                                │
│ name: String                                                │
│ email: String (Unique Index)                                │
│ password: String (Hashed)                                   │
│ phone: String                                               │
│ role: String (enum: user, admin)                            │
│ createdAt: Date                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1:N Relationship
                            │ (One user can have many items)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Items                               │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId (Primary Key)                                │
│ type: String (enum: lost, found)                            │
│ title: String                                               │
│ description: String                                         │
│ category: String (enum: mobile, wallet, etc.)               │
│ location: String                                            │
│ date: Date                                                  │
│ image: String                                               │
│ user: ObjectId (Foreign Key → Users._id)                    │
│ status: String (enum: active, matched, resolved)            │
│ matchedWith: ObjectId (Foreign Key → Items._id)             │
│ contactInfo: {                                              │
│   name: String                                              │
│   email: String                                             │
│   phone: String                                             │
│ }                                                            │
│ createdAt: Date                                             │
│                                                              │
│ Indexes:                                                     │
│ - { category: 1, location: 1, type: 1 } (Compound)         │
│ - { title: 'text', description: 'text' } (Text Search)     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Self-referencing
                            │ (Item can match with another Item)
                            ▼
                    ┌───────────────┐
                    │  Matched Item │
                    └───────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                      │
└─────────────────────────────────────────────────────────────┘

1. User Signup/Login
   ┌──────────┐
   │  Client  │
   └────┬─────┘
        │
        │ POST /api/auth/login
        │ { email, password }
        ▼
   ┌──────────┐
   │  Server  │
   └────┬─────┘
        │
        │ 1. Find user by email
        │ 2. Compare password (bcrypt)
        │ 3. Generate JWT token
        │
        ▼
   ┌──────────────────────────┐
   │  JWT Token Generated     │
   │                          │
   │  Header: { alg, typ }    │
   │  Payload: { id, iat }    │
   │  Signature: HMAC SHA256  │
   └──────────────────────────┘
        │
        │ Return token to client
        ▼
   ┌──────────┐
   │  Client  │
   │          │
   │ Store in │
   │localStorage│
   └──────────┘

2. Protected Request
   ┌──────────┐
   │  Client  │
   └────┬─────┘
        │
        │ GET /api/items/my-items
        │ Authorization: Bearer <token>
        ▼
   ┌──────────┐
   │  Server  │
   └────┬─────┘
        │
        │ Middleware: protect()
        │
        ▼
   ┌──────────────────────────┐
   │  Verify JWT Token        │
   │                          │
   │  1. Extract token        │
   │  2. jwt.verify()         │
   │  3. Decode payload       │
   │  4. Get user ID          │
   │  5. Find user in DB      │
   └──────────────────────────┘
        │
        │ If valid: continue
        │ If invalid: 401 Unauthorized
        ▼
   ┌──────────┐
   │ Process  │
   │ Request  │
   └──────────┘
```

---

## Matching Algorithm Flow

```
┌─────────────────────────────────────────────────────────────┐
│              Matching Algorithm Flowchart                   │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  New Item    │
                    │  Reported    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Determine    │
                    │ Opposite Type│
                    └──────┬───────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Query Database:      │
                │ - Opposite type      │
                │ - Same category      │
                │ - Similar location   │
                │ - Status: active     │
                └──────┬───────────────┘
                       │
                       ▼
                ┌──────────────┐
                │ Matches      │
                │ Found?       │
                └──────┬───────┘
                       │
            ┌──────────┴──────────┐
            │                     │
           YES                   NO
            │                     │
            ▼                     ▼
    ┌───────────────┐      ┌──────────────┐
    │ Update Status │      │ Keep Status  │
    │ to "matched"  │      │ as "active"  │
    └───────┬───────┘      └──────────────┘
            │
            ▼
    ┌───────────────┐
    │ Link Items    │
    │ Together      │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ Emit Socket   │
    │ Notification  │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ Send Email    │
    │ (Optional)    │
    └───────────────┘
```

---

## File Upload Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  File Upload Process                        │
└─────────────────────────────────────────────────────────────┘

Client Side:
┌──────────────┐
│ User selects │
│ image file   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Create       │
│ FormData     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ POST request │
│ multipart/   │
│ form-data    │
└──────┬───────┘
       │
       ▼

Server Side:
┌──────────────┐
│ Multer       │
│ Middleware   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Validate:        │
│ - File type      │
│ - File size      │
│ - Extension      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Generate unique  │
│ filename:        │
│ item-timestamp-  │
│ random.ext       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Save to:         │
│ uploads/         │
│ directory        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Store filename   │
│ in database      │
└──────────────────┘
```

---

## Real-time Notification Flow

```
┌─────────────────────────────────────────────────────────────┐
│            Socket.IO Real-time Flow                         │
└─────────────────────────────────────────────────────────────┘

Server Initialization:
┌──────────────┐
│ Create HTTP  │
│ Server       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Initialize   │
│ Socket.IO    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Listen for   │
│ connections  │
└──────────────┘

Client Connection:
┌──────────────┐
│ Page loads   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Connect to   │
│ Socket.IO    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Connection   │
│ established  │
└──────────────┘

Match Event:
┌──────────────┐
│ Match found  │
│ in algorithm │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ io.emit()    │
│ 'match-found'│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ All clients  │
│ receive event│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Show         │
│ notification │
└──────────────┘
```

---

This architecture provides a clear visual representation of how all components interact in the Lost and Found System.
