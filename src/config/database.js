require("dotenv").config();
const { DataSource } = require("typeorm");

const UserEntity = require("../entities/User");
const { ComplaintEntity } = require("../entities/Complaint");
const { NotificationEntity } = require("../entities/Notification");
const OnboardingReminderEntity = require("../entities/OnboardingReminder");


console.log("PGHOST:", process.env.PGHOST);

const isProduction = process.env.NODE_ENV === "production";
console.log("isProduction statement :", isProduction)

delete process.env.DATABASE_URL;
delete process.env.PGHOST;
delete process.env.PGPORT;
delete process.env.PGUSER;
delete process.env.PGPASSWORD;
delete process.env.PGDATABASE;

const AppDataSource = new DataSource({
  type: "postgres",

  ...(isProduction
  ? {
      type: "postgres",
      url: process.env.DB_CONN,

      ssl: {
        rejectUnauthorized: false,
      },

      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },

      // 🔥 ADD THIS (important)
      connectTimeoutMS: 10000,
    }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
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
