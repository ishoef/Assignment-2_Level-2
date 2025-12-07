import express, { Request, Response } from "express";
import initiDB from "./config/db";
import config from "./config";
import { userRoutes } from "./modules/Users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();
app.use(express.json());
const port = config.port;

// DB
initiDB();

app.get("/", (req: Request, res: Response) => {
  res.send("hello nayef! the assignment - 2 is running");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// Vehicle
app.use("/api/v1/vehicles", vehicleRoutes)

app.listen(port, () => {
  console.log(`The server is running on the port ${port}`);
});
