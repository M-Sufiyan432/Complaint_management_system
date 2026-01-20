const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'OnboardingReminder',
  tableName: 'onboarding_reminders',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    user_id: {
      type: 'int'
    },
    stage: {
      type: 'int'
    },
    reminder_level: {
      type: 'int'
    },
    sent: {
      type: 'boolean',
      default: false
    },
    sent_at: {
      type: 'timestamp',
      nullable: true
    },
    created_at: {
      type: 'timestamp',
      createDate: true
    }
  }
});