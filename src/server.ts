import express, { Request, Response } from "express";

const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("hello nayef! the assignment - 2 is running");
});

app.listen(port, () => {
  console.log(`The server is running on the port ${port}`);
});
