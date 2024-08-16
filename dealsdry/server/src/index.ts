import express from "express";
import cors from "cors";
import "dotenv/config";
import { handleFaviconRequest } from "./middleware/favicon.middleware";
import router from "./routes";
import path from "path";

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

app.use(express.json());
app.use(handleFaviconRequest);

app.use(router);

app.use("/public", express.static(path.join(__dirname, "..", "public")));

// db connection
import dbConnect from "./config/db.config";
const port = process.env.PORT || 3001;
dbConnect()
  .then(() => {
    app.listen(port, () =>
      console.log(`⚙️ Server is running at port : ${port}`)
    );
  })
  .catch((err) => {
    console.log("MongoDB connection failed ", err);
  });

export default app;
