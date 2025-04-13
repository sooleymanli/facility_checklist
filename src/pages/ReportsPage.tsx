import React, { useState } from 'react';
import { DatePicker, Layout, Typography, Button, theme, Space, Select, Table, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/az';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ReportsPageProps {
  darkMode: boolean;
}

interface ReportData {
  key: string;
  date: string;
  building: string;
  floor: string;
  status: string;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ darkMode }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);

  // Sample data - replace with your actual data
  const buildings = [
    { value: 'building1', label: 'Bina 1' },
    { value: 'building2', label: 'Bina 2' },
  ];

  const floors = [
    { value: 'floor1', label: '1-ci mərtəbə' },
    { value: 'floor2', label: '2-ci mərtəbə' },
    { value: 'floor3', label: '3-cü mərtəbə' },
  ];

  const columns = [
    {
      title: 'Tarix',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Bina',
      dataIndex: 'building',
      key: 'building',
    },
    {
      title: 'Mərtəbə',
      dataIndex: 'floor',
      key: 'floor',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  // Sample data
  const data: ReportData[] = [];

  const handleSearch = () => {
    // Implement your search logic here
    console.log('Searching with filters:', { dateRange, selectedBuilding, selectedFloor });
  };

  return (
    <Layout style={{ minHeight: '100vh', background: darkMode ? '#141414' : '#f0f2f5' }}>
      <Header
        style={{
          background: 'transparent',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          position: 'fixed',
          width: '100%',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          style={{ marginRight: 16 }}
        />
        <Title level={4} style={{ margin: 0 }}>Hesabatlar</Title>
      </Header>

      <Content style={{ 
        padding: '120px 24px 50px', 
        maxWidth: 1200, 
        margin: '0 auto', 
        width: '100%',
      }}>
        <Card
          style={{ 
            borderRadius: 16,
            marginBottom: 24,
            background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff'
          }}
        >
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Title level={5} style={{ margin: 0 }}>Filtrlər</Title>
            
            <Space wrap size={16}>
              <RangePicker
                format="DD.MM.YYYY"
                placeholder={['Başlanğıc tarixi', 'Son tarix']}
                onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
                style={{ minWidth: 280 }}
              />
              
              <Select
                placeholder="Bina seçin"
                style={{ minWidth: 200 }}
                options={buildings}
                onChange={setSelectedBuilding}
                allowClear
              />
              
              <Select
                placeholder="Mərtəbə seçin"
                style={{ minWidth: 200 }}
                options={floors}
                onChange={setSelectedFloor}
                allowClear
              />

              <Button 
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Axtar
              </Button>
            </Space>
          </Space>
        </Card>

        <Card
          style={{ 
            borderRadius: 16,
            background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff'
          }}
        >
          <Table<ReportData>
            columns={columns}
            dataSource={data}
            style={{ width: '100%' }}
            pagination={{
              total: data.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default ReportsPage; 