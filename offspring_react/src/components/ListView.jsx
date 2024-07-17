import React, { useEffect, useState } from 'react';
import { message, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import { DATE_OPTIONS } from '../constant';
const { Option } = Select;

const ListView = ({ selectedFach, filteredGrades }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedFach) {
      form.setFieldsValue({
        ausbildungsfach: selectedFach.name,
        lernfeld: selectedFach.lernfelder.length > 0 ? selectedFach.lernfelder[0].name : ''
      });
    }
  }, [selectedFach, form]);

  const handleAddGrade = async (values) => {
    try {
      const gradeData = {
        datum: values.datum.format('YYYY-MM-DD'),
        wert: values.wert,
        art: values.art,
        gewichtung: values.gewichtung,
        ausbildungsfach: selectedFach.id,
        lernfeld: values.lernfeld ? selectedFach.lernfelder.find(lf => lf.name === values.lernfeld).id : null,
      };
  
      await addUserGrade(gradeData);
      message.success('Note erfolgreich hinzugefügt');
      form.resetFields();
      setIsModalOpen(false);
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

  const displayedGrades = selectedFach 
    ? filteredGrades.filter(grade => grade.ausbildungsfach === selectedFach.name) 
    : filteredGrades;

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: '1rem' }}>
        Note hinzufügen
      </Button>
      <table className="min-w-fit border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border w-2/16 px-4 py-2 text-left text-sm font-medium text-gray-700">Datum</th>
            <th className="border w-1/16 px-4 py-2 text-left text-sm font-medium text-gray-700">Wert</th>
            <th className="border w-5/16 px-4 py-2 text-left text-sm font-medium text-gray-700">Art</th>
            <th className="border w-1/16 px-4 py-2 text-left text-sm font-medium text-gray-700">Gewichtung</th>
              {/* <th className="border w-1/6 px-4 py-2 text-left text-sm font-medium text-gray-700">Ausbildungsfach</th> */ }
            <th className="border w-1/16 px-4 py-2 text-left text-sm font-medium text-gray-700">Lernfeld</th>
          </tr>
        </thead>
        <tbody>
          {displayedGrades.map(grade => (
            <tr key={grade.id} className="even:bg-gray-50">
              <td className="border px-4 py-2 text-sm text-gray-900">{grade.datum.toLocaleDateString('de-DE', DATE_OPTIONS)}</td>
              <td className="border px-4 py-2 text-sm text-gray-900">{grade.wert}</td>
              <td className="border px-4 py-2 text-sm text-gray-900">{grade.art}</td>
              <td className="border px-4 py-2 text-sm text-gray-900">{grade.gewichtung}</td>
            {/*  <td className="border px-4 py-2 text-sm text-gray-900">{grade.ausbildungsfach}</td>*/ }
              <td className="border px-4 py-2 text-sm text-gray-900">{grade.lernfeld}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
          <Form.Item name="ausbildungsfach" label="Ausbildungsfach" initialValue={selectedFach?.name}>
            <Input readOnly />
          </Form.Item>
          <Form.Item name="lernfeld" label="Lernfeld">
            <Select>
              {selectedFach?.lernfelder.map(lf => (
                <Option key={lf.id} value={lf.name}>{lf.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListView;
