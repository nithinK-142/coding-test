import {
  AddShoppingCartRounded,
  Assignment,
  CallMerge,
  DeliveryDining,
  FormatAlignRightRounded,
  Reorder,
  SortRounded,
  TrackChanges,
} from "@mui/icons-material";
import { ReactNode } from "react";

export type DashboardItem = {
  icon: ReactNode;
  count: number;
  title: string;
};

export const dashboardItems: DashboardItem[] = [
  {
    icon: <Reorder sx={{ fontSize: "20px" }} />,
    count: 35481,
    title: "Orders",
  },
  {
    icon: <DeliveryDining sx={{ fontSize: "20px" }} />,
    count: 27937,
    title: "Delivery",
  },
  {
    icon: <FormatAlignRightRounded sx={{ fontSize: "20px" }} />,
    count: 273,
    title: "UC Not Generated",
  },
  {
    icon: <Reorder sx={{ fontSize: "20px" }} />,
    count: 6,
    title: "Assign to BOT",
  },
  {
    icon: <Assignment sx={{ fontSize: "20px" }} />,
    count: 12,
    title: "Assign to Changing",
  },
  {
    icon: <Assignment sx={{ fontSize: "20px" }} />,
    count: 0,
    title: "Assign to BQC",
  },
  {
    icon: <Assignment sx={{ fontSize: "20px" }} />,
    count: 10,
    title: "Assign to Audit",
  },
  {
    icon: <TrackChanges sx={{ fontSize: "20px" }} />,
    count: 6,
    title: "Assign to RDL-1",
  },
  {
    icon: <TrackChanges sx={{ fontSize: "20px" }} />,
    count: 5,
    title: "Assign to RDL-2",
  },
  {
    icon: <SortRounded sx={{ fontSize: "20px" }} />,
    count: 26,
    title: "BOT to WHT",
  },
  {
    icon: <CallMerge sx={{ fontSize: "20px" }} />,
    count: 2,
    title: "MMT Merge",
  },
  {
    icon: <Reorder sx={{ fontSize: "20px" }} />,
    count: 612,
    title: "WHT Merge",
  },
  {
    icon: <Reorder sx={{ fontSize: "20px" }} />,
    count: 6,
    title: "CTX Merge",
  },
  {
    icon: <AddShoppingCartRounded sx={{ fontSize: "20px" }} />,
    count: 0,
    title: "Transfer Tray",
  },
  {
    icon: <AddShoppingCartRounded sx={{ fontSize: "20px" }} />,
    count: 0,
    title: "Receive Tray",
  },

  {
    icon: <AddShoppingCartRounded sx={{ fontSize: "20px" }} />,
    count: 0,
    title: "Rack Change Requested Created",
  },
];
