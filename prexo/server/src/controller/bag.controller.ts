import type { Request, Response } from "express";
import { BagModel, IBag } from "../model/bag.model";

export const saveBag = async (req: Request, res: Response) => {
  console.log("saving bag");
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

// export const saveBag = async (req: Request, res: Response) => {
//   console.log("saving bag");
//   try {
//     const bagData: IBag = req.body;

//     // Find the highest existing bagId
//     const highestBag = await BagModel.findOne().sort("-bagId");

//     const nextBagId = highestBag
//       ? parseInt(highestBag.bagId!.split("-")[2]) + 1
//       : 2000;

//     // Set the new bagId
//     bagData.bagId = `DDB-BLR-${nextBagId}`;

//     const newBag = new BagModel(bagData);
//     await newBag.save();
//     res.status(201).json({ message: "Bag saved successfully", bag: newBag });
//   } catch (error: any) {
//     console.error("Error saving bag:", error);
//     res.status(500).json({ message: "Error saving bag", error: error.message });
//   }
// };

export const getBags = async (req: Request, res: Response) => {
  console.log("getting bags");
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

// import type { Request, Response } from "express";
// import { BagModel, IBag } from "../model/bag.model";

// export const saveBag = async (req: Request, res: Response) => {
//   console.log("saving bag");
//   try {
//     const bagData: IBag = req.body;

//     // Find the latest bag ID and increment it
//     const latestBag = await BagModel.findOne().sort({ bagId: -1 });
//     const nextBagId = latestBag
//       ? parseInt(latestBag.bagId.split("-").pop() || "2000") + 1
//       : 2000;
//     const newBagId = `DDB-BLR-${nextBagId}`;

//     // Assign the new bag ID and save the bag
//     const newBag = new BagModel({ ...bagData, bagId: newBagId });
//     await newBag.save();

//     res.status(201).json({ message: "Bag saved successfully", bag: newBag });
//   } catch (error: any) {
//     console.error("Error saving bag:", error);
//     res.status(500).json({ message: "Error saving bag", error: error.message });
//   }
// };

// export const getBags = async (req: Request, res: Response) => {
//   console.log("getting bags");
//   try {
//     const bags = await BagModel.find().sort({ creationDate: -1 });
//     res.status(200).json(bags);
//   } catch (error: any) {
//     console.error("Error fetching bags:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching bags", error: error.message });
//   }
// };

// import type { Request, Response } from "express";
// import { BagModel, IBag } from "../model/bag.model";

// export const saveBag = async (req: Request, res: Response) => {
//   console.log("saving bag");
//   try {
//     const bagData: IBag = req.body;
//     const newBag = new BagModel(bagData);
//     await newBag.save();
//     res.status(201).json({ message: "Bag saved successfully", bag: newBag });
//   } catch (error: any) {
//     console.error("Error saving bag:", error);
//     res.status(500).json({ message: "Error saving bag", error: error.message });
//   }
// };

// export const getBags = async (req: Request, res: Response) => {
//   console.log("getting bags");
//   try {
//     const bags = await BagModel.find().sort({ creationDate: -1 });
//     res.status(200).json(bags);
//   } catch (error: any) {
//     console.error("Error fetching bags:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching bags", error: error.message });
//   }
// };
