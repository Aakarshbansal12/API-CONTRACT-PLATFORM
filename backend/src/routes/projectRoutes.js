const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats,
} = require('../controllers/projectController');
const { validate } = require('../middlewares/validate');

// Collection routes
router.route('/')
  .get(getAllProjects)
  .post(validate('createProject'), createProject);

// Stats route — must be before /:id so Express doesn't treat "stats" as an id
router.get('/:id/stats', getProjectStats);

// Single resource routes
router.route('/:id')
  .get(getProjectById)
  .put(validate('updateProject'), updateProject)
  .delete(deleteProject);

module.exports = router;