import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import { readdirSync } from "fs";
const morgan = require("morgan");
require("dotenv").config();

//@ts-ignore
const csrfProtection = csrf({ cookie: true });
// create express app
const app = express();

// db
mongoose
  //@ts-ignore
  .connect(process.env.DATABASE)
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

// apply middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// route
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));
//csfr

app.use(csrfProtection);

app.get("/api/csrf-token", (req: any, res: any) => {
  res.json({ csrfToken: req.csrfToken() });
});

// port
const port: string | number | undefined = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
