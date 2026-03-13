import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import api from '../services/api';

interface CredentialFormValues {
  email?: string;
  password?: string;
}

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const onUpdateCredentials = async (values: CredentialFormValues) => {
    setLoading(true);
    try {
      const payload: CredentialFormValues = {};
      if (values.email && values.email !== user.email) payload.email = values.email;
      if (values.password) payload.password = values.password;

      if (Object.keys(payload).length === 0) {
        message.info('No changes made');
        return;
      }

      const response = await api.put('/auth/credentials', payload);
      
      // Update local storage email if it changed
      if (payload.email) {
        localStorage.setItem('user', JSON.stringify({ ...user, email: payload.email }));
      }
      
      message.success(response.data.message || 'Credentials updated successfully!');
      
      if (values.password) {
        message.info('Please note your new password for your next login.');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Failed to update credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card title="Admin Settings" className="glass-card" style={{ marginBottom: 24 }}>
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

      <Card title="Account Security" className="glass-card">
        <Form 
          layout="vertical" 
          onFinish={onUpdateCredentials}
          initialValues={{ email: user.email }}
          style={{ maxWidth: 400 }}
        >
          <Form.Item 
            label="Login Email" 
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item 
            label="New Password" 
            name="password"
            rules={[
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Leave blank to keep current password" />
          </Form.Item>

          <Button type="primary" danger htmlType="submit" loading={loading}>
            Update Credentials
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default Settings;
