import { Typography } from "@mui/material";

const Footer = () => {
  return (
    <Typography
      sx={{
        backgroundColor: "#222942",
        textAlign: "center",
        color: "white",
        fontSize: "12px",
        paddingBlock: "10px",

        position: "absolute",
        width: "100%",
        bottom: 0,
      }}
    >
      2024 @ Prexo
    </Typography>
  );
};

export default Footer;
