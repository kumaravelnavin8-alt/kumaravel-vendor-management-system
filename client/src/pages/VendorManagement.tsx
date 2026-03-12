import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Card, Tag, Space, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, PhoneOutlined } from '@ant-design/icons';
import api from '../services/api';
import type { Vendor } from '../types';

interface VendorFormValues {
  name: string;
  vendorType: string;
  contactPerson?: string;
  phone: string;
  address?: string;
  gstin?: string;
}

const VendorManagement: React.FC = () => {
  const [data, setData] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await api.get('/vendors');
      setData(resp.data);
    } catch (error: unknown) {
      console.error(error);
      message.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: VendorFormValues) => {
    try {
      if (editingId) {
        await api.put(`/vendors/${editingId}`, values);
        message.success('Vendor updated');
      } else {
        await api.post('/vendors', values);
        message.success('Vendor added');
      }
      setIsModalVisible(false);
      fetchData();
    } catch (error: unknown) {
      console.error(error);
      message.error('Operation failed');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'vendorType', key: 'vendorType', render: (type: string) => (
      <Tag color="blue">{type}</Tag>
    )},
    { title: 'Contact', dataIndex: 'contactPerson', key: 'contactPerson', render: (val: string, record: Vendor) => (
      <Space direction="vertical" size={0}>
        <span>{val}</span>
        <span style={{ fontSize: '12px', color: '#888' }}><PhoneOutlined /> {record.phone}</span>
      </Space>
    )},
    { title: 'Balance', dataIndex: 'outstandingBalance', key: 'balance', render: (val: number) => (
      <span style={{ color: val > 0 ? '#cf1322' : '#3f8600', fontWeight: 'bold' }}>
        ₹{val.toLocaleString()}
      </span>
    )},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Vendor) => (
        <Space size="middle">
          <Button size="small" icon={<EditOutlined />} onClick={() => {
            setEditingId(record._id);
            form.setFieldsValue(record);
            setIsModalVisible(true);
          }}>Edit</Button>
        </Space>
      ),
    },
  ];

  const filteredData = data.filter((v: Vendor) => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (!typeFilter || v.vendorType === typeFilter)
  );

  return (
    <Card 
        title="Vendor Management" 
        extra={
            <Space>
                <Input.Search 
                    placeholder="Search by name..." 
                    onSearch={setSearchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ width: 250 }} 
                />
                <Select 
                    placeholder="All Categories" 
                    allowClear 
                    onChange={setTypeFilter} 
                    style={{ width: 170 }}
                >
                    <Select.Option value="Yarn Supplier">Yarn Supplier</Select.Option>
                    <Select.Option value="Fabric Buyer">Fabric Buyer</Select.Option>
                    <Select.Option value="Dyeing Unit">Dyeing Unit</Select.Option>
                    <Select.Option value="Worker/Contractor">Worker/Contractor</Select.Option>
                </Select>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => { setEditingId(null); form.resetFields(); setIsModalVisible(true); }}
                >Add Vendor</Button>
            </Space>
        }
    >
      <Table dataSource={filteredData} columns={columns} rowKey="_id" loading={loading} />
      
      <Modal title={editingId ? "Edit Vendor" : "Add Vendor"} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null} width={700}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="name" label="Vendor/Party Name" rules={[{required: true}]}><Input /></Form.Item></Col>
            <Col span={12}>
              <Form.Item name="vendorType" label="Category" rules={[{required: true}]}>
                <Select>
                  <Select.Option value="Yarn Supplier">Yarn Supplier</Select.Option>
                  <Select.Option value="Fabric Buyer">Fabric Buyer</Select.Option>
                  <Select.Option value="Dyeing Unit">Dyeing Unit</Select.Option>
                  <Select.Option value="Worker/Contractor">Worker/Contractor</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="contactPerson" label="Contact Person"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="phone" label="Phone" rules={[{required: true}]}><Input /></Form.Item></Col>
          </Row>
          <Form.Item name="address" label="Address"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="gstin" label="GST Number"><Input /></Form.Item>
          <Button type="primary" htmlType="submit" block size="large">Save Vendor Information</Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default VendorManagement;
