import express from "express";
import { Application } from "express";

import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import { readdirSync } from "fs";

// Routes
import lectureRoutes from "./routes/lecture";
import userRoutes from "./routes/user";
import orderRoutes from "./routes/order";
import authRoutes from "./routes/auth";

const app: Application = express();

// middlewares
dotenv.config();
app.use(bodyParser.json({ limit: "30mb" }));
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("you hit server endpoint");
});

// here we will declare the routes path
readdirSync("./routes").map((r) => app.use("./api", require(`./routes/${r}`)));
app.use("/lectures", lectureRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);

export { app };
