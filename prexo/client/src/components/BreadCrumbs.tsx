import { useContext } from "react";
import { PathContext } from "../context/path-context";
import { Home } from "@mui/icons-material";
import { Typography, Breadcrumbs, Link } from "@mui/material";

const BreadCrumbs = () => {
  const { pathnames, getRouteTo } = useContext(PathContext);

  // Modify the pathnames based on the condition
  const modifiedPathnames = pathnames.map((name, index) => {
    if (name === "Bulk Import") {
      const previous = pathnames[index - 1];
      if (previous === "Order") {
        return "Bulk Order";
      } else if (previous === "Delivery") {
        return "Bulk Delivery";
      }
    }
    return name;
  });

  if (modifiedPathnames.length === 0) {
    return (
      <Link color="inherit" href="/" style={{ opacity: 0.7, color: "blue" }}>
        <Home />
      </Link>
    );
  }

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator=">"
      style={{ display: "flex", alignItems: "center" }}
    >
      <Typography color="text.primary" sx={{ fontWeight: "600", opacity: 0.8 }}>
        {modifiedPathnames[modifiedPathnames.length - 1]}
      </Typography>
      <Link href="/" style={{ color: "#20a7db" }}>
        <Home />
      </Link>
      {modifiedPathnames.map((name, index) => {
        const isLast = index === modifiedPathnames.length - 1;
        return isLast ? (
          <Typography key={name} color="inherit">
            {name}
          </Typography>
        ) : (
          <Link
            key={name}
            color="inherit"
            href={getRouteTo(index)}
            sx={{ textDecoration: "none" }}
          >
            {name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadCrumbs;
