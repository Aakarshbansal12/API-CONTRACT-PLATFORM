const AppError = require('../utils/AppError');

// Each validator is just a plain object describing rules.
// The validate() middleware runs them before the controller touches req.body.

const validators = {
  createProject: (body) => {
    const errors = [];

    if (!body.name || typeof body.name !== 'string') {
      errors.push('name is required and must be a string');
    } else if (body.name.trim().length < 2) {
      errors.push('name must be at least 2 characters');
    } else if (body.name.trim().length > 100) {
      errors.push('name must be under 100 characters');
    }

    if (body.baseUrl && body.baseUrl.trim() !== '') {
      try {
        new URL(body.baseUrl); // built-in URL class throws if invalid
      } catch {
        errors.push('baseUrl must be a valid URL (e.g. https://api.example.com)');
      }
    }

    return errors;
  },

  updateProject: (body) => {
    const errors = [];

    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length < 2) {
        errors.push('name must be at least 2 characters');
      }
      if (body.name.trim().length > 100) {
        errors.push('name must be under 100 characters');
      }
    }

    if (body.baseUrl !== undefined && body.baseUrl.trim() !== '') {
      try {
        new URL(body.baseUrl);
      } catch {
        errors.push('baseUrl must be a valid URL');
      }
    }

    return errors;
  },
};

// Factory function — returns an Express middleware for the named validator
const validate = (validatorName) => {
  return (req, res, next) => {
    const validatorFn = validators[validatorName];
    if (!validatorFn) return next(); // no validator defined, skip

    const errors = validatorFn(req.body);
    if (errors.length > 0) {
      return next(new AppError(errors.join('. '), 400));
    }
    next();
  };
};

module.exports = { validate };