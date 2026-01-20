# 1. Create project structure
mkdir -p src/{config,controllers,entities,middleware,routes,services,jobs,utils}

# 2. Install dependencies
npm install express bcryptjs jsonwebtoken pg typeorm dotenv express-validator node-cron reflect-metadata nodemon

# 3. Create database
psql -U postgres -c "CREATE DATABASE complaint_system;"

# 4. Configure .env
cp .env.example .env
# Edit .env with your database credentials

# 5. Run server
npm run dev
```

### Folder Structure:
```
complaint-management-system/
├── src/
│   ├── config/database.js
│   ├── controllers/
│   ├── entities/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── jobs/
│   ├── utils/
│   └── server.js
├── .env
├── package.json
└── README.md