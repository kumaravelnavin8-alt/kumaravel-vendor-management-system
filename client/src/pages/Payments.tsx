import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Card, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { exportPDF } from '../utils/pdfExport';
import api from '../services/api';
import { Transaction, Vendor } from '../types';

const Payments: React.FC = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchVendors();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await api.get('/transactions');
      setData(resp.data);
    } catch (error: unknown) { 
      console.error(error);
      message.error('Failed'); 
    } finally { setLoading(false); }
  };

  const fetchVendors = async () => {
    const resp = await api.get('/vendors');
    setVendors(resp.data);
  };

  const onFinish = async (v: Transaction) => {
    try {
      const selectedVendor = vendors.find((vend: Vendor) => vend._id === v.partyId);
      const transaction = {
        ...v,
        partyName: selectedVendor ? (selectedVendor as any).name : 'Direct',
        partyRef: 'Vendor'
      };
      await api.post('/transactions', transaction);
      message.success('Transaction recorded');
      setIsModalVisible(false);
      fetchData();
    } catch (error: unknown) { 
      console.error(error);
      message.error('Failed'); 
    }
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', render: (val: string) => dayjs(val).format('DD-MM-YYYY') },
    { title: 'Party', dataIndex: 'partyName', key: 'partyName' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => (
      <Tag color={type === 'Debit' ? 'red' : 'green'}>{type}</Tag>
    )},
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (val: number) => `₹${val.toLocaleString()}` },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Transaction) => (
        <Button 
          size="small" 
          icon={<DownloadOutlined />} 
          onClick={() => exportPDF(
            'Payment Receipt',
            ['Field', 'Value'],
            [
              ['Date', dayjs(record.date).format('DD-MM-YYYY')],
              ['Transaction ID', record.transactionId || 'N/A'],
              ['Party Name', record.partyName],
              ['Type', record.type],
              ['Amount', `INR ${record.amount.toLocaleString()}`],
              ['Description', record.description || 'N/A'],
            ],
            `Receipt_${record.transactionId || record._id}`
          )}
        >Receipt</Button>
      ),
    },
  ];

  return (
    <div className="page-transition">
      <Card title="Payment Ledger" className="glass-card" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>New Transaction</Button>}>
        <Table dataSource={data} columns={columns} rowKey="_id" loading={loading} />
      <Modal title="Add Transaction" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="transactionId" label="Transaction ID" rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name="partyId" label="Vendor / Party" rules={[{required: true}]}>
             <Select>
               {vendors.map((v: any) => <Select.Option key={v._id} value={v._id}>{v.name}</Select.Option>)}
             </Select>
          </Form.Item>
          <Space>
            <Form.Item name="amount" label="Amount" rules={[{required: true}]}><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
            <Form.Item name="type" label="Type" rules={[{required: true}]}>
              <Select style={{width: 120}}>
                <Select.Option value="Credit">Credit (+)</Select.Option>
                <Select.Option value="Debit">Debit (-)</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="description" label="Description"><Input.TextArea /></Form.Item>
          <Form.Item name="partyType" label="Party Type" initialValue="Vendor">
            <Select>
              <Select.Option value="Vendor">Vendor</Select.Option>
              <Select.Option value="Worker">Worker</Select.Option>
              <Select.Option value="Customer">Customer</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Save</Button>
        </Form>
      </Modal>
    </Card>
  </div>
  );
};

export default Payments;
