import React, { useState, useEffect } from 'react';
import { Layout, Segmented, Menu, theme } from 'antd';
import { MoonOutlined, SunOutlined, HomeOutlined, AppstoreOutlined, TableOutlined, BuildOutlined, FileExcelOutlined } from '@ant-design/icons';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import DashboardPage from './admin/DashboardPage';
import FloorManagementPage from './admin/FloorManagementPage';
import BuildingManagementPage from './admin/BuildingManagementPage';
import TableManagementPage from './admin/TableManagementPage';
import ReportsPage from './admin/ReportsPage';

const { Header, Content, Footer, Sider } = Layout;

interface AdminPageProps {
  toggleTheme: () => void;
  darkMode: boolean;
}

// Define buildingOptions as a placeholder
const buildingOptions = [
  { label: 'Bina 1', value: 'bina1' },
  { label: 'Bina 2', value: 'bina2' },
  { label: 'Bina 3', value: 'bina3' }
];

// Main Admin component
const AdminPage: React.FC<AdminPageProps> = ({ toggleTheme, darkMode }) => {
  const { token } = theme.useToken();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Header style
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 24px',
    background: token.colorBgContainer,
    color: token.colorTextBase,
    height: 64,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: '100%',
  } as const;

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/admin">İdarə Paneli</Link>,
    },
    {
      key: 'buildings',
      icon: <BuildOutlined />,
      label: <Link to="/admin/buildings">Binalar</Link>,
    },
    {
      key: 'floors',
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/floors">Mərtəbələr</Link>,
    },
    {
      key: 'tables',
      icon: <TableOutlined />,
      label: <Link to="/admin/tables">Cədvəllər</Link>,
    },
    {
      key: 'reports',
      icon: <FileExcelOutlined />,
      label: <Link to="/admin/reports">Hesabatlar</Link>,
    },
  ];

  useEffect(() => {
    // Set active tab based on current path
    const path = location.pathname;
    if (path.includes('/admin/buildings')) {
      setActiveTab('buildings');
    } else if (path.includes('/admin/floors')) {
      setActiveTab('floors');
    } else if (path.includes('/admin/tables')) {
      setActiveTab('tables');
    } else if (path.includes('/admin/reports')) {
      setActiveTab('reports');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: '#001529',
          background: '#001529'
        }}
        theme="dark"
      >
        <div style={{ 
          height: 64, 
          margin: 16, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <img
            src={darkMode ? '/images/logo_light.svg' : '/images/logo_light.svg'}
            alt="Logo"
            style={{ width: collapsed ? 32 : 80, height: 'auto' }}
          />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['dashboard']}
          selectedKeys={[activeTab]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      
      <Layout>
        <Header style={headerStyle}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Segmented
              options={[
                { value: 'light', icon: <SunOutlined /> },
                { value: 'dark', icon: <MoonOutlined /> },
              ]}
              value={darkMode ? 'dark' : 'light'}
              onChange={() => toggleTheme()}
            />
          </div>
        </Header>
        
        <Content style={{ padding: '24px', background: token.colorBgBase }}>
          <Routes>
            <Route path="/" element={<DashboardPage darkMode={darkMode} />} />
            <Route path="/buildings" element={<BuildingManagementPage darkMode={darkMode} />} />
            <Route path="/floors" element={<FloorManagementPage darkMode={darkMode} />} />
            <Route path="/tables" element={<TableManagementPage darkMode={darkMode} />} />
            <Route path="/reports" element={<ReportsPage darkMode={darkMode} />} />
          </Routes>
        </Content>
        
        <Footer style={{ textAlign: 'center', background: token.colorBgContainer }}>
          Admin Panel © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminPage; 