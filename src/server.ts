import express, { Request, Response } from "express";
import initiDB from "./config/db";
import config from "./config";
import { userRoutes } from "./modules/Users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/Vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/Bookings/booking.routes";

const app = express();
app.use(express.json());
const port = config.port;

// DB
initiDB();

app.get("/", (req: Request, res: Response) => {
  res.send("hello nayef! the assignment - 2 is running");
});

app.use("/api/v1/auth", authRoutes); // auth
app.use("/api/v1/users", userRoutes); // Users
app.use("/api/v1/vehicles", vehicleRoutes); // Vehicle
app.use("/api/v1/bookings", bookingRoutes); // bookings

app.listen(port, () => {
  console.log(`The server is running on the port ${port}`);
});
