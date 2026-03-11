import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, message, Card, Tag, InputNumber, Space, Select } from 'antd';
import api from '../services/api';
import dayjs from 'dayjs';

interface Order {
    _id: string;
    orderId: string;
    customerName: string;
    orderDate: string;
    deliveryDate: string;
    status: string;
    totalAmount: number;
}

const Orders: React.FC = () => {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await api.get('/orders');
      setData(resp.data);
    } catch (error: unknown) { 
      console.error(error);
      message.error('Failed to load orders'); 
    } finally { setLoading(false); }
  };

  const onFinish = async (values: any) => {
    try {
      await api.post('/orders', values);
      message.success('Order created');
      setIsModalVisible(false);
      fetchData();
    } catch (error: unknown) { 
      console.error(error);
      message.error('Failed'); 
    }
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Fabric', dataIndex: 'fabricType', key: 'fabricType' },
    { title: 'Quantity (m)', dataIndex: 'quantityMeters', key: 'quantityMeters' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Order) => (
        // Placeholder for action buttons, e.g., Edit, Delete
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => {
      const color = status === 'Delivered' ? 'green' : (status === 'Pending' ? 'orange' : 'blue');
      return <Tag color={color}>{status}</Tag>;
    }},
    { title: 'Delivery Date', dataIndex: 'deliveryDate', key: 'deliveryDate', render: (val: string) => dayjs(val).format('DD-MM-YYYY') },
  ];

  const filteredData = data.filter((item: Order) => 
    (item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || item.orderId.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!statusFilter || item.status === statusFilter)
  );

  return (
    <Card 
        title="Orders" 
        extra={
            <Space>
                <Input.Search 
                    placeholder="Search ID or Customer..." 
                    onSearch={setSearchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ width: 220 }} 
                />
                <Select 
                    placeholder="All Status" 
                    allowClear 
                    onChange={setStatusFilter} 
                    style={{ width: 140 }}
                >
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="In Production">In Production</Select.Option>
                    <Select.Option value="Delivered">Delivered</Select.Option>
                </Select>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>New Order</Button>
            </Space>
        }
    >
      <Table dataSource={filteredData} columns={columns} rowKey="_id" loading={loading} />
      <Modal title="Create Order" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="orderId" label="Order ID" rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name="customerName" label="Customer Name" rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name="fabricType" label="Fabric Type" rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name="quantityMeters" label="Quantity (Meters)" rules={[{required: true}]}><InputNumber style={{width: '100%'}} /></Form.Item>
          <Form.Item name="deliveryDate" label="Delivery Date" rules={[{required: true}]}><DatePicker style={{width: '100%'}} /></Form.Item>
          <Button type="primary" htmlType="submit" block>Create</Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default Orders;
