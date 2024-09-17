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
  path: string;
};

export const dashboardItems: DashboardItem[] = [
  {
    icon: <Reorder sx={{ fontSize: "20px" }} />,
    count: 35481,
    title: "Orders",
    path: "/order",
  },
  {
    icon: <DeliveryDining sx={{ fontSize: "20px" }} />,
    count: 27937,
    title: "Delivery",
    path: "/delivery",
  },
  // {
  //   icon: <FormatAlignRightRounded sx={{ fontSize: "20px" }} />,
  //   count: 273,
  //   title: "UC Not Generated",
  //   path: "/",
  // },
  {
    icon: <Reorder sx={{ fontSize: "20px" }} />,
    count: 6,
    title: "Assign to BOT",
    path: "/",
  },
  // {
  //   icon: <Assignment sx={{ fontSize: "20px" }} />,
  //   count: 12,
  //   title: "Assign to Changing",
  //   path: "/",
  // },
  // {
  //   icon: <Assignment sx={{ fontSize: "20px" }} />,
  //   count: 0,
  //   title: "Assign to BQC",
  //   path: "/",
  // },
  // {
  //   icon: <Assignment sx={{ fontSize: "20px" }} />,
  //   count: 10,
  //   title: "Assign to Audit",
  //   path: "/",
  // },
  // {
  //   icon: <TrackChanges sx={{ fontSize: "20px" }} />,
  //   count: 6,
  //   title: "Assign to RDL-1",
  //   path: "/",
  // },
  // {
  //   icon: <TrackChanges sx={{ fontSize: "20px" }} />,
  //   count: 5,
  //   title: "Assign to RDL-2",
  //   path: "/",
  // },
  // {
  //   icon: <SortRounded sx={{ fontSize: "20px" }} />,
  //   count: 26,
  //   title: "BOT to WHT",
  //   path: "/",
  // },
  // {
  //   icon: <CallMerge sx={{ fontSize: "20px" }} />,
  //   count: 2,
  //   title: "MMT Merge",
  //   path: "/",
  // },
  // {
  //   icon: <Reorder sx={{ fontSize: "20px" }} />,
  //   count: 612,
  //   title: "WHT Merge",
  //   path: "/",
  // },
  // {
  //   icon: <Reorder sx={{ fontSize: "20px" }} />,
  //   count: 6,
  //   title: "CTX Merge",
  //   path: "/",
  // },
  // {
  //   icon: <AddShoppingCartRounded sx={{ fontSize: "20px" }} />,
  //   count: 0,
  //   title: "Transfer Tray",
  //   path: "/",
  // },
  // {
  //   icon: <AddShoppingCartRounded sx={{ fontSize: "20px" }} />,
  //   count: 0,
  //   title: "Receive Tray",
  //   path: "/",
  // },
  // {
  //   icon: <AddShoppingCartRounded sx={{ fontSize: "20px" }} />,
  //   count: 0,
  //   title: "Rack Change Requested Created",
  //   path: "/",
  // },
];
