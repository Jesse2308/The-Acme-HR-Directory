const pg = require("pg");

const client = new pg.Client({
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost:5432/acme_HR_Directory",
});

async function init() {
  client.connect();

  const SQL = `
    DROP TABLE IF EXISTS departments;
    DROP TABLE IF EXISTS employees;

    CREATE TABLE employees(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        title VARCHAR(100)
    );

    CREATE TABLE departments(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    

    INSERT INTO employees(name, title) VALUES('moe', 'CEO');
    INSERT INTO employees(name, title) VALUES('lucy', 'VP');
    INSERT INTO employees(name, title) VALUES('curly', 'Engineer');
    INSERT INTO employees(name, title) VALUES('larry', 'Engineer');
    INSERT INTO employees(name, title) VALUES('jane', 'CTO');

    INSERT INTO departments(name) VALUES('Management'), (SELECT name FROM employees WHERE title = 'Engineer')
    INSERT INTO departments(name) VALUES('Engineering'), (SELECT name FROM employees WHERE title = 'CEO')
    INSERT INTO departments(name) VALUES('Sales'), (SELECT name FROM employees WHERE title = 'VP')
    INSERT INTO departments(name) VALUES('Marketing'), (SELECT name FROM employees WHERE title = 'CTO')
    
    `;
}
