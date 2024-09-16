import type { Request, Response } from "express";
import { BagModel, IBag } from "../model/bag.model";

export const saveBag = async (req: Request, res: Response) => {
  try {
    const bagData: IBag = req.body;

    // Find the highest existing bagId
    const highestBag = await BagModel.findOne().sort("-bagId");

    let nextBagId = 2000; // Default value if no existing bagId is found

    if (highestBag && highestBag.bagId) {
      // Ensure that bagId is a string before splitting
      const lastBagIdPart = highestBag.bagId?.split("-")[2];
      nextBagId = lastBagIdPart ? parseInt(lastBagIdPart, 10) + 1 : 2000;
    }

    // Set the new bagId
    bagData.bagId = `DDB-BLR-${nextBagId}`;

    const newBag = new BagModel(bagData);
    await newBag.save();
    res.status(201).json({ message: "Bag saved successfully", bag: newBag });
  } catch (error: any) {
    console.error("Error saving bag:", error);
    res.status(500).json({ message: "Error saving bag", error: error.message });
  }
};

export const getBags = async (req: Request, res: Response) => {
  try {
    const bags = await BagModel.find().sort({ creationDate: -1 });
    res.status(200).json(bags);
  } catch (error: any) {
    console.error("Error fetching bags:", error);
    res
      .status(500)
      .json({ message: "Error fetching bags", error: error.message });
  }
};

export const editBag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: Partial<IBag> = req.body;

    const updatedBag = await BagModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBag) {
      return res.status(404).json({ message: "Bag not found" });
    }

    res
      .status(200)
      .json({ message: "Bag updated successfully", bag: updatedBag });
  } catch (error: any) {
    console.error("Error updating bag:", error);
    res
      .status(500)
      .json({ message: "Error updating bag", error: error.message });
  }
};

export const deleteBag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedBag = await BagModel.findByIdAndDelete(id);

    if (!deletedBag) {
      return res.status(404).json({ message: "Bag not found" });
    }

    res.status(200).json({ message: "Bag deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting bag:", error);
    res
      .status(500)
      .json({ message: "Error deleting bag", error: error.message });
  }
};

export const checkBag = async (req: Request, res: Response) => {
  try {
    const { bagId } = req.params;

    const existingBag = await BagModel.findOne({ bagId });

    if (!existingBag) {
      return res.status(404).json({ message: "Bag not found", isValid: false });
    }

    res.status(200).json({ message: "Bag found", isValid: true });
  } catch (error: any) {
    console.error("Error checking  bag:", error);
    res
      .status(500)
      .json({ message: "Error checking bag", error: error.message });
  }
};
