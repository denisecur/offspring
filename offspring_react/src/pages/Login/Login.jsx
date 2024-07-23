// src/pages/Login/Login.jsx
import React, { Fragment, useState } from "react";
import { Alert, Button, Card, Col, Form, Input, message, Row, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { API } from "../../constant";
import { setToken } from "../../helpers";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setHasFullAccess } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    setIsLoading(true);
    setError("");  // Clear previous errors
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
        throw new Error(data.error.message || "Login failed");
      } else {
        // Set the token
        setToken(data.jwt);

        // Fetch user details
        const userResponse = await fetch(`${API}/users/me?populate=Rollen.permissions`, {
          headers: { Authorization: `Bearer ${data.jwt}` },
        });
        const userData = await userResponse.json();

        // Set the user
        setUser(userData);

        // Determine full access
        const fullAccess = userData.Rollen.some(role => 
          role.permissions.some(permission => permission.full_access)
        );
        setHasFullAccess(fullAccess);

        // Show success message
        message.success(`Welcome back ${userData.username}!`);

        // Navigate to appropriate dashboard
        if (fullAccess) {
          navigate("/chef-dashboard", { replace: true });
        } else {
          navigate("/azubi-dashboard", { replace: true });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error?.message ?? "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="items-center">
        <Row align="middle">
          <Col>
            <Card title="Einloggen">
              {error && (
                <Alert
                  className="alert_error"
                  message={error}
                  type="error"
                  closable
                  afterClose={() => setError("")}
                />
              )}
              <Form
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please input a valid email address!",
                    },
                  ]}
                >
                  <Input placeholder="Email-Addresse" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Please input your password!" }]}
                >
                  <Input.Password placeholder="Passwort" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login_submit_btn"
                    disabled={isLoading}
                  >
                    Login {isLoading && <Spin size="small" />}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default Login;
