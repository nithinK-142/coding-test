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
  const [file, setFile] = useState<File | null>(null); // Store the selected file
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState<boolean>(false); // State to manage button visibility

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); // Store the file but don't parse it yet
      setError(null); // Reset error when a new file is selected
      setImported(false); // Reset imported state when a new file is selected
    }
  };

  const handleImportClick = () => {
    if (!file) {
      setError("Please select a CSV file to import.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (validateFields(results.meta.fields || [])) {
          const filteredData = results.data.filter(isRowNotEmpty);
          setError(null); // Clear error if validation passes
          onDataValidated(filteredData);
          setImported(true); // Hide the Import button
        }
      },
      error: (error) => {
        console.error("Error while parsing CSV:", error);
        setError("Error parsing CSV file");
      },
    });
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <input
        accept=".csv"
        style={{
          border: "1px solid #ccc",
          padding: "5px",
          borderRadius: "5px",
        }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />

      {!imported && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, fontSize: "12px" }}
          onClick={handleImportClick}
        >
          Import
        </Button>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Validation Error</AlertTitle>
          {error}
        </Alert>
      )}
    </Box>
  );
}
