import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, message, Typography } from 'antd';
import { 
  RocketOutlined, 
  SyncOutlined, 
  PauseCircleOutlined, 
  LineChartOutlined, 
  AlertOutlined 
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<{
    totalLooms: number;
    runningLooms: number;
    idleLooms: number;
    todayProduction: number;
    pendingOrders: number;
    lowYarnStock: number;
    totalVendorBalance: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/reports/stats');
      setStats(response.data);
    } catch (error: unknown) {
      console.error(error);
      message.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const dummyChartData = [
    { day: 'Mon', production: 120 },
    { day: 'Tue', production: 150 },
    { day: 'Wed', production: 110 },
    { day: 'Thu', production: 180 },
    { day: 'Fri', production: 210 },
    { day: 'Sat', production: 190 },
    { day: 'Sun', production: 160 },
  ];

  if (loading || !stats) return <div style={{ textAlign: 'center', paddingTop: 50 }}><Spin size="large" /></div>;

  return (
    <div className="page-transition">
      <Title level={2}>Dashboard Overview</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="glass-card stat-card">
            <Statistic title="Total Looms" value={stats.totalLooms} prefix={<RocketOutlined style={{ color: '#1890ff' }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="glass-card stat-card">
            <Statistic title="Running Looms" value={stats.runningLooms} valueStyle={{ color: '#3f8600' }} prefix={<SyncOutlined spin={stats.runningLooms > 0} />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="glass-card stat-card">
            <Statistic title="Idle Looms" value={stats.idleLooms} valueStyle={{ color: '#cf1322' }} prefix={<PauseCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="glass-card stat-card">
            <Statistic title="Today's Production (m)" value={stats.todayProduction} prefix={<LineChartOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} title="Low Stock Alerts" className="glass-card" extra={<AlertOutlined style={{ color: '#faad14' }} />}>
            <Statistic value={stats.lowYarnStock} suffix="Items" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} title="Pending Orders" className="glass-card">
            <Statistic value={stats.pendingOrders} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} title="Total Vendor Balance" className="glass-card">
            <Statistic value={stats.totalVendorBalance} prefix="₹" precision={2} />
          </Card>
        </Col>
      </Row>

      <Card title="Weekly Production Trend" className="glass-card" style={{ marginTop: 24 }}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dummyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="production" stroke="#1890ff" fill="#e6f7ff" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
