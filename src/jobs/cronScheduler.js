const cron = require('node-cron');
const { processOnboardingReminders } = require('../services/onboardingService');

const initializeCronJobs = () => {
  const cronSchedule = process.env.CRON_SCHEDULE || '*/5 * * * *';

  console.log(`🕐 Initializing cron job with schedule: ${cronSchedule}`);
  console.log('   (Running every 5 minutes by default)');

  cron.schedule(cronSchedule, async () => {
    await processOnboardingReminders();
  });

  console.log('✅ Cron jobs initialized successfully\n');
};

module.exports = { initializeCronJobs };