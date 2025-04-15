import React, { useState } from "react";
import { Button, Card, Form, DatePicker, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { API } from "../../constant";
import { getToken } from "../../helpers";
// Wir nutzen moment zur Formatierung; alternativ kann auch dayjs verwendet werden.
import moment from "moment";

const AusbildungsstartPrompt = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    const formattedDate = values.ausbildungsstart.format(); // ISO-Format
    try {
      // ACHTUNG: Wenn du das Systemfeld "createdAt" überschreiben willst, muss Strapi dies zulassen.
      // Alternativ lege in Strapi ein eigenes Feld "ausbildungsstart" an.
      const response = await fetch(`${API}/users/${user.id}`, {
         method: "PUT", // oder "PATCH" für Teil-Updates
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${getToken()}`
         },
         body: JSON.stringify({ createdAt: formattedDate })
      });
      const updatedUser = await response.json();
      if(updatedUser.error) {
         throw new Error(updatedUser.error.message || "Update fehlgeschlagen");
      }
      setUser(updatedUser);
      message.success("Ausbildungsstart wurde erfolgreich aktualisiert.");
      navigate("/azubi-dashboard", { replace: true });
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-100">
      <Card title="Ausbildungsstart eingeben" className="w-full max-w-md">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Wann hast du deine Ausbildung begonnen?"
            name="ausbildungsstart"
            rules={[{ required: true, message: "Bitte gib dein Ausbildungsstartdatum an!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Spin /> : "Speichern"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AusbildungsstartPrompt;
