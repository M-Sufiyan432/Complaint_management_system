require('dotenv').config();
const { DataSource } = require('typeorm');
const UserEntity = require('../entities/User');
const { ComplaintEntity } = require('../entities/Complaint');
const { NotificationEntity } = require('../entities/Notification');
const OnboardingReminderEntity = require('../entities/OnboardingReminder');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Pass@123',
  database: process.env.DB_DATABASE || 'complaint_system',
  entities: [UserEntity, ComplaintEntity, NotificationEntity, OnboardingReminderEntity],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development'
});

module.exports = { AppDataSource };