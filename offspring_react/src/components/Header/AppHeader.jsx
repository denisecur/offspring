import { Button, Space } from "antd";
import React from "react";
import { CgWebsite } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { removeToken } from "../../helpers";
const AppHeader = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login", { replace: true });
  };

  return (
    <Space className="header_space">
      <Button className="header_space_brand" href="/" type="link">
        <CgWebsite size={64} />
      </Button>
      <Space className="auth_buttons">
        {user ? (
          <>
    
            <Button
              className="auth_button_signUp"
              type="primary"
              onClick={handleLogout}
            >
              Logoutss
            </Button>
            <Button href="/all-berichtshefte" type="primary">
              Berichtshefte
            </Button>
            <Button href="/noten" type="primary">
              Noten
            </Button>
            <Button href="/azubi-dashboard" type="primary">
              azubi db
            </Button>
            <Button href="/chef-dashboard" type="primary">
              chef db
            </Button>
          </>
        ) : (
          <>
            <Button className="auth_button_login" href="/login" type="link">
              Login
            </Button>
          </>
        )}
      </Space>
    </Space>
  );
};

export default AppHeader;
