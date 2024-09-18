import type { Request, Response } from "express";
import orderModel, { IOrder } from "../model/order.model";

export const saveOrder = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Transform the raw data into IOrder objects
    const filteredOrderData = transformOrderData(data);

    // Fetch existing order IDs and tracking IDs from the database
    const existingOrderIds = new Set(await orderModel.distinct("orderId"));
    const existingTrackingIds = new Set(
      await orderModel.distinct("trackingId")
    );

    // Validate the orders
    const validationResult = validateOrdersUtility(
      filteredOrderData,
      existingOrderIds,
      existingTrackingIds
    );

    if (!validationResult.valid) {
      // If there are validation errors, return them with a 400 status
      return res.status(400).json({
        message: "Data not validated before saving",
        errors: validationResult.errors,
      });
    }

    await orderModel.insertMany(filteredOrderData);
    return res.send("order saved");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const ordersExists = async (req: Request, res: Response) => {
  try {
    const orderIds: string[] = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid input: Expected an array of order IDs" });
    }

    const existingOrders = await orderModel.find(
      { orderId: { $in: orderIds } },
      "orderId"
    );

    const existingOrderIds = new Set(
      existingOrders.map((order) => order.orderId)
    );

    const allOrdersExist = orderIds.every((id) => existingOrderIds.has(id));

    return res.json({
      allOrdersExist,
      existingOrderIds: Array.from(existingOrderIds),
    });
  } catch (error) {
    console.error("Error in ordersExists:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderModel.find();
    return res.send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const checkTrackingIdsInOrderModel = async (
  trackingIds: string[]
): Promise<Set<string>> => {
  const existingTrackingIdsInOrder = new Set(
    await orderModel.distinct("trackingId", {
      trackingId: { $in: trackingIds },
    })
  );
  return existingTrackingIdsInOrder;
};

export const validateOrders = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const filteredOrderData = transformOrderData(data);

    const validationErrors: {
      [key: string]: { index: number; message: string }[];
    } = {};

    // Helper function to add validation errors
    const addError = (field: string, message: string, index: number) => {
      if (!validationErrors[field]) {
        validationErrors[field] = [];
      }
      validationErrors[field].push({ index, message });
    };

    // Set to keep track of order IDs and tracking IDs for duplicate checking within the batch
    const orderIds = new Set<string>();
    const trackingIds = new Set<string>();

    // Check for existing orderIds and trackingIds in the database
    const existingOrderIds = new Set(await orderModel.distinct("orderId"));
    const existingTrackingIds = new Set(
      await orderModel.distinct("trackingId")
    );

    for (let index = 0; index < filteredOrderData.length; index++) {
      const order = filteredOrderData[index];

      // Validate orderId
      if (!/^\d{3}-\d{7}-\d{7}$/.test(order!.orderId)) {
        addError("orderId", `Invalid order ID format`, index);
      }
      if (orderIds.has(order!.orderId)) {
        addError("orderId", `Duplicate order ID ${order!.orderId}`, index);
      }
      if (existingOrderIds.has(order!.orderId)) {
        addError("orderId", `Order ID  already exists!`, index);
        // addError(
        //   "orderId",
        //   `Order ID ${order!.orderId} already exists in the database`,
        //   index
        // );
      }
      orderIds.add(order!.orderId);

      // Validate orderDate
      if (
        !(order!.orderDate instanceof Date) ||
        isNaN(order!.orderDate.getTime())
      ) {
        addError("orderDate", `Invalid order date`, index);
      }

      // Validate orderTimestamp
      if (!/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/.test(order!.orderTimestamp)) {
        addError("orderTimestamp", `Invalid order timestamp format`, index);
      }

      // Validate orderStatus
      if (order!.orderStatus.toLowerCase() !== "new") {
        addError(
          "orderStatus",
          `Invalid order status. Must be 'NEW' or 'new'`,
          index
        );
      }

      // Validate partnerId
      if (!/^\d{10}$/.test(order!.partnerId)) {
        addError(
          "partnerId",
          `Invalid partner ID. Must be a 10 digit number`,
          index
        );
      }

      // Validate partnerShop
      if (!/^[A-Za-z]+_\d+$/.test(order!.partnerShop)) {
        addError("partnerShop", `Invalid partner shop format`, index);
      }

      // Validate itemId
      if (!/^[A-Za-z]+_\d+$/.test(order!.itemId)) {
        addError("itemId", `Invalid item ID format`, index);
      }

      // Validate oldItemDetails (assuming it's a non-empty string)
      if (
        typeof order!.oldItemDetails !== "string" ||
        order!.oldItemDetails.trim() === ""
      ) {
        addError("oldItemDetails", `Invalid old item details`, index);
      }

      // Validate imei
      if (!/^\d{15}$/.test(order!.imei)) {
        addError("imei", `Invalid IMEI. Must be a 15 digit number`, index);
      }

      // Validate trackingId
      if (!/^(\d{8}|\d{12})$/.test(order!.trackingId)) {
        addError(
          "trackingId",
          `Invalid tracking ID. Must be an 8 or 12 digit number`,
          index
        );
      }
      if (trackingIds.has(order!.trackingId)) {
        addError("trackingId", `Duplicate tracking ID`, index);
        // addError(
        //   "trackingId",
        //   `Duplicate tracking ID ${order!.trackingId}`,
        //   index
        // );
      }
      if (existingTrackingIds.has(order!.trackingId)) {
        addError("trackingId", `Tracking ID already exists!`, index);
        // addError(
        //   "trackingId",
        //   `Tracking ID ${order!.trackingId} already exists in the database`,
        //   index
        // );
      }
      trackingIds.add(order!.trackingId);

      // Validate deliveryDate
      if (
        !(order!.deliveryDate instanceof Date) ||
        isNaN(order!.deliveryDate.getTime())
      ) {
        addError("deliveryDate", `Invalid delivery date`, index);
      }
    }

    // Transform validationErrors object to use counter field names
    const transformedErrors: {
      [key: string]: { index: number; message: string }[];
    } = {};
    for (const [key, value] of Object.entries(validationErrors)) {
      const mappedKey = fieldMapping[key] || key;
      transformedErrors[mappedKey] = value;
    }

    if (Object.keys(transformedErrors).length > 0) {
      return res.status(400).json({ errors: transformedErrors, valid: false });
    }

    return res
      .status(200)
      .json({ message: "All orders are valid", valid: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const transformOrderData = (rawData: any[]): IOrder[] => {
  return rawData.map((order) => ({
    orderId: order["Order ID"],
    orderDate: new Date(order["Order Date"]),
    orderTimestamp: order["Order Timestamp"],
    orderStatus: order["Order Status"],
    buybackCategory: order["Buyback Category"],
    partnerId: order["Partner ID"],
    partnerEmail: order["Partner Email"],
    partnerShop: order["Partner Shop"],
    itemId: order["Item ID"],
    oldItemDetails: order["Old Item Details"],
    imei: order["IMEI"],
    gepOrder: order["GEP Order"] === "TRUE", // Convert to boolean
    baseDiscount: Number(order["Base Discount"]),
    partnerPurchasePrice: Number(order["Partner Purchase Price"]),
    trackingId: order["Tracking ID"],
    deliveryDate: new Date(order["Delivery Date"]),
    importedAt: new Date(),
  }));
};

const fieldMapping: { [key: string]: string } = {
  orderId: "Order ID",
  orderDate: "Order Date",
  orderTimestamp: "Order Timestamp",
  orderStatus: "Order Status",
  partnerId: "Partner ID",
  partnerShop: "Partner Shop",
  itemId: "Item ID",
  oldItemDetails: "Old Item Details",
  imei: "IMEI",
  trackingId: "Tracking ID",
  deliveryDate: "Delivery Date",
};

interface ValidationError {
  field: string;
  index: number;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

export function validateOrdersUtility(
  orders: (IOrder | undefined)[],
  existingOrderIds: Set<string>,
  existingTrackingIds: Set<string>
): ValidationResult {
  const errors: ValidationError[] = [];
  const orderIds = new Set<string>();
  const trackingIds = new Set<string>();

  const addError = (field: string, message: string, index: number) => {
    errors.push({ field, index, message });
  };

  for (let index = 0; index < orders.length; index++) {
    const order = orders[index];

    if (!order) {
      addError("order", "Order is undefined", index);
      continue;
    }

    // Validate orderId
    if (!order.orderId || !/^\d{3}-\d{7}-\d{7}$/.test(order.orderId)) {
      addError("orderId", `Invalid order ID format`, index);
    } else {
      if (orderIds.has(order.orderId)) {
        addError("orderId", `Duplicate order ID ${order.orderId}`, index);
      }
      if (existingOrderIds.has(order.orderId)) {
        addError("orderId", `Order ID already exists!`, index);
      }
      orderIds.add(order.orderId);
    }

    // Validate orderDate
    if (
      !(order.orderDate instanceof Date) ||
      isNaN(order.orderDate.getTime())
    ) {
      addError("orderDate", `Invalid order date`, index);
    }

    // Validate orderTimestamp
    if (
      !order.orderTimestamp ||
      !/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/.test(order.orderTimestamp)
    ) {
      addError("orderTimestamp", `Invalid order timestamp format`, index);
    }

    // Validate orderStatus
    if (!order.orderStatus || order.orderStatus.toLowerCase() !== "new") {
      addError(
        "orderStatus",
        `Invalid order status. Must be 'NEW' or 'new'`,
        index
      );
    }

    // Validate partnerId
    if (!order.partnerId || !/^\d{10}$/.test(order.partnerId)) {
      addError(
        "partnerId",
        `Invalid partner ID. Must be a 10 digit number`,
        index
      );
    }

    // Validate partnerShop
    if (!order.partnerShop || !/^[A-Za-z]+_\d+$/.test(order.partnerShop)) {
      addError("partnerShop", `Invalid partner shop format`, index);
    }

    // Validate itemId
    if (!order.itemId || !/^[A-Za-z]+_\d+$/.test(order.itemId)) {
      addError("itemId", `Invalid item ID format`, index);
    }

    // Validate oldItemDetails
    if (
      typeof order.oldItemDetails !== "string" ||
      order.oldItemDetails.trim() === ""
    ) {
      addError("oldItemDetails", `Invalid old item details`, index);
    }

    // Validate imei
    if (!order.imei || !/^\d{15}$/.test(order.imei)) {
      addError("imei", `Invalid IMEI. Must be a 15 digit number`, index);
    }

    // Validate trackingId
    if (!order.trackingId || !/^(\d{8}|\d{12})$/.test(order.trackingId)) {
      addError(
        "trackingId",
        `Invalid tracking ID. Must be an 8 or 12 digit number`,
        index
      );
    } else {
      if (trackingIds.has(order.trackingId)) {
        addError("trackingId", `Duplicate tracking ID`, index);
      }
      if (existingTrackingIds.has(order.trackingId)) {
        addError("trackingId", `Tracking ID already exists!`, index);
      }
      trackingIds.add(order.trackingId);
    }

    // Validate deliveryDate
    if (
      !(order.deliveryDate instanceof Date) ||
      isNaN(order.deliveryDate.getTime())
    ) {
      addError("deliveryDate", `Invalid delivery date`, index);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
