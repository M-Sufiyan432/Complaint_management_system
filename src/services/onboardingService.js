const { AppDataSource } = require('../config/database');
const { sendOnboardingReminder } = require('./notificationService');

const userRepository = AppDataSource.getRepository('User');
const reminderRepository = AppDataSource.getRepository('OnboardingReminder');

const REMINDER_SCHEDULES = [
  {
    stage: 0,
    reminders: [24, 72, 120]
  },
  {
    stage: 1,
    reminders: [12, 24]
  },
  {
    stage: 2,
    reminders: [24, 24, 72, 120]
  }
];

const processOnboardingReminders = async () => {
  console.log('\n🔔 Processing onboarding reminders...');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  try {
    const users = await userRepository.find({
      where: {
        onboarding_complete: false
      }
    });

    console.log(`Found ${users.length} users in onboarding`);

    for (const user of users) {
      await processUserReminders(user);
    }

    console.log('✅ Onboarding reminders processing complete\n');
  } catch (error) {
    console.error('❌ Error processing onboarding reminders:', error);
  }
};

const processUserReminders = async (user) => {
  const stage = user.onboarding_stage;
  const schedule = REMINDER_SCHEDULES.find(s => s.stage === stage);

  if (!schedule) {
    return;
  }

  const now = new Date();
  const userCreatedAt = new Date(user.created_at);

  for (let reminderLevel = 0; reminderLevel < schedule.reminders.length; reminderLevel++) {
    const hoursDelay = schedule.reminders[reminderLevel];
    const scheduledTime = new Date(userCreatedAt.getTime() + hoursDelay * 60 * 60 * 1000);

    if (now >= scheduledTime) {
      const existingReminder = await reminderRepository.findOne({
        where: {
          user_id: user.id,
          stage: stage,
          reminder_level: reminderLevel
        }
      });

      if (!existingReminder) {
        await sendReminder(user.id, stage, reminderLevel);
      } else if (!existingReminder.sent) {
        await sendReminder(user.id, stage, reminderLevel);
        existingReminder.sent = true;
        existingReminder.sent_at = now;
        await reminderRepository.save(existingReminder);
      }
    }
  }
};

const sendReminder = async (userId, stage, reminderLevel) => {
  const user = await userRepository.findOne({ where: { id: userId } });
  
  if (!user || user.onboarding_stage !== stage) {
    console.log(`⚠️  Skipping reminder for user ${userId} - stage changed`);
    return;
  }

  const reminder = reminderRepository.create({
    user_id: userId,
    stage: stage,
    reminder_level: reminderLevel,
    sent: true,
    sent_at: new Date()
  });

  await reminderRepository.save(reminder);
  await sendOnboardingReminder(userId, stage, reminderLevel);

  console.log(`✉️  Sent reminder to user ${userId}, stage ${stage}, level ${reminderLevel}`);
};

module.exports = {
  processOnboardingReminders,
  processUserReminders,
  sendReminder
};