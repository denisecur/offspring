// src/components/DrawerAppBar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import nachwuchsOffspring from '../../assets/nachwuchs_offspring.png';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GridViewIcon from '@mui/icons-material/GridView';
import LogoutIcon from '@mui/icons-material/Logout';

const navItemsAzubi = [
  { name: "Dashboard A", path: "/azubi-dashboard", icon: <GridViewIcon/> },
  { name: "Berichtshefte", path: "/berichtshefte", icon: <MenuBookIcon/> },
  { name: "Noten", path: "/noten", icon: <SchoolIcon/> },
];

const navItemsChef = [
  { name: "Dashboard C", path: "/azubi-dashboard", icon: <GridViewIcon/> },
  { name: "Berichtshefte", path: "/berichtshefte", icon: <MenuBookIcon/> },
  { name: "Noten", path: "/noten", icon: <SchoolIcon/> },
];

function DrawerAppBar(props) {
  const { window } = props;
  const { user, logout, hasFullAccess } = useAuthContext();


  const navItems = (hasFullAccess?navItemsChef:navItemsAzubi); // Headermenü Items laden abhängig von access-type

  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Tooltip
            title={
              <img src={nachwuchsOffspring} alt="Offspring" className="w-[300px] h-auto" />
            }
            arrow
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              OFFSPRING
            </Typography>
          </Tooltip>
        
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.name} sx={{ color: '#fff' }} component={Link} to={item.path}>
                {item.icon}
              </Button>
            ))}
          </Box>
          {user ? (
              <Button sx={{ color: '#fff' }} onClick={handleLogout}>
                <LogoutIcon/>
              </Button>
            ) : (
              <Button sx={{ color: '#fff' }} component={Link} to="/login">
                Login
              </Button>
            )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
