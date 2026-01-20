const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    name: {
      type: 'varchar',
      length: 255
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true
    },
    password: {
      type: 'varchar',
      length: 255
    },
    onboarding_stage: {
      type: 'int',
      default: 0
    },
    onboarding_complete: {
      type: 'boolean',
      default: false
    },
    created_at: {
      type: 'timestamp',
      createDate: true
    }
  },
  relations: {
    complaints: {
      target: 'Complaint',
      type: 'one-to-many',
      inverseSide: 'user'
    },
    notifications: {
      target: 'Notification',
      type: 'one-to-many',
      inverseSide: 'user'
    }
  }
});