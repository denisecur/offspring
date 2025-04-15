import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { gruppiereAzubisNachAusbildungUndJahr } from "../utils/gruppiereAzubisNachAusbildungUndJahr";
import { getToken } from "../helpers";
import { API } from "../constant";

async function fetchAusbildungen() {
  const url = `${API}/ausbildungen?populate=azubis`;
  const token = getToken();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const msg = `[fetchAusbildungen] Fehler! Status: ${response.status}`;
    console.error(msg);
    throw new Error(msg);
  }
  const data = await response.json();
  return data;
}

export default function Schulklassen() {
  const theme = useTheme();
  const [klassen, setKlassen] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const ausbildungData = await fetchAusbildungen();
        const result = gruppiereAzubisNachAusbildungUndJahr(ausbildungData);
        setKlassen(result);
      } catch (err) {
        console.error("[Schulklassen] Fehler beim Laden:", err);
        setError(err.message || "Fehler beim Laden");
      }
    }
    loadData();
  }, []);

  if (error) {
    return (
      <Typography color="error" variant="body1">
        Fehler: {error}
      </Typography>
    );
  }

  if (!klassen) {
    return <Typography>Lädt…</Typography>;
  }

  return (
    <Box
      sx={{
        padding: theme.spacing(4),
        background: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.primary.main,
          marginBottom: theme.spacing(4),
          fontWeight: 600,
        }}
      >
        Schulklassen Übersicht
      </Typography>

      {Object.entries(klassen).map(([year, ausbildungen]) => (
        <Box key={year} sx={{ marginBottom: theme.spacing(6) }}>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.secondary.main,
              marginBottom: theme.spacing(2),
              borderBottom: `3px solid ${theme.palette.secondary.light}`,
              display: "inline-block",
              paddingBottom: theme.spacing(0.5),
            }}
          >
            Ausbildungsjahr {year}
          </Typography>

          <Grid container spacing={3} sx={{ marginTop: theme.spacing(2) }}>
            {Object.entries(ausbildungen).map(
              ([ausbildungName, azubiArray]) => (
                <Grid item xs={12} sm={6} md={4} key={ausbildungName}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          marginBottom: theme.spacing(1.5),
                        }}
                      >
                        {ausbildungName}
                      </Typography>

                      <Divider sx={{ marginBottom: theme.spacing(2) }} />

                      {azubiArray.map((azubi) => (
                        <Chip
                          key={azubi.id}
                          avatar={
                            <Avatar>
                              {azubi.username.charAt(0).toUpperCase()}
                            </Avatar>
                          }
                          label={`${azubi.username}`}
                          variant="outlined"
                          sx={{
                            marginBottom: theme.spacing(1),
                            marginRight: theme.spacing(1),
                          }}
                          title={`Erstellt am: ${azubi.createdAt}`}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
