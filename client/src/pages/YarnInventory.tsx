import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Card, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../services/api';

const YarnInventoryUI: React.FC = () => {
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    fetchVendors();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await api.get('/inventory');
      setData(resp.data);
    } catch (e) {
      message.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    const resp = await api.get('/vendors');
    setVendors(resp.data.filter((v: any) => v.vendorType === 'Yarn Supplier'));
  };

  const onFinish = async (values: any) => {
    try {
      await api.post('/inventory', values);
      message.success('Stock updated');
      setIsModalVisible(false);
      fetchData();
    } catch (e) {
      message.error('Failed to add stock');
    }
  };

  const columns = [
    { title: 'Yarn Type', dataIndex: 'yarnType', key: 'yarnType' },
    { title: 'Denier', dataIndex: 'denier', key: 'denier' },
    { title: 'Color', dataIndex: 'color', key: 'color' },
    { title: 'Stock (kg)', dataIndex: 'stockQuantity', key: 'stockQuantity', render: (val: number, record: any) => (
      <Tag color={val <= record.lowStockThreshold ? 'red' : 'green'}>{val}</Tag>
    )},
    { title: 'Price (₹)', dataIndex: 'purchasePrice', key: 'purchasePrice' },
    { title: 'Vendor', dataIndex: ['vendor', 'name'], key: 'vendor' },
  ];

  const filteredData = data.filter((v: any) => 
    (v.yarnType.toLowerCase().includes(searchTerm.toLowerCase()) || v.color.toLowerCase().includes(searchTerm.toLowerCase())) && 
    (!vendorFilter || (v.vendor && v.vendor._id === vendorFilter))
  );

  return (
    <Card 
        title="Yarn Inventory" 
        extra={
            <Space>
                <Input.Search 
                    placeholder="Search yarn or color..." 
                    onSearch={setSearchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ width: 220 }} 
                />
                <Select 
                    placeholder="All Vendors" 
                    allowClear 
                    onChange={setVendorFilter} 
                    style={{ width: 170 }}
                >
                    {vendors.map((v: any) => <Select.Option key={v._id} value={v._id}>{v.name}</Select.Option>)}
                </Select>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Add Stock</Button>
            </Space>
        }
    >
      <Table dataSource={filteredData} columns={columns} rowKey="_id" loading={loading} />
      
      <Modal title="Add Yarn Stock" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="yarnType" label="Yarn Type" rules={[{ required: true }]}><Input /></Form.Item>
          <Space>
            <Form.Item name="denier" label="Denier" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="color" label="Color" rules={[{ required: true }]}><Input /></Form.Item>
          </Space>
          <Space>
            <Form.Item name="stockQuantity" label="Quantity" rules={[{ required: true }]}><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
            <Form.Item name="purchasePrice" label="Price" rules={[{ required: true }]}><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
          </Space>
          <Form.Item name="vendor" label="Vendor" rules={[{ required: true }]}>
            <Select>
              {vendors.map((v: any) => <Select.Option key={v._id} value={v._id}>{v.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Save Stock</Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default YarnInventoryUI;
