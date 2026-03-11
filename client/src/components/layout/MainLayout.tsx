import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Typography } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FormOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/vendors', icon: <TeamOutlined />, label: 'Vendors' },
    { key: '/inventory', icon: <DatabaseOutlined />, label: 'Yarn Inventory' },
    { key: '/looms', icon: <DeploymentUnitOutlined />, label: 'Loom Management' },
    { key: '/production', icon: <FormOutlined />, label: 'Production Entry' },
    { key: '/orders', icon: <ShoppingCartOutlined />, label: 'Orders' },
    { key: '/payments', icon: <DollarOutlined />, label: 'Payments' },
    { key: '/reports', icon: <BarChartOutlined />, label: 'Reports' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
    ...(isAdmin ? [{ key: '/audit', icon: <HistoryOutlined />, label: 'Audit Logs' }] : []),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="glass-card"
        style={{ margin: '16px 0 16px 16px', borderRadius: '16px' }}
        theme="light" 
        breakpoint="lg" 
        onBreakpoint={(broken) => setCollapsed(broken)}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
          <Title level={4} style={{ margin: 0, color: '#1890ff', whiteSpace: 'nowrap' }}>
            {collapsed ? 'KF' : 'Kumaravel LoomFlow'}
          </Title>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ 
            padding: 0, 
            background: 'rgba(255, 255, 255, 0.5)', 
            backdropFilter: 'blur(10px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            paddingRight: 24,
            borderBottom: '1px solid var(--glass-border)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
          className="page-transition"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
