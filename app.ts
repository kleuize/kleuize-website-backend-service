import express from "express";
import cors from "cors";
import mongoose, { ConnectOptions } from "mongoose";
import csrf from "csurf";
import https from "https";
import path from "path";
import cookieParser from "cookie-parser";
import { readdirSync, readFileSync } from "fs";
const morgan = require("morgan");
require("dotenv").config();

//@ts-ignore
const csrfProtection = csrf({ cookie: true });
// create express app
const app = express();

// db
mongoose
  //@ts-ignore
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

// apply middlewares
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// route
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));
//csfr

app.use(csrfProtection);

app.get("/api/csrf-token", (req: any, res: any) => {
  res.json({ csrfToken: req.csrfToken() });
});

const httpsEnabled: string | undefined = process.env.HTTPS_ENABLED;
// port
const port: string | number | undefined = process.env.PORT || 5000;
const httpsPort: string | number | undefined = process.env.HTTPS_PORT || 443;

if (httpsEnabled === "true") {
  const key = readFileSync(path.join(__dirname, "./certs/key.pem")).toString();
  const cert = readFileSync(
    path.join(__dirname, "./certs/cert.pem")
  ).toString();

  const server = https.createServer(
    {
      key: key,
      cert: cert,
    },
    app
  );

  server.listen(httpsPort, () =>
    console.log(`Server is running on port ${httpsPort}`)
  );
} else {
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}
