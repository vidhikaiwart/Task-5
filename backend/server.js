import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB  from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(helmet());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Connect to database then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});