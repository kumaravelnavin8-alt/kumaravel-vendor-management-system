import React, { useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Select, Space, Table, message, DatePicker, Typography } from 'antd';
import api from '../services/api';

interface LoomOption {
  _id: string;
  loomNumber: string;
  status: string;
}

interface ProductionFormValues {
  date: string;
  loomId: string;
  shift: string;
  metersProduced: number;
  fabricType?: string;
}
import dayjs from 'dayjs';

const { Title } = Typography;

interface ProductionEntryItem {
    _id: string;
    date: string;
    loomId: string;
    loomNumber: string;
    metersProduced: number;
    fabricType: string;
    shift: string; // Added shift as it's part of the form and history
}

const ProductionEntry: React.FC = () => {
  const [looms, setLooms] = useState<LoomOption[]>([]);
  const [data, setData] = useState<ProductionEntryItem[]>([]); // Renamed history to data and added type
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLooms();
    fetchData(); // Changed fetchHistory to fetchData
  }, []);

  const fetchLooms = async () => {
    try {
      const resp = await api.get('/looms');
      setLooms(resp.data.filter((l: { status: string }) => l.status === 'Running'));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => { // Renamed fetchHistory to fetchData
    try {
      const resp = await api.get('/production/history');
      setData(resp.data); // Changed setHistory to setData
    } catch (error: unknown) {
      console.error(error);
      message.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: ProductionFormValues) => {
    try {
      await api.post('/production', values);
      message.success('Production recorded');
      form.resetFields();
      fetchData(); // Changed fetchHistory to fetchData
    } catch (error: unknown) {
      console.error(error);
      message.error('Failed to record production');
    }
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', render: (val: string) => dayjs(val).format('DD-MM-YYYY') },
    { title: 'Loom #', dataIndex: ['loomId', 'loomNumber'], key: 'loomNumber' }, // Kept original dataIndex for nested object access
    { title: 'Quantity (m)', dataIndex: 'metersProduced', key: 'metersProduced' }, // Changed title
    { title: 'Fabric Type', dataIndex: 'fabricType', key: 'fabricType' }, // Added Fabric Type column
    { title: 'Shift', dataIndex: 'shift', key: 'shift' }, // Kept Shift column
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: ProductionEntryItem) => (
        <Button size="small" danger onClick={async () => {
          await api.delete(`/production/${record._id}`);
          fetchData(); // Refresh data after deletion
        }}>Delete</Button>
      ),
    },
  ];

  return (
    <div className="page-transition">
      <Card title="Daily Production Entry" className="glass-card">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Space>
            <Form.Item name="date" label="Date" rules={[{ required: true }]} initialValue={dayjs()}>
              <DatePicker />
            </Form.Item>
            <Form.Item name="loomId" label="Loom Number" rules={[{ required: true }]}>
              <Select style={{ width: 150 }}>
                {looms.map((l: LoomOption) => <Select.Option key={l._id} value={l._id}>{l.loomNumber}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="shift" label="Shift" initialValue="Day">
              <Select style={{ width: 100 }}>
                <Select.Option value="Day">Day</Select.Option>
                <Select.Option value="Night">Night</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space>
            <Form.Item name="metersProduced" label="Meters" rules={[{ required: true }]}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="fabricType" label="Fabric Type">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: 29 }}>Record</Button>
          </Space>
        </Form>
        <Title level={4} style={{ marginTop: 24 }}>Recent History</Title>
        <Table dataSource={data} columns={columns} rowKey="_id" loading={loading} size="small" />
      </Card>
    </div>
  );
};

export default ProductionEntry;
