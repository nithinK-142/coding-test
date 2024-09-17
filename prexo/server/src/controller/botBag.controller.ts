import type { Request, Response } from "express";
import { BotBagModel } from "../model/botBag.model";

export const getBotBags = async (_req: Request, res: Response) => {
  try {
    const bags = await BotBagModel.find();
    res.status(200).json(bags);
  } catch (error: any) {
    console.error("Error fetching bags:", error);
    res
      .status(500)
      .json({ message: "Error fetching bags", error: error.message });
  }
};

export const closeBag = async (req: Request, res: Response) => {
  try {
    const { bagId, valid, invalid, duplicate, total, orders } = req.body;

    let bag = await BotBagModel.findOne({ bagId });

    if (!bag) {
      bag = new BotBagModel({
        bagId,
        status: "Pre-Closure",
        dateOfClosure: new Date(),
        valid,
        invalid,
        duplicate,
        total,
        orders,
      });
    } else {
      bag.status = "Pre-Closure";
      bag.dateOfClosure = new Date();
      bag.valid = valid;
      bag.invalid = invalid;
      bag.duplicate = duplicate;
      bag.total = total;
      bag.orders = orders;
    }

    await bag.save();

    res.status(200).json({ message: "Bag saved successfully", bag });
  } catch (error: any) {
    console.error("Error closing bag:", error);
    res
      .status(500)
      .json({ message: "Error closing bag", error: error.message });
  }
};
