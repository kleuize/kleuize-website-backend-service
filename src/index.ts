import mongoose from "mongoose";
import { app } from "./app";

const port: string | number | undefined = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL, {
      // //   userNewUrlParser: true,
      //   useFindAndModify: false,
      //   useUnifiedTopology: true,
      //   useCreateIndex: true,
    });
    console.log("Connected to db ✅");
    app.listen(port, () => console.log("Server running on port", port));
  } catch (error) {
    console.log("Failed to connect to the db ❌");
    console.log(error);
  }
};

startServer();
