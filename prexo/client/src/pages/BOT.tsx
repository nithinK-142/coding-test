import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export interface IBotBag {
  _id: string;
  bagId: string;
  status: "Open" | "Pre-Closure" | "Closed";
  dateOfClosure: Date;
  max: number;
  valid: number;
  invalid: number;
  duplicate: number;
  total: number;
  orders: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IErrorResponse {
  message: string;
  error: string;
}

const BOT = () => {
  const [bags, setBags] = useState<IBotBag[]>([]);

  useEffect(() => {
    const fetchBags = async () => {
      try {
        const response = await axios.get<IBotBag[]>(
          `${import.meta.env.VITE_API_URL}/bot/getBotBags`
        );
        setBags(response.data);
      } catch (error) {
        console.error(
          "Error fetching bags:",
          (error as IErrorResponse).message
        );
      }
    };

    fetchBags();
  }, []);

  const colNames = [
    "Record No",
    "Bag ID",
    "Status",
    "Date of Closure",
    "Max",
    "Valid",
    "Invalid",
    "Duplicate",
    "Total",
  ];
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="order table">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
              height: "50px",
            }}
          >
            {colNames.map((colName) => (
              <TableCell
                key={colName}
                sx={{
                  textAlign: "center",
                  border: "1px solid #ccc",
                  fontWeight: "bold",
                }}
              >
                {colName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {bags.map((bag, index) => (
            <TableRow key={bag._id}>
              <TableCell sx={{ textAlign: "center", border: "1px solid #ccc" }}>
                {index + 1}
              </TableCell>
              <TableCell sx={{ textAlign: "center", border: "1px solid #ccc" }}>
                {bag.bagId}
              </TableCell>
              <TableCell sx={{ textAlign: "center", border: "1px solid #ccc" }}>
                {bag.status}
              </TableCell>
              <TableCell sx={{ textAlign: "center", border: "1px solid #ccc" }}>
                {new Date(bag.dateOfClosure).toLocaleString()}
              </TableCell>
              <TableCell sx={{ textAlign: "center", border: "1px solid #ccc" }}>
                {bag.max}
              </TableCell>
              <TableCell sx={{ textAlign: "center", border: "1px solid #ccc" }}>
                {bag.valid}
              </TableCell>
              <TableCell sx={{ textAlign: "center", border: "1px solid #ccc" }}>
                {bag.invalid}
              </TableCell>
              <TableCell sx={{ textAlign: "center", border: "1px solid #ccc" }}>
                {bag.duplicate}
              </TableCell>
              <TableCell sx={{ textAlign: "center", border: "1px solid #ccc" }}>
                {bag.total}
              </TableCell>
            </TableRow>
          ))}
          {/* {bags.map((bag, index) => (
  <TableRow key={bag._id}>
    {[
      index + 1,
      bag.bagId,
      bag.status,
      new Date(bag.dateOfClosure).toLocaleString(),
      bag.max,
      bag.valid,
      bag.invalid,
      bag.duplicate,
      bag.total,
    ].map((value, i) => (
      <TableCell key={i} sx={{ textAlign: "center", border: "1px solid #ccc" }}>
        {value}
      </TableCell>
    ))}
  </TableRow>
))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BOT;
