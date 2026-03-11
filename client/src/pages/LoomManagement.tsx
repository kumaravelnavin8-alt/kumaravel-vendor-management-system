import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Card, Badge } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import api from '../services/api';
import type { Loom } from '../types';

const LoomManagement: React.FC = () => {
  const [data, setData] = useState<Loom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await api.get('/looms');
      setData(resp.data);
    } catch (error: unknown) {
      console.error(error);
      message.error('Failed to fetch looms');
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, "processing" | "default" | "error" | "success" | "warning"> = {
    'Running': 'processing',
    'Idle': 'default',
    'Maintenance': 'error'
  };

  const columns = [
    { title: 'Loom #', dataIndex: 'loomNumber', key: 'loomNumber' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Badge status={statusColors[status] || 'default'} text={status} />
    )},
    { title: 'Worker', dataIndex: 'workerName', key: 'workerName', render: (val: string) => val || 'Not Assigned' },
    { title: 'Fabric Type', dataIndex: 'fabricType', key: 'fabricType' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Loom) => (
        <Button size="small" icon={<EditOutlined />} onClick={() => {
          form.setFieldsValue(record);
          setIsModalVisible(true);
        }}>Update</Button>
      ),
    },
  ];

  return (
    <div className="page-transition">
      <Card title="Loom Status" className="glass-card" extra={<Button type="primary" onClick={() => { form.resetFields(); setIsModalVisible(true); }}>Add Loom</Button>}>
        <Table dataSource={data} columns={columns} rowKey="_id" loading={loading} />
      
      <Modal title="Loom Details" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={async (values) => {
            try {
                if (form.getFieldValue('_id')) {
                    await api.put(`/looms/${form.getFieldValue('_id')}`, values);
                } else {
                    await api.post('/looms', values);
                }
                message.success('Success');
                setIsModalVisible(false);
                fetchData();
            } catch (error: unknown) { 
                console.error(error);
                message.error('Error'); 
            }
        }}>
          <Form.Item name="loomNumber" label="Loom Number" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="workerName" label="Worker Name"><Input /></Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Running">Running</Select.Option>
              <Select.Option value="Idle">Idle</Select.Option>
              <Select.Option value="Maintenance">Maintenance</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="fabricType" label="Fabric Type"><Input /></Form.Item>
          <Button type="primary" htmlType="submit" block>Save Loom</Button>
        </Form>
      </Modal>
    </Card>
    </div>
  );
};

export default LoomManagement;
