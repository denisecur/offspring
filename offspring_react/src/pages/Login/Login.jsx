import React, { useState, useEffect } from "react";
import { Alert, Button, Card, Form, Input, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { API } from "../../constant";
import { setToken } from "../../helpers";
import OFFSPRING from "../../../public/text-1739362619826 (1).svg";
import { useTheme } from "@mui/material/styles";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setUser, setHasFullAccess } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const updateTheme = () => {
      document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "cp1");
    };
    updateTheme();
  }, []);

  const onFinish = async (values) => {
    setIsLoading(true);
    setError(""); // Fehler zurücksetzen
    try {
      const value = {
        identifier: values.email,
        password: values.password,
      };
      const response = await fetch(`${API}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const data = await response.json();
      if (data?.error) {
        throw new Error(data.error.message || "Login fehlgeschlagen");
      } else {
        setToken(data.jwt);

        const userResponse = await fetch(
          `${API}/users/me?populate=ausbildung, Rollen.permissions`,
          { headers: { Authorization: `Bearer ${data.jwt}` } }
        );
        const userData = await userResponse.json();
        setUser(userData);

        const fullAccess = userData.Rollen.some((role) =>
          role.permissions.some((permission) => permission.full_access)
        );
        setHasFullAccess(fullAccess);

        message.success(`Willkommen zurück, ${userData.username}!`);
        navigate(fullAccess ? "/chef-dashboard" : "/azubi-dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login-Fehler:", error);
      setError(error?.message ?? "Etwas ist schiefgelaufen!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #01012b 10%, #005678 90%)",
        color: theme.palette.text.primary,
      }}
    >
      <div className="mb-8 max-w-md w-full flex justify-center">
        <img src={OFFSPRING} alt="Offspring Logo" className="w-full max-w-[300px] h-auto" />
      </div>

      <Card
        className="w-full max-w-md rounded-lg shadow-lg p-6"
        style={{
          border: `2px solid ${theme.palette.accent}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: `0px 0px 20px ${theme.palette.accent}`,
          textAlign: "center",
        }}
      >
        <h2
          className="text-2xl font-bold text-center mb-6"
          style={{ color: theme.palette.secondary, textShadow: "0px 0px 5px #05d9e8" }}
        >
          Einloggen
        </h2>

        {error && (
          <Alert
            className="mb-4"
            style={{
              backgroundColor: theme.palette.error,
              color: theme.palette.error.contrastText,
              borderColor: theme.palette.error.main,
            }}
            message={error}
            type="error"
            closable
            afterClose={() => setError("")}
          />
        )}

        <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Bitte gib eine gültige E-Mail-Adresse ein!" }]}
            className="text-white"
          >
            <Input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2"
              style={{
                borderColor: theme.palette.accent,
                backgroundColor: theme.palette.neutral,
                color: theme.palette.text.primary,
              }}
              placeholder="Email-Adresse"
            />
          </Form.Item>

          <Form.Item
            label="Passwort"
            name="password"
            rules={[{ required: true, message: "Bitte gib dein Passwort ein!" }]}
            className="text-white"
          >
            <Input.Password
              className="w-full px-4 py-2 border rounded-lg focus:ring-2"
              style={{
                borderColor: theme.palette.accent,
                backgroundColor: theme.palette.neutral,
                color: theme.palette.text.primary,
              }}
              placeholder="Passwort"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full font-bold py-2 px-4 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: `0px 0px 10px ${theme.palette.accent}`,
                textTransform: "uppercase",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spin size="small" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
