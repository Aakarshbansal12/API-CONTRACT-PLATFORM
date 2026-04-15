const sequelize = require('../config/database');
const Project = require('./Project');
const Contract = require('./Contract');
const DiffReport = require('./DiffReport');
const Webhook = require('./Webhook');

// ── Associations ────────────────────────────────────────────

// A Project has many Contracts (one per endpoint version)
Project.hasMany(Contract, { foreignKey: 'projectId', as: 'contracts' });
Contract.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// A Project has many DiffReports
Project.hasMany(DiffReport, { foreignKey: 'projectId', as: 'diffReports' });
DiffReport.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// A DiffReport references two Contracts (old and new)
Contract.hasMany(DiffReport, { foreignKey: 'oldContractId', as: 'oldDiffs' });
Contract.hasMany(DiffReport, { foreignKey: 'newContractId', as: 'newDiffs' });
DiffReport.belongsTo(Contract, { foreignKey: 'oldContractId', as: 'oldContract' });
DiffReport.belongsTo(Contract, { foreignKey: 'newContractId', as: 'newContract' });

// A Project has many Webhooks
Project.hasMany(Webhook, { foreignKey: 'projectId', as: 'webhooks' });
Webhook.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

module.exports = { sequelize, Project, Contract, DiffReport, Webhook };