import React from "react";
import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAuthContext } from "../../context/AuthContext";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GridViewIcon from "@mui/icons-material/GridView";
import LogoutIcon from "@mui/icons-material/Logout";
import OFFSPRING from "../../../public/offspring_gelb.svg";

// Navigationselemente für Azubi und Chef
const navItemsAzubi = [
  { name: "Dashboard", path: "/azubi-dashboard", icon: <GridViewIcon /> },
  { name: "Berichtshefte", path: "/berichtshefte", icon: <MenuBookIcon /> },
  { name: "Noten", path: "/noten", icon: <SchoolIcon /> },
];

const navItemsChef = [
  { name: "Dashboard C", path: "/chef-dashboard", icon: <GridViewIcon /> },
];

function DrawerAppBar() {
  const { user, logout, hasFullAccess } = useAuthContext();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // Navigationselemente basierend auf Benutzerrolle
  const navItems = hasFullAccess ? navItemsChef : navItemsAzubi;

  // Logout mit Bestätigungsabfrage
  const handleLogout = () => {
    if (window.confirm("Möchten Sie sich wirklich ausloggen?")) {
      logout();
    }
  };

  return (
    <Box sx={{ display: "flex", flexGrow: 1 }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ height: "80px" }}> {/* Höhe des AppBar anpassen */}
        <Toolbar
          sx={{
            height: "100%", // Toolbar nimmt die volle Höhe des AppBar ein
            display: "flex",
            alignItems: "center", // Vertikale Zentrierung
            justifyContent: "space-between", // Horizontale Ausrichtung
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <img
              src={OFFSPRING}
              alt="Logo"
              style={{ marginLeft: "7%", height: "50px", width: "auto" }} // Logo-Größe anpassen
            />
          </Box>

          {/* Navigationslinks */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2, alignItems: "center" }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                sx={{ color: "#fff" }}
                component={Link}
                to={item.path}
                startIcon={item.icon} // Icon neben dem Text anzeigen
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Logout-Button */}
          {user ? (
            <Button
              sx={{ color: "text.primary" }}
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          ) : (
            !isLoginPage && (
              <Button sx={{ color: "text.primary" }} component={Link} to="/login">
                Login
              </Button>
            )
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
        <Toolbar /> {/* Platzhalter für den AppBar */}
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func, // PropType für window (falls benötigt)
};

export default DrawerAppBar;