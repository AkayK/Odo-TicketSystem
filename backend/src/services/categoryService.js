const categoryModel = require('../models/categoryModel');
const userModel = require('../models/userModel');
const { ValidationError, NotFoundError } = require('../utils/errors');

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 255;
const MAX_DESCRIPTION_LENGTH = 500;

function toCategoryDTO(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    department: row.department,
    departmentId: row.department_id,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
  };
}

async function validateDepartmentId(departmentId) {
  const departments = await userModel.findAllDepartments();
  if (!departments.some((d) => d.id === departmentId)) {
    throw new ValidationError('Invalid department selected');
  }
}

function validateName(name) {
  if (!name || name.trim().length < MIN_NAME_LENGTH) {
    throw new ValidationError(`Category name must be at least ${MIN_NAME_LENGTH} characters`);
  }
  if (name.trim().length > MAX_NAME_LENGTH) {
    throw new ValidationError(`Category name must be ${MAX_NAME_LENGTH} characters or fewer`);
  }
}

const categoryService = {
  async getAll() {
    const rows = await categoryModel.findAll();
    return rows.map(toCategoryDTO);
  },

  async getById(id) {
    const category = await categoryModel.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return toCategoryDTO(category);
  },

  async create({ name, description, departmentId }) {
    if (!name || !departmentId) {
      throw new ValidationError('Name and department are required');
    }

    const trimmedName = name.trim();
    validateName(trimmedName);
    await validateDepartmentId(departmentId);

    if (description && description.trim().length > MAX_DESCRIPTION_LENGTH) {
      throw new ValidationError(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer`);
    }

    const existing = await categoryModel.findByName(trimmedName);
    if (existing) {
      throw new ValidationError('A category with this name already exists');
    }

    const insertId = await categoryModel.create({
      name: trimmedName,
      description: description ? description.trim() : null,
      departmentId,
    });

    return this.getById(insertId);
  },

  async update(id, { name, description, departmentId }) {
    const existing = await categoryModel.findById(id);
    if (!existing) {
      throw new NotFoundError('Category not found');
    }

    const updateData = {};

    if (name !== undefined) {
      const trimmedName = name.trim();
      validateName(trimmedName);
      const duplicate = await categoryModel.findByNameExcluding(trimmedName, id);
      if (duplicate) {
        throw new ValidationError('A category with this name already exists');
      }
      updateData.name = trimmedName;
    }

    if (description !== undefined) {
      if (description && description.trim().length > MAX_DESCRIPTION_LENGTH) {
        throw new ValidationError(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer`);
      }
      updateData.description = description ? description.trim() : null;
    }

    if (departmentId !== undefined) {
      await validateDepartmentId(departmentId);
      updateData.departmentId = departmentId;
    }

    if (Object.keys(updateData).length === 0) {
      throw new ValidationError('No fields to update');
    }

    await categoryModel.update(id, updateData);
    return this.getById(id);
  },

  async toggleActive(id) {
    const category = await categoryModel.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const newStatus = !category.is_active;
    await categoryModel.setActive(id, newStatus);
    return this.getById(id);
  },

  async getDepartments() {
    return userModel.findAllDepartments();
  },
};

module.exports = categoryService;
