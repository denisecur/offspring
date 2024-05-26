import React, { useState, useEffect } from 'react';
import { API } from '../constant';
import { message, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import { getToken } from "../helpers";

const { Option } = Select;

const ListView = () => {
    const [grades, setGrades] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchGrades = async () => {
        const url = `${API}/users/me?populate=ausbildung.noten.ausbildungsfach,ausbildung.noten.lernfeld`; // Angepasste URL für die Noten
        const token = getToken(); // Token abrufen

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Netzwerkantwort war nicht ok");
            }

            const result = await response.json();
            const gradesData = result.ausbildung.noten;

            // Überprüfen Sie, ob gradesData ein Array ist, bevor Sie es setzen
            if (Array.isArray(gradesData)) {
                setGrades(gradesData);
            } else {
                console.error("Expected gradesData to be an array, but got:", gradesData);
                setGrades([]);
            }
        } catch (error) {
            console.error(error);
            message.error("Error while fetching grades!");
        } finally {
            console.info("Done fetching grades");
        }
    };

    const handleAddGrade = async (values) => {
        try {
            const token = getToken();
            const response = await fetch(`${API}/notes`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Netzwerkantwort war nicht ok");
            }

            message.success("Note erfolgreich hinzugefügt!");
            fetchGrades();
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error(error);
            message.error("Error while adding grade!");
        }
    };

    useEffect(() => {
        fetchGrades();
    }, []);

    return (
        <div>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Note hinzufügen
            </Button>
            <Modal
                title="Neue Note hinzufügen"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            handleAddGrade(values);
                        })
                        .catch(info => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="datum" label="Datum" rules={[{ required: true, message: 'Bitte Datum eingeben' }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="wert" label="Wert" rules={[{ required: true, message: 'Bitte Wert eingeben' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="art" label="Art" rules={[{ required: true, message: 'Bitte Art auswählen' }]}>
                        <Select>
                            <Option value="Schulaufgabe">Schulaufgabe</Option>
                            <Option value="Kurzarbeit">Kurzarbeit</Option>
                            <Option value="Stegreifaufgabe">Stegreifaufgabe</Option>
                            <Option value="Muendliche Leistung">Muendliche Leistung</Option>
                            <Option value="Projekt">Projekt</Option>
                            <Option value="Praesentation">Praesentation</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="gewichtung" label="Gewichtung">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="ausbildungsfach" label="Ausbildungsfach">
                        <Input />
                    </Form.Item>
                    <Form.Item name="lernfeld" label="Lernfeld">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            {grades.map((grade) => (
                <div key={grade.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
                    <p><strong>Datum:</strong> {grade.datum}</p>
                    <p><strong>Wert:</strong> {grade.wert}</p>
                    <p><strong>Art:</strong> {grade.art}</p>
                    <p><strong>Gewichtung:</strong> {grade.gewichtung}</p>
                    <p><strong>Ausbildungsfach:</strong> {grade.ausbildungsfach?.name || 'N/A'}</p>
                    <p><strong>Lernfeld:</strong> {grade.lernfeld?.name || 'N/A'}</p>
                </div>
            ))}
        </div>
    );
}

export default ListView;
