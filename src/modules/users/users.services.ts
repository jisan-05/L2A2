import { Request, Response } from "express";

import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role from users`);
  return result;
};

const updateUser = async (payload: Record<string, unknown>, id: string) => {
  const { name, email, phone, role } = payload;

  const result = await pool.query(
    `UPDATE users SET name=$1,email=$2,phone=$3,role=$4 WHERE id=$5 RETURNING id,name,email,phone,role`,
    [name, email, phone, role,id]
  );
  return result;
};

const deleteVehicles = async(id:string) =>{
  const result = await pool.query(`DELETE FROM users WHERE id=$1`,[id])
  return result
}

export const usersServices = {
  getAllUsers,
  updateUser,
  deleteVehicles
};
