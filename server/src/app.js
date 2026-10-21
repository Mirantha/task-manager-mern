import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import taskRoutes from "./routes/taskRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// client-mira-dev-lk.vercel.app සහ client-xxxx-mira-dev-lk.vercel.app (preview URLs)
const vercelPattern = /^https:\/\/client(-[a-z0-9]+)?-mira-dev-lk\.vercel\.app$/;

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || vercelPattern.test(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => res.json({ message: "Task Manager API is running" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;