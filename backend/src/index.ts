import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notifications";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("API is running 🚀");
});
app.use("/api", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});