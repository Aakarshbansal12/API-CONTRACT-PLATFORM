const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// A Webhook is a URL registered by the user to receive notifications
// when a breaking change is detected in their project.
const Webhook = sequelize.define('Webhook', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'project_id',
    references: { model: 'projects', key: 'id' },
    onDelete: 'CASCADE',
  },
  url: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    validate: {
      isUrl: true,
      notEmpty: true,
    },
  },
  secret: {
    type: DataTypes.STRING(256),
    allowNull: true,
    comment: 'Optional HMAC secret — used to sign payloads so receivers can verify authenticity',
  },
  // Which severity levels should trigger this webhook
  triggerOnBreaking: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'trigger_on_breaking',
  },
  triggerOnWarning: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'trigger_on_warning',
  },
  triggerOnSafe: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'trigger_on_safe',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  lastTriggeredAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_triggered_at',
  },
  failureCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'failure_count',
    comment: 'Incremented on each failed delivery — auto-disable after 5 failures',
  },
});

module.exports = Webhook;