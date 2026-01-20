require('reflect-metadata');
require('dotenv').config();
const express = require('express');
const { AppDataSource } = require('./config/database');
const { initializeCronJobs } = require('./jobs/cronScheduler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');



const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/complaints', complaintRoutes);

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