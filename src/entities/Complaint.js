const { EntitySchema } = require('typeorm');

const ComplaintType = {
  LIVE_DEMO: 'live_demo',
  BILLING_ISSUE: 'billing_issue',
  TECHNICAL_ISSUE: 'technical_issue',
  FEEDBACK: 'feedback'
};

const ComplaintStatus = {
  RAISED: 'raised',
  IN_PROGRESS: 'in_progress',
  WAITING_ON_USER: 'waiting_on_user',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

module.exports = {
  ComplaintType,
  ComplaintStatus,
  ComplaintEntity: new EntitySchema({
    name: 'Complaint',
    tableName: 'complaints',
    columns: {
      id: {
        primary: true,
        type: 'int',
        generated: true
      },
      user_id: {
        type: 'int'
      },
      complaint_type: {
        type: 'enum',
        enum: Object.values(ComplaintType)
      },
      status: {
        type: 'enum',
        enum: Object.values(ComplaintStatus),
        default: ComplaintStatus.RAISED
      },
      details: {
        type: 'jsonb'
      },
      created_at: {
        type: 'timestamp',
        createDate: true
      },
      updated_at: {
        type: 'timestamp',
        updateDate: true
      },
      status_updated_at: {
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
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