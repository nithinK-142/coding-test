import React, { createContext, useState, useContext, ReactNode } from "react";

interface OrderSheetUploadedContextType {
  isOrderSheetUploaded: boolean;
  setOrderSheetUploaded: (status: boolean) => void;
}

const OrderSheetUploadedContext = createContext<
  OrderSheetUploadedContextType | undefined
>(undefined);

export const OrderSheetUploadedProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOrderSheetUploaded, setIsOrderSheetUploaded] =
    useState<boolean>(false);

  const setOrderSheetUploaded = (status: boolean) => {
    setIsOrderSheetUploaded(status);
  };

  return (
    <OrderSheetUploadedContext.Provider
      value={{ isOrderSheetUploaded, setOrderSheetUploaded }}
    >
      {children}
    </OrderSheetUploadedContext.Provider>
  );
};

export const useOrderSheetUploaded = (): OrderSheetUploadedContextType => {
  const context = useContext(OrderSheetUploadedContext);
  if (context === undefined) {
    throw new Error(
      "useOrderSheetUploaded must be used within an OrderSheetUploadedProvider"
    );
  }
  return context;
};
