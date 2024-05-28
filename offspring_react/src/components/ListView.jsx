import React, { useEffect, useState } from 'react';
import { fetchUserGrades, addUserGrade } from '../api/noten/notenService';
import { message, Button, Modal, Form, Input, DatePicker, Select, Table } from 'antd';

const { Option } = Select;

const ListView = () => {
  const [grades, setGrades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const data = await fetchUserGrades();
        const gradesData = data?.ausbildung?.noten?.map(note => ({
          id: note.id,
          datum: note.datum,
          wert: note.wert,
          art: note.art,
          gewichtung: note.gewichtung,
          ausbildungsfach: note.ausbildungsfach?.name,
          lernfeld: note.lernfeld?.name,
        })) || [];
        setGrades(gradesData);
      } catch (error) {
        message.error('Fehler beim Abrufen der Noten');
      }
    };

    loadGrades();
  }, []);

  const handleAddGrade = async (values) => {
    try {
      const gradeData = {
        datum: values.datum.format('YYYY-MM-DD'),
        wert: values.wert,
        art: values.art,
        gewichtung: values.gewichtung,
        ausbildungsfach: values.ausbildungsfach,
        lernfeld: values.lernfeld,
      };

      await addUserGrade(gradeData);
      message.success('Note erfolgreich hinzugefügt');
      form.resetFields();
      setIsModalOpen(false);

      const data = await fetchUserGrades();
      const gradesData = data?.ausbildung?.noten?.map(note => ({
        id: note.id,
        datum: note.datum,
        wert: note.wert,
        art: note.art,
        gewichtung: note.gewichtung,
        ausbildungsfach: note.ausbildungsfach?.name,
        lernfeld: note.lernfeld?.name,
      })) || [];
      setGrades(gradesData);
    } catch (error) {
      message.error('Fehler beim Hinzufügen der Note');
    }
  };

  const handleArtChange = (value) => {
    let gewichtung = 1;
    if (value === 'Schulaufgabe') {
      gewichtung = 2;
    } else if (value === 'Stegreifaufgabe' || value === 'Muendliche Leistung') {
      gewichtung = 0.5;
    }
    form.setFieldsValue({ gewichtung });
  };

  const columns = [
    {
      title: 'Datum',
      dataIndex: 'datum',
      key: 'datum',
    },
    {
      title: 'Wert',
      dataIndex: 'wert',
      key: 'wert',
    },
    {
      title: 'Art',
      dataIndex: 'art',
      key: 'art',
    },
    {
      title: 'Gewichtung',
      dataIndex: 'gewichtung',
      key: 'gewichtung',
    },
    {
      title: 'Ausbildungsfach',
      dataIndex: 'ausbildungsfach',
      key: 'ausbildungsfach',
    },
    {
      title: 'Lernfeld',
      dataIndex: 'lernfeld',
      key: 'lernfeld',
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: '1rem' }}>
        Note hinzufügen
      </Button>
      <Table columns={columns} dataSource={grades} rowKey="id" pagination={false} />
      <Modal
        title="Neue Note hinzufügen"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
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
            <Select onChange={handleArtChange}>
              <Option value="Schulaufgabe">Schulaufgabe</Option>
              <Option value="Kurzarbeit">Kurzarbeit</Option>
              <Option value="Stegreifaufgabe">Stegreifaufgabe</Option>
              <Option value="Muendliche Leistung">Muendliche Leistung</Option>
              <Option value="Projekt">Projekt</Option>
              <Option value="Praesentation">Praesentation</Option>
            </Select>
          </Form.Item>
          <Form.Item name="gewichtung" label="Gewichtung">
            <Input type="number" readOnly />
          </Form.Item>
          <Form.Item name="ausbildungsfach" label="Ausbildungsfach">
            <Input />
          </Form.Item>
          <Form.Item name="lernfeld" label="Lernfeld">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListView;
