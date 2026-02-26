require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const users = [
      {
        email: 'admin@ticketsys.com',
        password: 'Admin123!',
        firstName: 'System',
        lastName: 'Admin',
        roleName: 'admin',
        departmentName: null,
      },
      {
        email: 'manager@ticketsys.com',
        password: 'Manager123!',
        firstName: 'IT',
        lastName: 'Manager',
        roleName: 'manager',
        departmentName: 'IT',
      },
      {
        email: 'worker@ticketsys.com',
        password: 'Worker123!',
        firstName: 'IT',
        lastName: 'Worker',
        roleName: 'worker',
        departmentName: 'IT',
      },
    ];

    for (const user of users) {
      const [roles] = await connection.execute(
        'SELECT id FROM roles WHERE name = ?',
        [user.roleName]
      );

      let departmentId = null;
      if (user.departmentName) {
        const [depts] = await connection.execute(
          'SELECT id FROM departments WHERE name = ?',
          [user.departmentName]
        );
        departmentId = depts[0]?.id || null;
      }

      const passwordHash = await bcrypt.hash(user.password, 12);

      await connection.execute(
        `INSERT INTO users (email, password_hash, first_name, last_name, role_id, department_id)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
        [user.email, passwordHash, user.firstName, user.lastName, roles[0].id, departmentId]
      );

      console.log(`Seeded user: ${user.email} (${user.roleName})`);
    }

    console.log('\nSeed completed successfully');
    console.log('\nTest Credentials:');
    console.log('─────────────────────────────────────────');
    console.log('Admin:      admin@ticketsys.com   / Admin123!');
    console.log('IT Manager: manager@ticketsys.com / Manager123!');
    console.log('IT Worker:  worker@ticketsys.com  / Worker123!');
    console.log('─────────────────────────────────────────');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
