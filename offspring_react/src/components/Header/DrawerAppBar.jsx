// src/components/DrawerAppBar.jsx
import React from "react";
import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useAuthContext } from "../../context/AuthContext";
import ThemeSwitcher from "../ThemeSwitcher";
import nachwuchsOffspring from "../../assets/nachwuchs_offspring.png";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GridViewIcon from "@mui/icons-material/GridView";
import LogoutIcon from "@mui/icons-material/Logout";
import OFFSPRING from "../../../public/offspring.png";

const navItemsAzubi = [
  { name: "Dashboard A", path: "/azubi-dashboard", icon: <GridViewIcon /> },
  { name: "Berichtshefte", path: "/berichtshefte", icon: <MenuBookIcon /> },
  { name: "Noten", path: "/noten", icon: <SchoolIcon /> },
];

const navItemsChef = [
  { name: "Dashboard C", path: "/chef-dashboard", icon: <GridViewIcon /> },
];

function DrawerAppBar(props) {
  const { window } = props;
  const { user, logout, hasFullAccess } = useAuthContext();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const navItems = hasFullAccess ? navItemsChef : navItemsAzubi;

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <Box sx={{ display: "flex", height: "200" }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <Tooltip
              title={
                <img
                  src={nachwuchsOffspring}
                  alt="Offspring"
                  className="w-[300px] h-auto"
                />
              }
              arrow
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                <img src={OFFSPRING} alt="Logo" />
              </Typography>
            </Tooltip>

            <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  sx={{ color: "#fff" }}
                  component={Link}
                  to={item.path}
                >
                  {item.icon}
                </Button>
              ))}
            </Box>
            {user ? (
              <>
                {/* Den ThemeSwitcher nur anzeigen, wenn wir nicht auf der Login-Seite sind */}
                {!isLoginPage && <ThemeSwitcher />}
                <Button sx={{ color: "text.primary" }} onClick={handleLogout}>
                  <LogoutIcon />
                </Button>
              </>
            ) : (
              <Button sx={{ color: "text.primary" }} component={Link} to="/login">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: 3 }}>
          <Toolbar />
        </Box>
      </Box>
    </div>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
