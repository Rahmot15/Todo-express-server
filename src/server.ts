import { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";
import { sendResponse } from "./utility/sendResponse";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const express = require("express");
const app = express();
const port = 5000;

// parser
app.use(express.json());

// DB
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

  await pool.query(`
            CREATE TABLE IF NOT EXISTS todos(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
};

initDB();

// root route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World.......This is a Todo server!");
});

// create users
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`, [name, email]
    );

    return sendResponse(res, 201, true, "user created successfully", result.rows[0]);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
