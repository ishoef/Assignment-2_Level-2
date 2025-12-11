import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

// Register User
const registerUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  if (!password || (password as string).length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const hashPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashPass, phone, role]
  );

  return result;
};

// Login User
const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return `User not found by this email ${email}`;
  }

  const user = result.rows[0];
  console.log(user);

  // Checking Password
  const matchPass = await bcrypt.compare(password, user.password);
  if (!matchPass) {
    return "Wrong credentials";
  }

  // Creating JWT
  const secret = config.jwt_secret as string;
  const token = jwt.sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "7d" }
  );

  console.log("token : ", { token });
  return { token: `Bearer ${token}`, user };
};

export const authService = {
  registerUser,
  loginUser,
};
