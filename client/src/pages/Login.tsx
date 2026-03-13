import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface LoginFormValues {
  email: string;
  password: string;
}

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Background ping to wake up Render.com sleeping server
  React.useEffect(() => {
    api.get('/health').catch(() => {});
  }, []);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', values);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('authChange'));
      message.success(`Welcome back, ${response.data.user.name || 'User'}! Login successful.`);
      navigate('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', padding: '16px' }}>
      <Card style={{ width: '100%', maxWidth: 450, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, flexWrap: 'nowrap' }}>
            <img src="/logo.png" alt="LoomFlow Logo" style={{ width: 36, height: 36, marginRight: 8 }} />
            <Title level={2} style={{ color: '#1890ff', margin: 0, whiteSpace: 'nowrap', fontSize: 'clamp(20px, 6vw, 30px)' }}>Kumaravel LoomFlow</Title>
          </div>
          <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 'clamp(12px, 3.5vw, 14px)' }}>Vendor & Production Management System</Text>
        </div>
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 45, fontSize: 16 }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default Login;
