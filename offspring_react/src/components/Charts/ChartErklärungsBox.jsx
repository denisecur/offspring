import React from "react";
import { Box, Typography } from "@mui/material";

const ChartErklärungsBox = ({ title, text }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "white",
        padding: 1,
        border: "1px solid #ccc",
        borderRadius: 1,
        zIndex: 10,
        width: "100%",
      }}
    >
      {title && (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
          {title}
        </Typography>
      )}
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
};

export default ChartErklärungsBox;
