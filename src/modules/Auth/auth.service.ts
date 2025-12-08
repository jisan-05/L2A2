import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  if ((email as string) !== (email as string).toLowerCase()) {
    throw new Error("Email must be lowercase");
  }

  // Password validation
  if (!password) {
    throw new Error("Password is required");
  }
  if ((password as string).length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const hashedPass = await bcrypt.hash(password as string, 10);

  // Role validation
  const allowedRoles = ["admin", "customer"];
  if (!role || !allowedRoles.includes(role as string)) {
    throw new Error("Role must be either 'admin' or 'customer'");
  }

  const result = await pool.query(
    `INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role`,
    [name, email, hashedPass, phone, role]
  );
  return result;
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error("user not found");
  }
  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid Credentials");
  }

  const secret = config.jwtSecret as string;

  const token = jwt.sign(
    { id:user.id, name: user.name, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );

  const { password: _, ...safeUser } = user;

  return { token, user: safeUser };
};

export const authServices = {
  loginUser,
  createUser,
};
