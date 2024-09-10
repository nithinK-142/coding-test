import express from "express";
import cors from "cors";
import "dotenv/config";
import { handleFaviconRequest } from "./middleware/favicon.middleware";
import router from "./routes";

const app = express();

app.use(cors({ origin: "*", methods: "*" }));

app.use(express.json());

app.use(handleFaviconRequest);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(router);

// db connection
import dbConnect from "./config/db.config";
const port = process.env.PORT || 3001;
dbConnect()
  .then(() => {
    app.listen(port, () =>
      console.log(`⚙️ Server is running at port : ${port}`)
    );
  })
  // .then(() =>
  //   LoginModel.create({
  //     f_UserName: "admin",
  //     f_Pwd: "$2b$10$c5sWZi7wchuX9M3RCZTcQus1IIZLPxJZfbqUn9WzBRG8wl4AnPCTe",
  //   })
  // )
  .catch((err) => {
    console.log("MongoDB connection failed ", err);
  });

export default app;
