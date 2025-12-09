import { Request, Response } from "express";
import { bookingService } from "./booking.services";

const createBooking = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const booking = await bookingService.createBooking(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  try {
    const { isAdmin, bookings } = await bookingService.getBookings(
      role,
      userId
    );

    if (isAdmin) {
      // Admin response shape
      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings.map((b) => ({
          id: b.id,
          customer_id: b.customer_id,
          vehicle_id: b.vehicle_id,
          rent_start_date: b.rent_start_date,
          rent_end_date: b.rent_end_date,
          total_price: b.total_price,
          status: b.status,
          customer: {
            name: b.customer_name,
            email: b.customer_email,
          },
          vehicle: {
            vehicle_name: b.vehicle_name,
            registration_number: b.registration_number,
          },
        })),
      });
    }

    // Customer response shape
    return res.status(200).json({
      success: true,
      message: "Your bookings retrieved successfully",
      data: bookings.map((b) => ({
        id: b.id,
        vehicle_id: b.vehicle_id,
        rent_start_date: b.rent_start_date,
        rent_end_date: b.rent_end_date,
        total_price: b.total_price,
        status: b.status,
        vehicle: {
          vehicle_name: b.vehicle_name,
          registration_number: b.registration_number,
          type: b.type,
        },
      })),
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const updateBookings = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    const { updatedBooking, vehicleData } = await bookingService.updateBookings(
      role,
      userId,
      bookingId as string,
      status
    );

    if (status === "cancelled") {
      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: updatedBooking,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        ...updatedBooking,
        vehicle: vehicleData,
      },
    });
  } catch (err: any) {
    console.error(err);
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBookings,
};
