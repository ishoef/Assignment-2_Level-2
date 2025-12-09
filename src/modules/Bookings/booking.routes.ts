import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", auth(), bookingController.createBooking);
router.get("/", auth(), bookingController.getBookings);
router.put("/:bookingId", auth(), bookingController.updateBookings);

export const bookingRoutes = router;
