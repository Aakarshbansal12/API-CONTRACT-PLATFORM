const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// A Contract is one snapshot of an API endpoint's response schema.
// Every time someone pastes a new JSON for an endpoint, a new Contract row is created.
const Contract = sequelize.define('Contract', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'project_id',
    references: {
      model: 'projects',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  endpointName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'endpoint_name',
    comment: 'Human-readable name like GET /users or POST /orders',
  },
  endpointPath: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'endpoint_path',
  },
  httpMethod: {
    type: DataTypes.ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE'),
    defaultValue: 'GET',
    field: 'http_method',
  },
  version: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'v1',
    comment: 'e.g. v1, v2, 2024-01-15',
  },
  schemaSnapshot: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'schema_snapshot',
    comment: 'The full JSON body pasted by the user — stored as-is',
  },
  schemaHash: {
    type: DataTypes.STRING(64),
    allowNull: true,
    field: 'schema_hash',
    comment: 'SHA-256 of the JSON — used to detect identical contracts fast',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Contract;
