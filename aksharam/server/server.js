import express, { json } from "express";
import { createConnection } from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(json());

const db = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "aksharamdb",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

app.get("/getBookData", (req, res) => {
  // res.json(bookData);
  const query = "SELECT * FROM ak_item";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
    res.status(200).json(results);
  });
});

// create
app.post("/saveBookData", (req, res) => {
  const { formData } = req.body;

  if (!formData) {
    return res.status(400).json({ message: "Missing formData" });
  }

  const { BookCode, BookNameEn, BookNameSa, Quantity, SellingPrice } = formData;

  if (!BookCode || !BookNameEn || !BookNameSa || !Quantity || !SellingPrice) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    INSERT INTO ak_item (BookCode, BookNameSa, BookNameEn, SellingPrice, Quantity)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    BookCode,
    BookNameSa,
    BookNameEn,
    parseInt(SellingPrice, 10),
    parseInt(Quantity, 10),
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ message: "Error inserting data" });
    }
    res.status(200).json({ message: "Data saved successfully" });
  });
});

// update
// app.put("/updateBookData", (req, res) => {
//   const { itemId, bookcode, booknamesa, bookname, sellingprice, quantity } =
//     req.body.formData;

//   if (
//     !itemId ||
//     !bookcode ||
//     !booknamesa ||
//     !bookname ||
//     !sellingprice ||
//     !quantity
//   ) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const query = `
//     UPDATE ak_item
//     SET BookCode = ?, BookNameSa = ?, BookNameEn = ?, SellingPrice = ?, Quantity = ?
//     WHERE ItemId = ?
//   `;

//   const values = [
//     bookcode,
//     booknamesa,
//     bookname,
//     parseInt(sellingprice, 10),
//     parseInt(quantity, 10),
//     itemId,
//   ];

//   db.query(query, values, (err, results) => {
//     if (err) {
//       console.error("Error updating data:", err);
//       return res.status(500).json({ message: "Error updating data" });
//     }
//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: "Book not found" });
//     }
//     res.status(200).json({ message: "Data updated successfully" });
//   });
// });

// delete
app.delete("/deleteBookData/:id", (req, res) => {
  const itemId = parseInt(req.params.id, 10);

  const query = "DELETE FROM ak_item WHERE ItemId = ?";

  db.query(query, [itemId], (err, results) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ message: "Error deleting data" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
