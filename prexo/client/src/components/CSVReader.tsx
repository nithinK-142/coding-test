import React, { useState } from "react";
import Papa from "papaparse";
import { Button, Alert, AlertTitle, Box } from "@mui/material";

interface CSVReaderProps {
  requiredFields: readonly string[];
  onDataValidated: (data: any[]) => void;
}

export default function CSVReader({
  requiredFields,
  onDataValidated,
}: CSVReaderProps) {
  const [error, setError] = useState<string | null>(null);

  const validateFields = (headers: string[]): boolean => {
    const missingFields = requiredFields.filter(
      (field) => !headers.includes(field)
    );
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  const isRowNotEmpty = (row: any): boolean => {
    return Object.values(row).some((value) => value !== null && value !== "");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (validateFields(results.meta.fields || [])) {
            const filteredData = results.data.filter(isRowNotEmpty);
            setError(null);
            onDataValidated(filteredData);
          }
        },
        error: (error) => {
          console.error("Error while parsing CSV:", error);
          setError("Error parsing CSV file");
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Validation Error</AlertTitle>
          {error}
        </Alert>
      )}
    </Box>
  );
}
