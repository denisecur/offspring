import React from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";


const Kennzahlen = () => {

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
      }));

    const kennzahlenItem = (items) => {
        return items.map((item, index) => (
          <Grid container key={index} xs={12} spacing={2}>
            <Grid xs={8}>
              <Item>{item.name}</Item>
            </Grid>
            <Grid xs={4}>
              <Item>{item.schnitt}</Item>
            </Grid>
          </Grid>
        ));
      };
    

  return (
    <Grid xs={6} container spacing={2} className="bg-red-100">
    <Grid xs={12} className="bg-green-100">
      <Item>Kennzahlen</Item>
    </Grid>
    {kennzahlenItem([
      { name: "Gesamt", schnitt: 1 },
      { name: "Allgemein", schnitt: 2 },
      { name: "Fachlich", schnitt: 1 },
    ])}
  </Grid>
  )
}

export default Kennzahlen
