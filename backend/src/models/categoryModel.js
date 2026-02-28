const pool = require('../config/database');

const categoryModel = {
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT c.id, c.name, c.description, c.is_active, c.created_at,
              d.id AS department_id, d.name AS department
       FROM categories c
       JOIN departments d ON c.department_id = d.id
       ORDER BY c.name`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT c.id, c.name, c.description, c.is_active, c.created_at,
              d.id AS department_id, d.name AS department
       FROM categories c
       JOIN departments d ON c.department_id = d.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByName(name) {
    const [rows] = await pool.execute(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );
    return rows[0] || null;
  },

  async findByNameExcluding(name, excludeId) {
    const [rows] = await pool.execute(
      'SELECT id FROM categories WHERE name = ? AND id != ?',
      [name, excludeId]
    );
    return rows[0] || null;
  },

  async create({ name, description, departmentId }) {
    const [result] = await pool.execute(
      `INSERT INTO categories (name, description, department_id)
       VALUES (?, ?, ?)`,
      [name, description || null, departmentId]
    );
    return result.insertId;
  },

  async update(id, { name, description, departmentId }) {
    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (departmentId !== undefined) { fields.push('department_id = ?'); values.push(departmentId); }

    if (fields.length === 0) return;

    values.push(id);
    await pool.execute(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async setActive(id, isActive) {
    await pool.execute(
      'UPDATE categories SET is_active = ? WHERE id = ?',
      [isActive, id]
    );
  },
};

module.exports = categoryModel;
