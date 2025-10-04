
import express from "express"
import helmet from "helmet"
import cors from 'cors'
import { errorMiddleware } from "./middlewares/error.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import adminRoutes from "./routes/adminRoutes.js";




dotenv.config({ path: './.env', });

export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI;

connectDB(mongoURI);

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: envMode !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',  // frontend URL
  credentials: true                 // agar cookie/token bhejna hai
}));





// Admin routes
app.use("/admin", adminRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("🏏 Indoor Booking System API Running 🚀");
});

// Global error handler
app.use(errorMiddleware)

app.listen(port, () => console.log('Server is working on Port:' + port + ' in ' + envMode + ' Mode.'));
