import React, { useState, useEffect } from "react";
import { Alert, Button, Card, Form, Input, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { API } from "../../constant";
import { setToken } from "../../helpers";
import OFFSPRING from "../../../public/offspring_pink.svg";

const Login = () => {
  // Wir entfernen die Nutzung des ThemeContext und erzwingen "basicLight"
  const fixedTheme = "basicLight";
  const navigate = useNavigate();
  const { setUser, setHasFullAccess, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Setze beim Laden der Login-Seite fix das Theme auf "basicLight"
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", fixedTheme);
    console.log("Fixed theme for login set to:", fixedTheme);
  }, []);

  const onFinish = async (values) => {
    setIsLoading(true);
    setError(""); 
    try {
      const response = await fetch(`${API}/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: values.email, password: values.password }),
      });

      const data = await response.json();
      if (data?.error) {
        throw new Error(data.error.message || "Login fehlgeschlagen");
      }

      setToken(data.jwt);
      const userResponse = await fetch(`${API}/users/me?populate=ausbildung,Rollen.permissions`, {
        headers: { Authorization: `Bearer ${data.jwt}` },
      });

      const userData = await userResponse.json();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      const fullAccess = userData.Rollen.some((role) =>
        role.permissions.some((permission) => permission.full_access)
      );
      setHasFullAccess(fullAccess);

      message.success(`Willkommen zurück, ${userData.username}!`);
      navigate(fullAccess ? "/chef-dashboard" : "/azubi-dashboard", { replace: true });
    } catch (error) {
      setError(error?.message ?? "Etwas ist schiefgelaufen!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Wir verwenden hier fixedTheme als key, damit React die Komponente bei Theme-Änderungen nicht neu mounted.
    <div key={fixedTheme} className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-base-100 to-neutral text-text">
      <div className="mb-8 max-w-md w-full flex justify-center">
        <img src={OFFSPRING} alt="Offspring Logo" className="w-full max-w-[500px] h-auto" />
      </div>

      <Card className="w-full max-w-md rounded-lg shadow-lg p-6 border-2 border-accent bg-neutral text-center">
        <h2 className="text-2xl font-bold text-secondary drop-shadow-lg mb-6">Einloggen</h2>

        {error && (
          <Alert
            className="mb-4 bg-error text-error-content border-error"
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
          >
            <Input className="w-full px-4 py-2 border border-accent bg-neutral text-text rounded-lg focus:ring-2" placeholder="Email-Adresse" />
          </Form.Item>

          <Form.Item
            label="Passwort"
            name="password"
            rules={[{ required: true, message: "Bitte gib dein Passwort ein!" }]}
          >
            <Input.Password className="w-full px-4 py-2 border border-accent bg-neutral text-text rounded-lg focus:ring-2" placeholder="Passwort" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full font-bold py-2 px-4 rounded-lg transition-all duration-300 bg-primary text-primary-content shadow-lg" disabled={isLoading}>
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
