import { pool } from "../../config/db";
import { vehicleService } from "../Vehicles/vehicle.service";

const createBooking = async (userId: string, body: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = body;

  // total days count function
  function getTotalDays(start_date: string, end_date: string): number {
    const start = new Date(start_date);
    const end = new Date(end_date);

    // If invalid date, return 0
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }

    const diffMs = end.getTime() - start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays;
  }

  // checking end date must be after start date
  const isValidDateRange = (start_date: string, end_date: string) => {
    return getTotalDays(start_date as string, end_date as string);
  };

  if (!isValidDateRange) {
    const error = new Error("rent_end_date must be after rent_start_date");
    throw error;
  }

  const vehicle = await vehicleService.getSingleVehicle(vehicle_id as string);
  if (!vehicle) {
    const error = new Error("Vehicle not found");
    throw error;
  }

  // vehicle availability check
  if (vehicle.rows[0].availability_status !== "available") {
    const error = new Error("vehicle is not available for booking");
    throw error;
  }

  const totalDays = getTotalDays(
    rent_start_date as string,
    rent_end_date as string
  );

  const total_price = totalDays * Number(vehicle.rows[0].daily_rent_price);

  if (total_price <= 0) {
    const error = new Error("Calculated total price must be greater than 0");
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO bookings
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  const booking = result.rows[0];

  await vehicleService.updateVehicleAvailability(
    vehicle_id as string,
    "booked"
  );

  return {
    ...booking,
    vehicle: {
      vehicle_name: vehicle.rows[0].vehicle_name,
      daily_rent_price: vehicle.rows[0].daily_rent_price,
    },
  };
};

const getBookings = async (role: string, userId: string) => {
  if (role === "admin") {
    const result = await pool.query(
      `
      SELECT
        b.*,
        u.name AS customer_name,
        u.email AS customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.created_at DESC
      `
    );

    return {
      isAdmin: true,
      bookings: result.rows,
    };
  }

  // Customer
  const result = await pool.query(
    `
    SELECT
      b.*,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.created_at DESC
    `,
    [userId]
  );

  return {
    isAdmin: false,
    bookings: result.rows,
  };
};

const updateBookings = async ( role: string, userId: string, bookingId: string, status: string ) => {
  if (!['cancelled', 'returned'].includes(status)) {
    const error = new Error("Status must be 'cancelled' or 'returned'");
    throw error;
  }

  // Find booking
  const bookingResult = await pool.query(
    'SELECT * FROM bookings WHERE id = $1',
    [bookingId]
  );
  const booking = bookingResult.rows[0];

  if (!booking) {
    const error = new Error('Booking not found');
    throw error;
  }

  // Authorization checks
  if (role === 'customer' && booking.customer_id !== userId) {
    const error = new Error('You are not allowed to update this booking');
    throw error;
  }

  if (role === 'customer' && status === 'returned') {
    const error = new Error('Customers cannot mark bookings as returned');
    throw error;
  }

  if (booking.status !== 'active') {
    const error = new Error('Only active bookings can be updated');
    throw error;
  }

  // Update booking status
  const updatedResult = await pool.query(
    `UPDATE bookings
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, bookingId]
  );
  const updatedBooking = updatedResult.rows[0];

  let vehicleData = null;

  // If cancelled or returned, make vehicle available again
  if (status === 'cancelled' || status === 'returned') {
    vehicleData = await vehicleService.updateVehicleAvailability(
      booking.vehicle_id,
      'available'
    );
  }

  return {
    updatedBooking,
    vehicleData
  };
}

export const bookingService = {
  createBooking,
  getBookings,
  updateBookings,
};
