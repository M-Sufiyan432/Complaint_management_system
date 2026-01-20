# Complaint Management System API

A comprehensive backend system for managing user authentication, support tickets/complaints, and automated onboarding reminders built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **User Authentication & Authorization**
  - Secure user registration with password hashing (bcrypt)
  - JWT-based authentication
  - Protected API endpoints

- **Complaint/Ticket Management**
  - Multiple complaint types (Live Demo, Billing Issue, Technical Issue, Feedback)
  - Smart status transitions with validation
  - Real-time metrics tracking
  - Type-specific field validation

- **Automated Notifications**
  - Status change notifications
  - Separated notification logic for maintainability
  - Email-ready implementation (currently console-based)

- **Onboarding Reminder System**
  - Stage-based reminder schedules
  - Automated cron job processing
  - Prevents duplicate reminders
  - Stage-change aware system

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Onboarding System](#onboarding-system)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🛠 Tech Stack

- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Language:** JavaScript (ES6+)
- **Database:** PostgreSQL (v12+)
- **ORM:** TypeORM with EntitySchema
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Task Scheduling:** node-cron
- **Development:** nodemon

## 📁 Project Structure

```
complaint-management-system/
├── src/
│   ├── config/
│   │   └── database.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js        # Authentication endpoints
│   │   ├── userController.js        # User management
│   │   └── complaintController.js   # Complaint operations
│   ├── entities/
│   │   ├── User.js                  # User model
│   │   ├── Complaint.js             # Complaint model
│   │   ├── Notification.js          # Notification model
│   │   └── OnboardingReminder.js    # Reminder tracking model
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   └── validation.js            # Request validation
│   ├── routes/
│   │   ├── authRoutes.js            # Auth routes
│   │   ├── userRoutes.js            # User routes
│   │   └── complaintRoutes.js       # Complaint routes
│   ├── services/
│   │   ├── notificationService.js   # Notification logic
│   │   └── onboardingService.js     # Onboarding reminder logic
│   ├── jobs/
│   │   └── cronScheduler.js         # Cron job setup
│   ├── utils/
│   │   └── complaintValidation.js   # Validation helpers
│   └── server.js                    # Application entry point
├── .env                              # Environment variables
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies
├── setup-database.sql                # Database setup script
└── README.md                         # This file
```

## 🗄 Database Schema

### Users Table
```sql
- id (PK, AUTO_INCREMENT)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, HASHED)
- onboarding_stage (INT, DEFAULT 0)
- onboarding_complete (BOOLEAN, DEFAULT false)
- created_at (TIMESTAMP)
```

### Complaints Table
```sql
- id (PK, AUTO_INCREMENT)
- user_id (FK -> users.id)
- complaint_type (ENUM: live_demo, billing_issue, technical_issue, feedback)
- status (ENUM: raised, in_progress, waiting_on_user, resolved, closed)
- details (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- status_updated_at (TIMESTAMP)
```

### Notifications Table
```sql
- id (PK, AUTO_INCREMENT)
- user_id (FK -> users.id)
- type (ENUM: complaint_status, onboarding_reminder)
- title (VARCHAR)
- body (TEXT)
- is_sent (BOOLEAN, DEFAULT false)
- metadata (JSONB)
- created_at (TIMESTAMP)
```

### Onboarding Reminders Table
```sql
- id (PK, AUTO_INCREMENT)
- user_id (FK -> users.id)
- stage (INT)
- reminder_level (INT)
- sent (BOOLEAN, DEFAULT false)
- sent_at (TIMESTAMP)
- created_at (TIMESTAMP)
- UNIQUE(user_id, stage, reminder_level)
```

## 📦 Installation

### Prerequisites

Ensure you have the following installed:
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd complaint-management-system
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express
- bcryptjs
- jsonwebtoken
- pg
- typeorm
- dotenv
- express-validator
- node-cron
- reflect-metadata
- nodemon (dev dependency)

### Step 3: Setup PostgreSQL Database

**Using psql:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE complaint_system;

# Exit
\q
```

**Using PgAdmin:**
1. Open PgAdmin
2. Right-click on "Databases"
3. Select Create → Database
4. Database name: `complaint_system`
5. Owner: `postgres`
6. Click Save

**Optional - Run setup script:**
```bash
psql -U postgres -d complaint_system -f setup-database.sql
```

### Step 4: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use any text editor
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=complaint_system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

# Cron Job Configuration (runs every 5 minutes)
CRON_SCHEDULE=*/5 * * * *
```

### Environment Variables Explained

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Server port | 3000 | No |
| NODE_ENV | Environment mode | development | No |
| DB_HOST | PostgreSQL host | localhost | Yes |
| DB_PORT | PostgreSQL port | 5432 | Yes |
| DB_USERNAME | Database username | postgres | Yes |
| DB_PASSWORD | Database password | - | Yes |
| DB_DATABASE | Database name | complaint_system | Yes |
| JWT_SECRET | JWT signing secret | - | Yes |
| JWT_EXPIRES_IN | Token expiration time | 7d | No |
| CRON_SCHEDULE | Cron schedule pattern | */5 * * * * | No |

## 🏃 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Verify Server is Running
```bash
# Health check endpoint
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Complaint Management System API is running",
  "timestamp": "2026-01-20T10:30:00.000Z"
}
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Authentication Endpoints

#### 1. Register User

**POST** `/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "onboarding_stage": 0
  }
}
```

**Validation:**
- `name`: Required, non-empty
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

---

#### 2. Login User

**POST** `/login`

Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "onboarding_stage": 0
  }
}
```

