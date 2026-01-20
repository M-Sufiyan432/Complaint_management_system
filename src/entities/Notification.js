const { EntitySchema } = require('typeorm');

const NotificationType = {
  COMPLAINT_STATUS: 'complaint_status',
  ONBOARDING_REMINDER: 'onboarding_reminder'
};

module.exports = {
  NotificationType,
  NotificationEntity: new EntitySchema({
    name: 'Notification',
    tableName: 'notifications',
    columns: {
      id: {
        primary: true,
        type: 'int',
        generated: true
      },
      user_id: {
        type: 'int'
      },
      type: {
        type: 'enum',
        enum: Object.values(NotificationType)
      },
      title: {
        type: 'varchar',
        length: 500
      },
      body: {
        type: 'text'
      },
      is_sent: {
        type: 'boolean',
        default: false
      },
      metadata: {
        type: 'jsonb',
        nullable: true
      },
      created_at: {
        type: 'timestamp',
        createDate: true
      }
    },
    relations: {
      user: {
        target: 'User',
        type: 'many-to-one',
        joinColumn: {
          name: 'user_id'
        },
        onDelete: 'CASCADE'
      }
    }
  })
};