import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { removeToken } from '../../helpers';
import nachwuchsOffspring from '../../assets/nachwuchs_offspring.png';

const navItems = [
  { name: "Home", path: "/" },
  { name: "Profil", path: "/profil" },
  { name: "Berichtshefte", path: "/berichtshefte" },
  { name: "Noten", path: "/noten" },
  { name: "azubi db", path: "/azubi-dashboard" },
  { name: "chef db", path: "/chef-dashboard" },

];

function DrawerAppBar(props) {
  const { window } = props;
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login", { replace: true });
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
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.name} sx={{ color: '#fff' }} component={Link} to={item.path}>
                {item.name}
              </Button>
            ))}
            {user ? (
              <Button sx={{ color: '#fff' }} onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button sx={{ color: '#fff' }} component={Link} to="/login">
                Login
              </Button>
            )}
          </Box>
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