---

### 👤 User Endpoints

#### 3. Get User Details

**GET** `/user/details`

Get current authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-01-19T10:00:00.000Z",
  "onboarding_stage": 0,
  "complaints_count": 3,
  "onboarding_complete": false
}
```

---

#### 4. Update Onboarding Stage

**PATCH** `/user/onboarding-stage`

Update user's onboarding stage (for testing purposes).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "stage": 1
}
```

**Response (200 OK):**
```json
{
  "message": "Onboarding stage updated successfully",
  "onboarding_stage": 1,
  "onboarding_complete": false
}
```

**Valid Stages:** 0, 1, 2

---

### 🎫 Complaint Endpoints

#### 5. Create Complaint

**POST** `/complaints`

Create a new complaint/support ticket.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body Examples:**

**Live Demo Request:**
```json
{
  "complaint_type": "live_demo",
  "details": {
    "preferred_date": "2026-02-15",
    "preferred_time": "14:00",
    "business_name": "Tech Solutions Inc",
    "contact_number": "+919876543210",
    "demo_type": "online"
  }
}
```

**Technical Issue:**
```json
{
  "complaint_type": "technical_issue",
  "details": {
    "module": "User Dashboard",
    "platform": "Web",
    "error_code": "ERR_500",
    "issue_description": "Dashboard not loading after login",
    "attachments": ["screenshot.png", "console_error.txt"]
  }
}
```

**Billing Issue:**
```json
{
  "complaint_type": "billing_issue",
  "details": {
    "invoice_id": "INV-2026-0120",
    "transaction_id": "TXN_987654",
    "amount": 2999,
    "currency": "INR",
    "issue_reason": "Duplicate charge on credit card"
  }
}
```

**Feedback:**
```json
{
  "complaint_type": "feedback",
  "details": {
    "category": "feature_request",
    "message": "Please add dark mode to the application"
  }
}
```

**Response (201 Created):**
```json
{
  "message": "Complaint created successfully",
  "complaint": {
    "id": 5,
    "complaint_type": "technical_issue",
    "status": "raised",
    "created_at": "2026-01-20T10:30:00.000Z"
  }
}
```

**Required Fields by Type:**
- **live_demo:** preferred_date, preferred_time, business_name, contact_number, demo_type
- **technical_issue:** issue_description
- **billing_issue:** invoice_id, amount, currency, issue_reason
- **feedback:** No mandatory fields

---

#### 6. Update Complaint Status

**PATCH** `/complaints/:id/status`

Update the status of a complaint.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Response (200 OK):**
```json
{
  "message": "Complaint status updated successfully",
  "complaint": {
    "id": 5,
    "status": "in_progress",
    "status_updated_at": "2026-01-20T11:00:00.000Z"
  }
}
```

**Valid Status Transitions:**
```
raised → in_progress, closed
in_progress → waiting_on_user, resolved, closed
waiting_on_user → in_progress, resolved, closed
resolved → closed
closed → (no transitions allowed)
```

**Special Behaviors:**
- Changing to `in_progress` triggers notification
- Changing to `resolved` triggers notification
- Invalid transitions return 400 error

---

#### 7. Get Complaint Metrics

**GET** `/complaints/:id/metrics`

Get time-based metrics for a complaint.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "complaint_id": 5,
  "current_status": "in_progress",
  "time_in_current_status_minutes": 120,
  "total_time_minutes": 450
}
```

**Metrics Calculated:**
- `time_in_current_status_minutes`: Time since last status change
- `total_time_minutes`: Time since complaint creation

---

## 🔔 Onboarding System

The system automatically sends reminders to users based on their onboarding stage.

### Reminder Schedules

#### Stage 0 (Getting Started)
- **24 hours** after account creation
- **72 hours** (3 days) after account creation
- **120 hours** (5 days) after account creation

#### Stage 1 (Basic Setup)
- **12 hours** after entering stage 1
- **24 hours** after entering stage 1

#### Stage 2 (Advanced Features)
- **24 hours** after entering stage 2
- **24 hours** (repeated)
- **72 hours** (3 days) after entering stage 2
- **120 hours** (5 days) after entering stage 2

### Reminder Rules

✅ **Sent only once per stage/level**
✅ **Only if user is still in that stage**
✅ **Automatically cancelled if user advances**
✅ **Unique message for each reminder**
✅ **Runs via cron job every 5 minutes**

### Testing Onboarding

```bash
# 1. Register a user
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# 2. Wait or manually trigger (for testing, modify user created_at in DB)

# 3. Update stage to test different reminders
curl -X PATCH http://localhost:3000/user/onboarding-stage \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"stage": 1}'

