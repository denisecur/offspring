import React from 'react';
import { Box } from '@mui/material';

export default function Rahmen1({ children }) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "primary.main",
        p: 2,
      }}
    >
      {children}
    </Box>
  );
}
