import express, { Application, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { userRoutes } from "./routes/v1/user.routes";
import errorMiddleware from "./middlewares/error.middleware";
import { errorRoutes } from "../src/controllers/v1/error.routes";
import { authRoutes } from "./routes/v1/auth.routes";
const redis = require('redis');

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(urlencoded({ extended: true }));

const limiterAuth = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: "Too many requests from this IP, please try again after 10 minutes.",
});

const redisClient = redis.createClient();

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err:any) => {
  console.error('Redis error:', err);
});

redisClient.connect();

const limiterPrivate = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again after 10 minutes.",
});

// Public login route
app.use("/api/v1/auth", limiterAuth, authRoutes);

// User routes (protected/private routes included)
app.use("/api/v1/users", limiterPrivate, userRoutes);

app.use("/error", errorRoutes);

app.use(errorMiddleware);

export default app;