# 4. Check console logs for reminder notifications
```

## 🧪 Testing

### Using cURL

**Complete Testing Flow:**

```bash
# 1. Health Check
curl http://localhost:3000/health

# 2. Register User
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "secure123"
  }'

# Save the token from response
TOKEN="paste_token_here"

# 3. Get User Details
curl http://localhost:3000/user/details \
  -H "Authorization: Bearer $TOKEN"

# 4. Create a Complaint
curl -X POST http://localhost:3000/complaints \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "complaint_type": "technical_issue",
    "details": {
      "issue_description": "Cannot upload files",
      "module": "File Manager",
      "platform": "Web"
    }
  }'

# 5. Update Complaint Status (replace :id with actual ID)
curl -X PATCH http://localhost:3000/complaints/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'

# 6. Get Complaint Metrics
curl http://localhost:3000/complaints/1/metrics \
  -H "Authorization: Bearer $TOKEN"

# 7. Update Onboarding Stage
curl -X PATCH http://localhost:3000/user/onboarding-stage \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stage": 1}'
```

### Using Postman

1. Import the following collection or create requests manually
2. Set up environment variable for `BASE_URL`: `http://localhost:3000`
3. After login/register, save token as environment variable
4. Use `{{token}}` in Authorization headers

### Testing Checklist

- [ ] User registration works
- [ ] User login returns valid JWT
- [ ] Protected endpoints require authentication
- [ ] User details endpoint returns correct data
- [ ] Complaint creation validates required fields
- [ ] Status transitions enforce valid flows
- [ ] Complaint metrics calculate correctly
- [ ] Notifications appear in console logs
- [ ] Onboarding reminders trigger (check cron logs)
- [ ] Stage changes invalidate old reminders

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error:**
```
❌ Database connection failed: Error: connect ECONNREFUSED
```

**Solutions:**
- Check PostgreSQL is running: `sudo service postgresql status`
- Verify database exists: `psql -U postgres -l | grep complaint_system`
- Check credentials in `.env` file
- Ensure PostgreSQL is accepting connections on port 5432

```bash
# Start PostgreSQL
sudo service postgresql start

# Or on macOS
brew services start postgresql
```

---

#### 2. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# Or change PORT in .env file
PORT=3001
```

---

#### 3. JWT Token Invalid

**Error:**
```json
{
  "error": "Invalid or expired token"
}
```

**Solutions:**
- Check token is included in Authorization header
- Verify format: `Authorization: Bearer <token>`
- Token may have expired (default: 7 days)
- Login again to get new token

---

#### 4. Cannot Find Module

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

#### 5. TypeORM Synchronize Issues

**Error:**
```
Database schema out of sync
```

**Solutions:**
- Set `synchronize: true` in development (already set)
- Drop and recreate database (WARNING: loses data):
```bash
psql -U postgres -c "DROP DATABASE complaint_system;"
psql -U postgres -c "CREATE DATABASE complaint_system;"
```

---

#### 6. Cron Job Not Running

**Check:**
- Look for cron initialization message in console
- Verify CRON_SCHEDULE format in `.env`
- Check console every 5 minutes for processing logs

**Test manually:**
```javascript
// Add to server.js temporarily
const { processOnboardingReminders } = require('./services/onboardingService');
processOnboardingReminders(); // Run immediately
```

---

## 📊 Monitoring & Logs

### Console Output

The application logs important events:

```
✅ Database connection established
📊 Database: complaint_system
🕐 Initializing cron job with schedule: */5 * * * *
✅ Cron jobs initialized successfully

🚀 Server is running on port 3000
🌐 Environment: development
📍 Health check: http://localhost:3000/health
```

### Notification Logs

When notifications are sent:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 NOTIFICATION SENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: User ID 1
Type: complaint_status
Title: Complaint Update: Now In Progress
Body: Your complaint #5 regarding technical_issue is now being processed...
Sent At: 2026-01-20T11:00:00.000Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Cron Job Logs

Every 5 minutes:
```
🔔 Processing onboarding reminders...
Timestamp: 2026-01-20T11:05:00.000Z
Found 3 users in onboarding
✉️  Sent reminder to user 1, stage 0, level 0
✅ Onboarding reminders processing complete
```

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use strong, unique `JWT_SECRET` (min 32 characters)
- [ ] Set secure database password
- [ ] Disable `synchronize` in TypeORM (set to `false`)
- [ ] Set up proper logging (Winston, Morgan)
- [ ] Configure CORS if needed
- [ ] Set up SSL/TLS for database
- [ ] Use environment secrets management
- [ ] Set up monitoring (PM2, New Relic)
- [ ] Configure reverse proxy (nginx)
- [ ] Set up automated backups

### Recommended Production Setup

```bash
# Use PM2 for process management
npm install -g pm2

# Start application
pm2 start src/server.js --name complaint-api

# View logs
pm2 logs complaint-api

# Monitor
pm2 monit

# Restart on crashes
pm2 startup
pm2 save
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- MD Sufiyan Abdul haque - Initial work


**Built with ❤️ using Node.js and PostgreSQL**