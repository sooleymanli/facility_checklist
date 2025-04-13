import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Typography, Select, Table, Tag, Spin, Button, DatePicker, Input, Form } from 'antd';
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined, FormOutlined, FileDoneOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import CustomTable from '../components/CustomTable';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface TableColumnType {
  id: string;
  name: string;
  dataType: 'boolean' | 'string' | 'select' | 'custom-rows';
  options?: string[];
  customRows?: string[];
  required: boolean;
}

interface TableDefinitionType {
  id: string;
  key: string;
  name: string;
  description: string;
  buildingId?: string;
  floorId?: string;
  columns: TableColumnType[];
  createdAt: string;
}

interface BuildingType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface FloorType {
  id: string;
  key: string;
  name: string;
  label: string;
  description: string;
  buildingId?: string;
  createdAt: string;
}

interface UserTablesPageProps {
  toggleTheme: () => void;
  darkMode: boolean;
}

// List of all tables component
const TablesList: React.FC = () => {
  const [tableDefinitions, setTableDefinitions] = useState<TableDefinitionType[]>([]);
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [floors, setFloors] = useState<FloorType[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load table definitions
    const storedTables = localStorage.getItem('tableDefinitions');
    if (storedTables) {
      setTableDefinitions(JSON.parse(storedTables));
    }

    // Load buildings
    const storedBuildings = localStorage.getItem('buildings');
    if (storedBuildings) {
      setBuildings(JSON.parse(storedBuildings));
    }

    // Load floors
    const storedFloors = localStorage.getItem('floors');
    if (storedFloors) {
      setFloors(JSON.parse(storedFloors));
    }

    setLoading(false);
  }, []);

  // Filter tables by building and floor
  const filteredTables = React.useMemo(() => {
    return tableDefinitions.filter(table => {
      if (selectedBuilding && table.buildingId !== selectedBuilding) return false;
      if (selectedFloor && table.floorId !== selectedFloor) return false;
      return true;
    });
  }, [tableDefinitions, selectedBuilding, selectedFloor]);

  // Get building name by ID
  const getBuildingName = (buildingId?: string) => {
    if (!buildingId) return '-';
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.name : '-';
  };

  // Get floor name by ID
  const getFloorName = (floorId?: string) => {
    if (!floorId) return '-';
    const floor = floors.find(f => f.id === floorId);
    return floor ? floor.name : '-';
  };

  // Handle click on table to navigate to its view
  const handleTableClick = (tableId: string) => {
    navigate(`/tables/view/${tableId}`);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <Title level={4}>Cədvəllər</Title>
      <Text>Tamamlanacaq yoxlama cədvəlini seçin</Text>
      
      <div style={{ marginTop: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          <Select 
            placeholder="Bina seçin" 
            style={{ width: 200 }}
            allowClear 
            onChange={value => setSelectedBuilding(value)}
          >
            {buildings.map(building => (
              <Option key={building.id} value={building.id}>{building.name}</Option>
            ))}
          </Select>
          
          <Select 
            placeholder="Mərtəbə seçin" 
            style={{ width: 200 }}
            allowClear
            onChange={value => setSelectedFloor(value)}
          >
            {floors
              .filter(floor => !selectedBuilding || floor.buildingId === selectedBuilding)
              .map(floor => (
                <Option key={floor.id} value={floor.id}>{floor.name}</Option>
              ))
            }
          </Select>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {filteredTables.length > 0 ? (
          filteredTables.map(table => (
            <Card 
              key={table.id}
              hoverable
              style={{ width: 300, marginBottom: 16 }}
              onClick={() => handleTableClick(table.id)}
            >
              <Card.Meta
                title={table.name}
                description={
                  <>
                    <p>{table.description}</p>
                    <div style={{ marginTop: 8 }}>
                      {table.buildingId && (
                        <Tag color="blue">{getBuildingName(table.buildingId)}</Tag>
                      )}
                      {table.floorId && (
                        <Tag color="green">{getFloorName(table.floorId)}</Tag>
                      )}
                    </div>
                  </>
                }
              />
            </Card>
          ))
        ) : (
          <div style={{ width: '100%', textAlign: 'center', padding: 40 }}>
            <Text type="secondary">Heç bir cədvəl tapılmadı</Text>
          </div>
        )}
      </div>
    </div>
  );
};

// Individual table view component
const TableView: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [tableDefinition, setTableDefinition] = useState<TableDefinitionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(dayjs());
  const [inspector, setInspector] = useState('');
  const [signature, setSignature] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load the specific table definition
    const storedTables = localStorage.getItem('tableDefinitions');
    if (storedTables && tableId) {
      const tables = JSON.parse(storedTables);
      const table = tables.find((t: TableDefinitionType) => t.id === tableId);
      if (table) {
        setTableDefinition(table);
      }
    }
    
    setLoading(false);
  }, [tableId]);

  // Handle form submission
  const handleSubmit = () => {
    if (!inspector) {
      alert('Yoxlayan şəxs adını daxil edin.');
      return;
    }

    // In a real app, this would save the inspection data to a backend
    alert('Yoxlama məlumatları uğurla yadda saxlanıldı!');
    navigate('/tables');
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!tableDefinition) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Text type="secondary">Cədvəl tapılmadı</Text>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => navigate('/tables')}>
            Cədvəl siyahısına qayıt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={4}>{tableDefinition.name}</Title>
          <Text>{tableDefinition.description}</Text>
        </div>
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          onClick={handleSubmit}
        >
          Yadda saxla
        </Button>
      </div>
      
      <Card style={{ marginBottom: 16 }}>
        <Form layout="vertical">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Form.Item 
              label="Tarix" 
              required 
              style={{ width: 200 }}
            >
              <DatePicker 
                value={date} 
                onChange={value => setDate(value || dayjs())} 
                format="DD.MM.YYYY"
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            <Form.Item 
              label="Yoxlayan şəxs" 
              required
              style={{ width: 200 }}
            >
              <Input 
                value={inspector} 
                onChange={e => setInspector(e.target.value)} 
                placeholder="Ad və soyadı daxil edin" 
              />
            </Form.Item>
            
            <Form.Item 
              label="İmza" 
              style={{ width: 200 }}
            >
              <Input 
                value={signature} 
                onChange={e => setSignature(e.target.value)} 
                placeholder="İmza" 
              />
            </Form.Item>
          </div>
        </Form>
      </Card>
      
      <CustomTable 
        darkMode={false} 
        tableDefinition={tableDefinition} 
      />
    </div>
  );
};

