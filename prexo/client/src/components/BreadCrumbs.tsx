import { useContext } from "react";
import { PathContext } from "../context/path-context";
import { Home } from "@mui/icons-material";
import { Typography, Breadcrumbs, Link } from "@mui/material";

const BreadCrumbs = () => {
  const { pathnames, getRouteTo } = useContext(PathContext);

  if (pathnames.length === 0) {
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
      <Typography color="text.primary">
        {pathnames[pathnames.length - 1]}
      </Typography>
      <Link href="/" style={{ color: "blue", opacity: 0.7 }}>
        <Home />
      </Link>
      {pathnames.map((name, index) => {
        const isLast = index === pathnames.length - 1;
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
