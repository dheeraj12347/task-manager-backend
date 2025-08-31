import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.mjs";
import taskRoutes from "./routes/tasks.mjs";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Use Railway's assigned port OR 5000 locally
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Task Manager API is running ✅");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