// Main UserTablesPage component
const UserTablesPage: React.FC<UserTablesPageProps> = ({ toggleTheme, darkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active menu item based on current path
  const getSelectedKey = () => {
    if (location.pathname === '/tables') return ['list'];
    if (location.pathname.includes('/tables/view')) return ['view'];
    return ['list'];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme={darkMode ? 'dark' : 'light'}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: '#001529',
          background: '#001529'
        }}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 16 }}>
          <img
            src={'/images/logo_light.svg'}
            alt="Logo"
            style={{ width: collapsed ? 32 : 80, height: 'auto' }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['list']}
          selectedKeys={getSelectedKey()}
          items={[
            {
              key: 'list',
              icon: <HomeOutlined />,
              label: <Link to="/tables">Cədvəllər</Link>,
            },
            {
              key: 'home',
              icon: <FormOutlined />,
              label: <Link to="/">Ana səhifə</Link>,
            },
          ]}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 16px', 
          background: darkMode ? '#1f1f1f' : '#fff',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Text style={{ margin: 0 }}>Yoxlama cədvəlləri</Text>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: darkMode ? '#141414' : '#fff', borderRadius: 8 }}>
          <Routes>
            <Route path="/" element={<TablesList />} />
            <Route path="/view/:tableId" element={<TableView />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserTablesPage; 