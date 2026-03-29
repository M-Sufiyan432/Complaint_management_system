require('reflect-metadata');
require('dotenv').config();
const express = require('express');
const { AppDataSource } = require('./config/database');
const { initializeCronJobs } = require('./jobs/cronScheduler');
const cors = require("cors");

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const cookieParser = require('cookie-parser');
const adminRouter = require('./routes/adminRoutes');
const passwordRoutes = require("./routes/passwordRoutes");
const passport = require("./config/passport")


const app = express();
const PORT = process.env.PORT || 3000;

app.use(passport.initialize())
app.use(express.json());
app.use(cookieParser());


const allowedOrigins = [
  "http://localhost:5173",
  "https://complaint-managment-frontend.onrender.com"
];



console.log("Process Env",process.env);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', authRoutes);
app.use("/", passwordRoutes);
app.use('/user', userRoutes);
app.use('/complaints', complaintRoutes);
app.use('/admin', adminRouter);

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});


app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Complaint Management System API is running',
    timestamp: new Date().toISOString()
  });
});

AppDataSource.initialize()
  .then(() => {
    console.log(' Database connection established');
    console.log(' Database:', process.env.DB_DATABASE);
    
    initializeCronJobs();

    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health check: http://localhost:${PORT}/health\n`);
    });
  })
  .catch((error) => {
    console.error(' Database connection failed:', error);
    process.exit(1);
  });