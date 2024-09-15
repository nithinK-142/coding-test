import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Fade,
} from "@mui/material";
import successSVG from "../assets/success.svg";
import failureSVG from "../assets/failure.svg";

interface IResultDialogContext {
  successDialog: (message: string) => void;
  failureDialog: (message: string) => void;
}

const ResultDialogContext = createContext<IResultDialogContext | undefined>(
  undefined
);

export const useResultDialog = (): IResultDialogContext => {
  const context = useContext(ResultDialogContext);
  if (!context) {
    throw new Error(
      "useResultDialog must be used within a ResultDialogProvider"
    );
  }
  return context;
};

interface ResultDialogProviderProps {
  children: ReactNode;
}

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Fade in={props.open} ref={ref} {...props} />;
});

export const ResultDialogProvider: React.FC<ResultDialogProviderProps> = ({
  children,
}) => {
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogStatus, setDialogStatus] = useState<"success" | "failure">(
    "success"
  );

  const openResultDialog = (message: string, status: "success" | "failure") => {
    setDialogMessage(message);
    setDialogStatus(status);
    setIsResultDialogOpen(true);
  };

  const handleClose = () => {
    setIsResultDialogOpen(false);
  };

  const successDialog = (message: string) => {
    openResultDialog(message, "success");
  };

  const failureDialog = (message: string) => {
    openResultDialog(message, "failure");
  };

  return (
    <ResultDialogContext.Provider value={{ successDialog, failureDialog }}>
      {children}
      <Dialog
        open={isResultDialogOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        transitionDuration={500}
      >
        <DialogTitle>
          {dialogStatus === "success" ? "Success" : "Failure"}
        </DialogTitle>
        <DialogContent>
          <div style={{ textAlign: "center" }}>
            <img
              src={dialogStatus === "success" ? successSVG : failureSVG}
              alt={dialogStatus === "success" ? "Success" : "Failure"}
              style={{ width: 50, height: 50, marginBottom: 16 }}
            />
            <DialogContentText>{dialogMessage}</DialogContentText>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ResultDialogContext.Provider>
  );
};
