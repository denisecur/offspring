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
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GridViewIcon from "@mui/icons-material/GridView";
import LogoutIcon from "@mui/icons-material/Logout";
import UserIcon from '@mui/icons-material/PersonOutline';
import OFFSPRING from "../../assets/offspring_pink.svg";
import { ImProfile } from "react-icons/im";
import { FaRankingStar } from "react-icons/fa6";
import { Typography } from "@mui/material";
import { AiFillAppstore } from "react-icons/ai";

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
    { name: "Dashboard", path: "/chef-dashboard", icon: <AiFillAppstore /> },
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
              style={{ marginLeft: "7%", height: "21px", width: "auto" }}
            />
          </Box>

          {/* Navigationslinks */}
          <Box
            sx={{
              flexGrow: 1, // Nav-Bereich erhält den verfügbaren Platz
              display: { xs: "none", sm: "flex" },
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.name}
                sx={{
                  color: theme.palette.primary.contrastText,
                }}
                component={Link}
                to={item.path}
                startIcon={item.icon} // Richtig: startIcon
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Username Anzeige */}
          {user ? (
            <Typography
              sx={{
                color: theme.palette.primary.contrastText,
                mr: 2, // Margin reduziert, um Platz zu schaffen
              }}
            >
              {user.username}
            </Typography>
          ) : (
            !isLoginPage && (
              <Button
                sx={{ color: theme.palette.text.primary }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
            )
          )}

          {/* Logout-Button */}
          {user ? (
            <Button
              sx={{
                color: theme.palette.primary.contrastText,
                mr: 2, // Auch hier Margin reduzieren
              }}
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
            </Button>
          ) : (
            !isLoginPage && (
              <Button
                sx={{ color: theme.palette.text.primary }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
            )
          )}
        </Toolbar>
      </AppBar>
      {/* Platzhalter für den AppBar */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
