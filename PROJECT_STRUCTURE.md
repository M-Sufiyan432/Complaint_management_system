# JavaScript Version - Complete Folder Structure

```
complaint-management-system/
│
├── src/
│   ├── config/
│   │   └── database.js                 # Database configuration & connection
│   │
│   ├── controllers/
│   │   ├── authController.js           # Register & Login logic
│   │   ├── userController.js           # User profile & onboarding stage
│   │   └── complaintController.js      # Complaint CRUD & status updates
│   │
│   ├── entities/
│   │   ├── User.js                     # User entity/model
│   │   ├── Complaint.js                # Complaint entity/model
│   │   ├── Notification.js             # Notification entity/model
│   │   └── OnboardingReminder.js       # Onboarding reminder tracking
│   │
│   ├── middleware/
│   │   ├── auth.js                     # JWT authentication middleware
│   │   └── validation.js               # Request validation middleware
│   │
│   ├── routes/
│   │   ├── authRoutes.js               # Auth endpoints (/register, /login)
│   │   ├── userRoutes.js               # User endpoints (/user/*)
│   │   └── complaintRoutes.js          # Complaint endpoints (/complaints/*)
│   │
│   ├── services/
│   │   ├── notificationService.js      # Notification handling logic
│   │   └── onboardingService.js        # Onboarding reminder logic
│   │
│   ├── jobs/
│   │   └── cronScheduler.js            # Cron job initialization
│   │
│   ├── utils/
│   │   └── complaintValidation.js      # Complaint validation helpers
│   │
│   └── server.js                       # Application entry point
│
├── node_modules/                        # Dependencies (auto-generated)
│   └── ...
│
├── .env                                 # Environment variables (create from .env.example)
├── .env.example                         # Environment template
├── .gitignore                           # Git ignore rules
├── package.json                         # Project dependencies & scripts
├── setup-database.sql                   # Database setup script
├── PGADMIN_SETUP.md                     # PgAdmin setup guide
└── README.md                            # Project documentation
```

---

## Quick Setup Script

Save this as `create-js-structure.sh`:

```bash
#!/bin/bash

echo "Creating JavaScript project structure..."

# Create directories
mkdir -p src/{config,controllers,entities,middleware,routes,services,jobs,utils}

# Create source files
touch src/config/database.js
touch src/controllers/{authController.js,userController.js,complaintController.js}
touch src/entities/{User.js,Complaint.js,Notification.js,OnboardingReminder.js}
touch src/middleware/{auth.js,validation.js}
touch src/routes/{authRoutes.js,userRoutes.js,complaintRoutes.js}
touch src/services/{notificationService.js,onboardingService.js}
touch src/jobs/cronScheduler.js
touch src/utils/complaintValidation.js
touch src/server.js

# Create root files
touch package.json .env.example .gitignore README.md
touch setup-database.sql PGADMIN_SETUP.md

echo "✅ JavaScript project structure created successfully!"
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Copy .env.example to .env and configure"
echo "3. Create database in PostgreSQL"
echo "4. Run: npm start"
```

---

## Key Differences from TypeScript

### 1. **No Build Step**
- No `tsconfig.json`
- No `dist/` folder
- Run directly with Node.js

### 2. **Module System**
- Uses `require()` and `module.exports`
- No TypeScript decorators
- EntitySchema for TypeORM instead of decorators

### 3. **Dependencies**
JavaScript version uses:
- `nodemon` instead of `ts-node-dev`
- No TypeScript types packages

---

## Installation Commands

```bash
# Initialize project
npm init -y

# Install dependencies
npm install express bcryptjs jsonwebtoken pg typeorm dotenv express-validator node-cron reflect-metadata

# Install dev dependencies
npm install --save-dev nodemon
```

---

## Run Commands

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Check if server is running
curl http://localhost:3000/health
```

---

## Environment Setup

1. **Copy environment template:**
```bash
cp .env.example .env
```

2. **Edit `.env` file:**
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=complaint_system

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

CRON_SCHEDULE=*/5 * * * *
```

---

## Database Setup

### Using psql:
```bash
psql -U postgres -c "CREATE DATABASE complaint_system;"
```

### Using PgAdmin:
1. Open PgAdmin
2. Right-click Databases → Create → Database
3. Name: `complaint_system`
4. Save

---

## File Sizes (Approximate)

- **Small files** (<100 lines): middleware, utils, routes
- **Medium files** (100-200 lines): controllers, entities
- **Large files** (200+ lines): services

Total: ~2,300 lines of JavaScript code

---

## Advantages of JavaScript Version

✅ **Simpler Setup**: No build process required
✅ **Faster Development**: Direct execution with Node.js
✅ **Smaller Package**: No TypeScript compiler needed
✅ **Easy Debugging**: Direct source code inspection
✅ **Lower Learning Curve**: No type system to learn

---

## Testing the API

### 1. Register User
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 3. Get User Details
```bash
curl http://localhost:3000/user/details \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Create Complaint
```bash
curl -X POST http://localhost:3000/complaints \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "complaint_type": "technical_issue",
    "details": {
      "issue_description": "App crashes",
      "module": "Login"
    }
  }'
```

---

## Common Issues & Solutions

### Issue: "Cannot find module"
```bash
npm install
```

### Issue: Database connection error
- Check PostgreSQL is running
- Verify `.env` credentials
- Test: `psql -U postgres -d complaint_system`

### Issue: Port already in use
```bash
# Change PORT in .env or kill process
lsof -ti:3000 | xargs kill -9
```

---

## Project Features

✅ User authentication (JWT)
✅ Complaint management system
✅ Status transition validation
✅ Time-based metrics
✅ Smart notifications
✅ Onboarding reminders (cron-based)
✅ RESTful API design
✅ Clean architecture
✅ Separated business logic

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env` file
3. ✅ Create PostgreSQL database
4. ✅ Start server: `npm start`
5. ✅ Test APIs with curl or Postman
6. ✅ Monitor console for notifications
7. ✅ Check cron job logs (every 5 minutes)

**Your JavaScript backend is ready to use! 🚀**