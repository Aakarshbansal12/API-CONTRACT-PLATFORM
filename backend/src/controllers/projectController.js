const { Project, Contract, DiffReport } = require('../models');
const AppError = require('../utils/AppError');

// ── GET /api/projects ────────────────────────────────────────
// Returns all projects, newest first, with a count of contracts
const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      order: [['createdAt', 'DESC']],
      // Include contract count without fetching all contract data
      attributes: {
        include: [
          [
            Project.sequelize.literal(
              '(SELECT COUNT(*) FROM contracts WHERE contracts.project_id = Project.id)'
            ),
            'contractCount',
          ],
        ],
      },
    });

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/projects ───────────────────────────────────────
const createProject = async (req, res, next) => {
  try {
    const { name, description, baseUrl } = req.body;

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || null,
      baseUrl: baseUrl?.trim() || null,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/projects/:id ────────────────────────────────────
// Returns one project with all its contracts
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: Contract,
          as: 'contracts',
          attributes: ['id', 'endpointName', 'endpointPath', 'httpMethod', 'version', 'createdAt'],
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/projects/:id ────────────────────────────────────
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    const { name, description, baseUrl, isActive } = req.body;

    // Only update fields that were actually sent — don't overwrite with undefined
    await project.update({
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(baseUrl !== undefined && { baseUrl: baseUrl.trim() }),
      ...(isActive !== undefined && { isActive }),
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/projects/:id ─────────────────────────────────
// Deletes project + cascades to contracts, diff reports, webhooks
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    await project.destroy();

    res.json({
      success: true,
      message: 'Project and all associated data deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/projects/:id/stats ──────────────────────────────
// Dashboard summary for one project
const getProjectStats = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    const contractCount = await Contract.count({
      where: { projectId: req.params.id },
    });

    const diffStats = await DiffReport.findOne({
      where: { projectId: req.params.id },
      attributes: [
        [DiffReport.sequelize.fn('COUNT', DiffReport.sequelize.col('id')), 'totalDiffs'],
        [DiffReport.sequelize.fn('SUM', DiffReport.sequelize.col('breaking_count')), 'totalBreaking'],
        [DiffReport.sequelize.fn('SUM', DiffReport.sequelize.col('warning_count')), 'totalWarnings'],
      ],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        project,
        stats: {
          contractCount,
          totalDiffs: parseInt(diffStats.totalDiffs) || 0,
          totalBreaking: parseInt(diffStats.totalBreaking) || 0,
          totalWarnings: parseInt(diffStats.totalWarnings) || 0,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats,
};