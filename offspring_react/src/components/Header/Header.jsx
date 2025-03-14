import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { useLocation, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useAuthContext } from "../../context/AuthContext";

// MUI Icons
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GridViewIcon from "@mui/icons-material/GridView";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

// React Icons
import { ImProfile } from "react-icons/im";
import { FaRankingStar } from "react-icons/fa6";

// Sonstige
import { Typography } from "@mui/material";
import OFFSPRING from "../../assets/offspring_pink.svg";

function DrawerAppBar() {
  const theme = useTheme();
  const { user, logout, hasFullAccess } = useAuthContext();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // Navigationselemente für Azubi und Chef
  const navItemsAzubi = [
    { name: "Dashboard", path: "/azubi-dashboard", icon: <GridViewIcon /> },
    { name: "Berichtshefte", path: "/berichtshefte", icon: <MenuBookIcon /> },
    { name: "Noten", path: "/noten", icon: <SchoolIcon /> },
  ];

  const navItemsChef = [
    { name: "Profile", path: "/profile", icon: <ImProfile /> },
    { name: "Ranking", path: "/ranking", icon: <FaRankingStar /> },
  ];

  const navItems = hasFullAccess ? navItemsChef : navItemsAzubi;

  // Logout mit Bestätigungsabfrage
  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ display: "flex", flexGrow: 1 }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          height: "80px",
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Toolbar
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <img
              src={OFFSPRING}
              alt="Logo"
              style={{ marginLeft: "7%", height: "21px", width: "auto" }}
            />
          </Box>

          {/* Navigationslinks */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2, alignItems: "center" }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                sx={{ color: theme.palette.primary.contrastText }}
                component={Link}
                to={item.path}
                startIcon={item.icon}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Username Anzeige oder Login-Button */}
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginRight: theme.spacing(4) }}>
              <Box sx={{ display: "flex", alignItems: "center", color: theme.palette.primary.contrastText }}>
                <PersonOutlineIcon style={{ marginRight: 4 }} />
                {user.username}
              </Box>

              {/* Logout-Button */}
              <Button
                sx={{ color: theme.palette.primary.contrastText }}
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Box>
          ) : (
            !isLoginPage && (
              <Button sx={{ color: theme.palette.text.primary }} component={Link} to="/login">
                Login
              </Button>
            )
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar /> {/* Platzhalter für den AppBar */}
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
