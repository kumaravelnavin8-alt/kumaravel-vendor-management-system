import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';

const Settings: React.FC = () => {
  return (
    <Card title="Admin Settings">
      <Form layout="vertical" onFinish={() => message.success('Settings updated')}>
        <Form.Item label="Company Name" initialValue="Kumaravel LoomFlow Textiles">
          <Input />
        </Form.Item>
        <Form.Item label="GST Number">
          <Input placeholder="Enter Company GST" />
        </Form.Item>
        <Form.Item label="Invoice Prefix" initialValue="INV-">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">Save Changes</Button>
      </Form>
    </Card>
  );
};

export default Settings;
