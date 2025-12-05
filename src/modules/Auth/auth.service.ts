import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  

  if (result.rows.length === 0) {
    throw new Error("user not found")
  }
  const user = result.rows[0];

  const match =await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid Credentials")
  }

  const secret = config.jwtSecret as string;

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );

  const { password: _, ...safeUser } = user;

  return { token, user:safeUser };
};

export const authServices = {
  loginUser,
};
