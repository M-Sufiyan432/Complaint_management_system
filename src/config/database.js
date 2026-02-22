require("dotenv").config();
const { DataSource } = require("typeorm");

const UserEntity = require("../entities/User");
const { ComplaintEntity } = require("../entities/Complaint");
const { NotificationEntity } = require("../entities/Notification");
const OnboardingReminderEntity = require("../entities/OnboardingReminder");

const isProduction = process.env.NODE_ENV === "production";
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.Ren_Internal_Database_URL);

const AppDataSource = new DataSource({
  type: "postgres",
  
  // 🔥 Use DATABASE_URL in production
  ...(isProduction
    ? {
        url: process.env.Ren_Internal_Database_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST ,
        port: parseInt(process.env.DB_PORT ),
        username: process.env.DB_USERNAME ,
        password: process.env.DB_PASSWORD ,
        database: process.env.DB_DATABASE ,
      }),

  entities: [
    UserEntity,
    ComplaintEntity,
    NotificationEntity,
    OnboardingReminderEntity,
  ],
   
  synchronize: true,
  logging: true,
});

module.exports = { AppDataSource };
