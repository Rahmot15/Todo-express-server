import { Request, Response } from "express";
import { sendResponse } from "./utility/sendResponse";
import initDB, { pool } from "./config/db";
import config from "./config";

const express = require("express");
const app = express();
const port = config.port;

// parser
app.use(express.json());

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
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );

    return sendResponse(
      res,
      201,
      true,
      "user created successfully",
      result.rows[0]
    );
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
});

// get all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    return sendResponse(res, 200, true, "user fetch successfully", result.rows);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
});

// get single user
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return sendResponse(res, 404, false, "user not found");
    } else {
      return sendResponse(
        res,
        200,
        true,
        "single user fetch successfully",
        result.rows[0]
      );
    }
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
});

// update users
app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, req.params.id]
    );

    if (result.rows.length === 0) {
      return sendResponse(res, 404, false, "user not found");
    } else {
      return sendResponse(
        res,
        200,
        true,
        "update user successfully",
        result.rows[0]
      );
    }
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
});

// delete user
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rowsCount === 0) {
      return sendResponse(res, 404, false, "user not found");
    } else {
      return sendResponse(
        res,
        200,
        true,
        "user delete successfully",
        result.rows
      );
    }
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
});

// ToDos

// create todo
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING*`,
      [user_id, title]
    );
    return sendResponse(
      res,
      201,
      true,
      "todos created successfully",
      result.rows[0]
    );
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
});

// get all todos
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
    return sendResponse(
      res,
      200,
      true,
      "todos fetch successfully",
      result.rows
    );
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
});

// get single todo
app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return sendResponse(res, 404, false, "todo not found");
    } else {
      return sendResponse(
        res,
        200,
        true,
        "single todo fetch successfully",
        result.rows[0]
      );
    }
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
});

// update todo
app.put("/todos/:id", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos SET user_id=$1, title=$2 WHERE id=$3 RETURNING *`,
      [user_id, title, req.params.id]
    );

    if (result.rows.length === 0) {
      return sendResponse(res, 404, false, "todo not found");
    } else {
      return sendResponse(
        res,
        200,
        true,
        "update todo successfully",
        result.rows[0]
      );
    }
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
});

// delete todo
app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return sendResponse(res, 404, false, "todo not found");
    } else {
      return sendResponse(
        res,
        200,
        true,
        "todo delete successfully",
        result.rows
      );
    }
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
