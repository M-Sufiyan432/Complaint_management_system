const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      length: 255,
    },
    role: {
      type: "enum",
      enum: ["user", "admin"],
      default: "user",
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable:true,
    },
    refresh_token: {
      type: "text",
      nullable: true,
    },
    profileImage: {
      type: "varchar",
      nullable: true,
    },
    // ✅ ADD THESE TWO
    reset_password_token: {
      type: "text",
      nullable: true,
    },
    reset_password_expires: {
      type: "timestamp",
      nullable: true,
    },

    onboarding_stage: {
      type: "int",
      default: 0,
    },
    onboarding_complete: {
      type: "boolean",
      default: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
provider: {
  type: "enum",
  enum: ["local", "oauth"],
  default: "local",
},

googleId: {
  type: "varchar",
  nullable: true,
},

githubId: {
  type: "varchar",
  nullable: true,
},
  },
  relations: {
    complaints: {
      target: "Complaint",
      type: "one-to-many",
      inverseSide: "user",
    },
    notifications: {
      target: "Notification",
      type: "one-to-many",
      inverseSide: "user",
    },
  },
});
