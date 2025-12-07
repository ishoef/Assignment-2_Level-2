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
  const id = req.params?.id;

  try {
    const result = await userService.getSingleUser(id!);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: `User not found by id ${id}`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: `User found by id ${id}`,
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
  const id = req.params.id;
  const { name, email, phone, role } = req.body;

  try {
    const result = await userService.updateUser(name, email, phone, role, id!);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found for update",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Updated Successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: `UpdateUser: ${err.message}`,
    });
  }
};

// Delete user by id
const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await userService.deleteUser(id!);
    if (result.rowCount === 0) {
      res.status(404).json({
        sucess: false,
        message: `User not found for deleting by id ${id}`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: `User deleted successfully by id ${id}`,
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
