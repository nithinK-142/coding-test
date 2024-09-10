import React, { useState } from "react";
import Papa from "papaparse";
import {
  Button,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

interface CSVReaderProps {
  requiredFields: readonly string[];
  onDataValidated: (data: any[]) => void;
}

export default function CSVReader({
  requiredFields,
  onDataValidated,
}: CSVReaderProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const validateData = (parsedData: any[]): any[] => {
    const newErrors: string[] = [];
    const validData = parsedData.filter((row) => {
      const missingFields = requiredFields.filter(
        (field) => !row[field] || row[field].trim() === ""
      );
      if (missingFields.length > 0) {
        newErrors.push(
          `Row with ID ${
            row[requiredFields[0]] || "N/A"
          } is missing: ${missingFields.join(", ")}`
        );
        return false;
      }
      return true;
    });
    setErrors(newErrors);
    return validData;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validatedData = validateData(results.data);
          onDataValidated(validatedData);
        },
        error: (error) => {
          console.error("Error while parsing CSV:", error);
          setErrors(["Error parsing CSV file"]);
        },
      });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <input
        accept=".csv"
        style={{ display: "none" }}
        id="raised-button-file"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span" sx={{ mb: 2 }}>
          Upload CSV
        </Button>
      </label>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Validation Errors</AlertTitle>
          <List dense>
            {errors.map((error, index) => (
              <ListItem key={index}>
                <ListItemText primary={error} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Box>
  );
}
