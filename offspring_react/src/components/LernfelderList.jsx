import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const LernfelderList = ({ lernfelder }) => {
  //console.log("Lernfelder: " + JSON.stringify(lernfelder, null, 2));  // Detaillierter Log für Debugging
  return (
    <Grid container spacing={2}>
      {lernfelder.map((lernfeld) => (
        <Grid item xs={12} sm={6} md={4} key={lernfeld.id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {lernfeld.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ausbildungsfach: {lernfeld.ausbildungsfachName}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LernfelderList;
