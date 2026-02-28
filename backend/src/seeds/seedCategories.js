require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedCategories() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const categories = [
      { name: 'Hardware Issue', description: 'Computer, printer, and peripheral problems', department: 'IT' },
      { name: 'Software Issue', description: 'Application errors and software requests', department: 'IT' },
      { name: 'Network Issue', description: 'Internet, VPN, and connectivity problems', department: 'IT' },
      { name: 'Payroll Inquiry', description: 'Salary, deductions, and payment questions', department: 'HR' },
      { name: 'Leave Request', description: 'Vacation, sick leave, and time-off requests', department: 'HR' },
      { name: 'Expense Report', description: 'Expense submissions and reimbursements', department: 'Finance' },
      { name: 'Budget Request', description: 'Budget allocation and approval requests', department: 'Finance' },
      { name: 'Facility Maintenance', description: 'Building repairs and maintenance requests', department: 'Operations' },
      { name: 'General Inquiry', description: 'General questions and miscellaneous requests', department: 'General' },
    ];

    for (const cat of categories) {
      const [depts] = await connection.execute(
        'SELECT id FROM departments WHERE name = ?',
        [cat.department]
      );

      if (depts.length === 0) {
        console.log(`Skipping "${cat.name}" — department "${cat.department}" not found`);
        continue;
      }

      await connection.execute(
        `INSERT INTO categories (name, description, department_id)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE description = VALUES(description), department_id = VALUES(department_id)`,
        [cat.name, cat.description, depts[0].id]
      );

      console.log(`Seeded category: ${cat.name} (${cat.department})`);
    }

    console.log('\nCategory seed completed successfully');
  } catch (error) {
    console.error('Category seed failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedCategories();
