import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const FaecherList = ({ faecher }) => {
  //console.log("fächer: " + JSON.stringify({faecher}));
  return (
    <Grid container spacing={2}>
      {faecher.map((fach) => (
        <Grid item xs={12} sm={6} md={4} key={fach.id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {fach.name}
              </Typography>
              <Typography variant='body2' color="text.secondary">
                Fachrichtung: {fach.fachrichtung}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FaecherList;
