import { Request, Response } from "express";
import { userService } from "./user.service";

// Get Users
const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();
    res.status(200).json({
      success: true,
      message: "Users Get Successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: `No users found: ${err?.message}`,
    });
  }
};

// Get Single User
const getSingleUser = async (req: Request, res: Response) => {
  const userId = req.params?.userId;

  try {
    const result = await userService.getSingleUser(userId!);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: `User not found by id ${userId}`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: `User found by id ${userId}`,
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: `getSingleUser: ${err?.message}`,
    });
  }
};

// Update User Data
const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { name, email, phone, role } = req.body;

  try {
    const user = req.user;

    let finalRole = role;
    if (user?.role !== "admin") {
      finalRole = undefined; 
    }

    const result = await userService.updateUser(
      name,
      email,
      phone,
      finalRole,
      userId!
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found for update",
      });
    }

    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `UpdateUser: ${err.message}`,
    });
  }
};


// Delete user by id
const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = req.user;
  // console.log(user);
  try {
    const result = await userService.deleteUser(userId!);
    if (result.rowCount === 0) {
      res.status(404).json({
        sucess: false,
        message: `User not found for deleting by id ${userId}`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: `User deleted successfully by id ${userId}`,
      });
    }
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: `deleUser: ${err.message}`,
    });
  }
};

export const userController = {
  getUsers,
  getSingleUser,
  deleteUser,
  updateUser,
};
