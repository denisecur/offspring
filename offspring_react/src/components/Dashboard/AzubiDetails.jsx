import { Grid, Typography, Box } from "@mui/material";
import React from "react";
import { calculateAverage } from "./../../api_services/noten/calculations";
import Rahmen1 from "../Rahmen1";
export default function AzubiDetails({ username, fachrichtung, grades }) {
  return (

      <Grid container spacing={2} direction="column">
        <Grid item>
          <Typography sx={{ fontSize: "24px", fontWeight: "bold"  } }>{username}</Typography>
        </Grid>
        <Grid item>
          <Typography sx={{ fontSize: "26px" }}>
            {calculateAverage(grades)}
          </Typography>
        </Grid>
      </Grid>
  
  );
}
