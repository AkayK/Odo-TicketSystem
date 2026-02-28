const categoryService = require('../services/categoryService');
const logger = require('../utils/logger');
const { ValidationError } = require('../utils/errors');

function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError('Invalid category ID');
  }
  return id;
}

const categoryController = {
  async getAll(_req, res) {
    const categories = await categoryService.getAll();
    res.json({ success: true, data: categories });
  },

  async getById(req, res) {
    const id = parseId(req.params.id);
    const category = await categoryService.getById(id);
    res.json({ success: true, data: category });
  },

  async create(req, res) {
    const { name, description, departmentId } = req.body;
    const category = await categoryService.create({ name, description, departmentId });

    logger.info('Category created', { createdBy: req.user.id, categoryId: category.id, name: category.name });

    res.status(201).json({ success: true, data: category });
  },

  async update(req, res) {
    const id = parseId(req.params.id);
    const { name, description, departmentId } = req.body;
    const category = await categoryService.update(id, { name, description, departmentId });

    logger.info('Category updated', { updatedBy: req.user.id, categoryId: category.id });

    res.json({ success: true, data: category });
  },

  async toggleActive(req, res) {
    const id = parseId(req.params.id);
    const category = await categoryService.toggleActive(id);

    logger.info('Category active status toggled', { toggledBy: req.user.id, categoryId: category.id, isActive: category.isActive });

    res.json({ success: true, data: category });
  },

  async getDepartments(_req, res) {
    const departments = await categoryService.getDepartments();
    res.json({ success: true, data: departments });
  },
};

module.exports = categoryController;
