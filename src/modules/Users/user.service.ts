import { pool } from "../../config/db";

// Get all Users
const getUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

// get user by id
const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

// Updata user by id
const updateUser = async (
  name: string,
  email: string,
  phone: string,
  role: string,
  id: string
) => {
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id = $5 RETURNING *`,
    [name, email, phone, role, id]
  );

  return result;
};

// Delete user by id
const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

  return result;
};

export const userService = {
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
