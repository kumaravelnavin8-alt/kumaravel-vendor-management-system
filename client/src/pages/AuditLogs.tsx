import { useEffect, useState } from 'react';
import { Table, Card, Tag, Select, Space, Typography, message } from 'antd';
import api from '../services/api';
import dayjs from 'dayjs';
import type { AuditLog } from '../types';

const { Title } = Typography;

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [module, setModule] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const resp = await api.get('/audit', {
          params: { page, limit: 10, module }
        });
        setLogs(resp.data.logs);
        setTotal(resp.data.total);
      } catch (error: unknown) {
        console.error(error);
        message.error('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page, module]);

  const columns = [
    { title: 'Date', dataIndex: 'timestamp', key: 'timestamp', render: (val: string) => dayjs(val).format('DD-MM-YYYY HH:mm:ss') },
    { title: 'User', dataIndex: ['user', 'name'], key: 'user' },
    { title: 'Module', dataIndex: 'module', key: 'module', render: (val: string) => <Tag color="blue">{val}</Tag> },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'Target ID', dataIndex: 'targetId', key: 'targetId' },
    { title: 'IP Address', dataIndex: 'ipAddress', key: 'ip' },
  ];

  const modules = ['Vendor', 'Inventory', 'Loom', 'Production', 'Order', 'Transaction'];

  return (
    <Card title={<Title level={3}>System Audit Logs</Title>} extra={
      <Space>
        <span>Filter Module:</span>
        <Select allowClear placeholder="All" style={{ width: 150 }} onChange={setModule}>
          {modules.map(m => <Select.Option key={m} value={m}>{m}</Select.Option>)}
        </Select>
      </Space>
    }>
      <Table 
        dataSource={logs} 
        columns={columns} 
        rowKey="_id" 
        loading={loading}
        pagination={{
          current: page,
          total: total,
          pageSize: 10,
          onChange: setPage
        }}
      />
    </Card>
  );
};

export default AuditLogs;
