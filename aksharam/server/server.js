import express, { json } from "express";
import { createConnection } from "mysql2";
import cors from "cors";
import bookData from "./bookdata.json" assert { type: "json" };

const app = express();
app.use(cors());
app.use(json());

// const db = createConnection({
//   host: "desktop1",
//   user: "root",
//   password: "",
//   database: "aksharamdbnew",
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to database:", err);
//     return;
//   }
//   console.log("Connected to database");
// });

app.get("/getBookData", (req, res) => {
  res.json(bookData);
});

app.post("/saveBookData", (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "data saved" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
