const pool = require('../config/database');

const userModel = {
  async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name,
              u.is_active, u.created_at, u.updated_at,
              r.name AS role,
              d.id AS department_id, d.name AS department
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.email = ?`,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.first_name, u.last_name,
              u.is_active, u.created_at, u.updated_at,
              r.name AS role,
              d.id AS department_id, d.name AS department
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findAll() {
    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.first_name, u.last_name,
              u.is_active, u.created_at, u.updated_at,
              r.name AS role,
              d.id AS department_id, d.name AS department
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN departments d ON u.department_id = d.id
       ORDER BY u.created_at DESC`
    );
    return rows;
  },
};

module.exports = userModel;
