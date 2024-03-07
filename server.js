const pg = require("pg");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(require("morgan")("dev"));

app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = "SELECT * FROM employees";
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/departments", async (req, res, next) => {
  try {
    const SQL = "SELECT * FROM departments ORDER BY name";
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/employees", async (req, res, next) => {
  try {
    const SQL = "INSERT INTO employees(name, title) VALUES($1, $2) RETURNING *";
    const response = await client.query(SQL, [req.body.name, req.body.title]);
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

app.put("/api/employees/:id", async (req, res, next) => {
  try {
    const SQL =
      "UPDATE employees SET name = $1, title = $2 WHERE id = $3 RETURNING *";
    const response = await client.query(SQL, [
      req.body.name,
      req.body.title,
      req.params.id,
    ]);
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const SQL = "DELETE FROM employees WHERE id = $1";
    await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

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
      name VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  INSERT INTO employees(name, title) VALUES('moe', 'CEO');
  INSERT INTO employees(name, title) VALUES('lucy', 'VP');
  INSERT INTO employees(name, title) VALUES('curly', 'Engineer');
  INSERT INTO employees(name, title) VALUES('larry', 'Engineer');
  INSERT INTO employees(name, title) VALUES('jane', 'CTO');

  INSERT INTO departments(name) SELECT name FROM employees WHERE title = 'Engineer';
  INSERT INTO departments(name) SELECT name FROM employees WHERE title = 'CEO';
  INSERT INTO departments(name) SELECT name FROM employees WHERE title = 'VP';
  INSERT INTO departments(name) SELECT name FROM employees WHERE title = 'CTO';
`;
  await client.query(SQL);
  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
}

init();
