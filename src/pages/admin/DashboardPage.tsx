import React from 'react';
import { Typography, Card, Row, Col, Space, Statistic, Progress, Table, Tag, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  BankOutlined,
  ApartmentOutlined,
  TableOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface DashboardPageProps {
  darkMode: boolean;
}

interface RecentCheck {
  id: string;
  date: string;
  building: string;
  floor: string;
  status: 'completed' | 'pending' | 'overdue';
  checker: string;
  progress: number;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ darkMode }) => {
  const navigate = useNavigate();

  // Sample data
  const buildingSummary = {
    total: 3,
    active: 3,
    details: [
      { name: 'A Binası', floors: 5, occupancy: 85, trend: 5 },
      { name: 'B Binası', floors: 3, occupancy: 60, trend: -2 },
      { name: 'C Binası', floors: 4, occupancy: 75, trend: 3 }
    ]
  };

  const floorSummary = {
    total: 12,
    active: 12,
    withTables: 10,
    occupancy: 75,
    trend: 8
  };

  const tableSummary = {
    total: 48,
    active: 45,
    types: {
      room: 20,
      cleaning: 15,
      equipment: 8,
      other: 5
    },
    completion: 80,
    trend: 12
  };

  const recentChecks: RecentCheck[] = [
    {
      id: '1',
      date: '2024-03-20 09:30',
      building: 'A Binası',
      floor: '2-ci mərtəbə',
      status: 'completed',
      checker: 'Əhməd Məmmədov',
      progress: 100
    },
    {
      id: '2',
      date: '2024-03-20 10:15',
      building: 'B Binası',
      floor: '1-ci mərtəbə',
      status: 'pending',
      checker: 'Leyla Əliyeva',
      progress: 60
    },
    {
      id: '3',
      date: '2024-03-19 16:45',
      building: 'A Binası',
      floor: '3-cü mərtəbə',
      status: 'overdue',
      checker: 'Cavid Hüseynov',
      progress: 30
    }
  ];

  const reportSummary = {
    daily: 24,
    weekly: 168,
    monthly: 720,
    pending: 5,
    completion: 85,
    trend: 15
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#52c41a';
      case 'pending':
        return '#faad14';
      case 'overdue':
        return '#f5222d';
      default:
        return '#1890ff';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      case 'overdue':
        return <WarningOutlined />;
      default:
        return <WarningOutlined />;
    }
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>

      {/* Stats Overview */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title={
                <Space>
                  <BankOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <Text>Binalar</Text>
                  {buildingSummary.details.reduce((acc, curr) => acc + curr.trend, 0) > 0 ? (
                    <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <ArrowDownOutlined style={{ color: '#f5222d' }} />
                  )}
                </Space>
              }
              value={buildingSummary.total}
              suffix={`/ ${buildingSummary.active} aktiv`}
            />
            <Progress 
              percent={buildingSummary.details.reduce((acc, curr) => acc + curr.occupancy, 0) / buildingSummary.details.length} 
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title={
                <Space>
                  <ApartmentOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                  <Text>Mərtəbələr</Text>
                  {floorSummary.trend > 0 ? (
                    <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <ArrowDownOutlined style={{ color: '#f5222d' }} />
                  )}
                </Space>
              }
              value={floorSummary.total}
              suffix={`/ ${floorSummary.withTables} cədvəlli`}
            />
            <Progress 
              percent={floorSummary.occupancy}
              status="active"
              strokeColor={{
                '0%': '#722ed1',
                '100%': '#b37feb',
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title={
                <Space>
                  <TableOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                  <Text>Cədvəllər</Text>
                  {tableSummary.trend > 0 ? (
                    <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <ArrowDownOutlined style={{ color: '#f5222d' }} />
                  )}
                </Space>
              }
              value={tableSummary.total}
              suffix={`/ ${tableSummary.active} aktiv`}
            />
            <Progress 
              percent={tableSummary.completion}
              status="active"
              strokeColor={{
                '0%': '#52c41a',
                '100%': '#95de64',
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title={
                <Space>
                  <FileTextOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
                  <Text>Hesabatlar</Text>
                  {reportSummary.trend > 0 ? (
                    <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <ArrowDownOutlined style={{ color: '#f5222d' }} />
                  )}
                </Space>
              }
              value={reportSummary.daily}
              suffix="bu gün"
            />
            <Progress 
              percent={reportSummary.completion}
              status="active"
              strokeColor={{
                '0%': '#fa8c16',
                '100%': '#ffd591',
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Building Details */}
      <Row gutter={[24, 24]}>
        {buildingSummary.details.map((building, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card 
              title={building.name}
              extra={<Button type="link" onClick={() => navigate('/admin/buildings')}>Detallı</Button>}
              hoverable
            >
              <Statistic
                title="Mərtəbə sayı"
                value={building.floors}
                suffix="mərtəbə"
              />
              <Progress 
                percent={building.occupancy}
                status="active"
                strokeColor={{
                  '0%': '#1890ff',
                  '100%': '#87d068',
                }}
              />
              <div style={{ marginTop: 16 }}>
                <Text type={building.trend > 0 ? 'success' : 'danger'}>
                  {building.trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(building.trend)}% son 30 gündə
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Checks */}
      <Card
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
            <span>Son Yoxlamalar</span>
          </Space>
        }
        extra={
          <Button type="primary" onClick={() => navigate('/admin/reports')}>
            Bütün Hesabatlar
          </Button>
        }
      >
        <Table
          dataSource={recentChecks}
          columns={[
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
              render: (status: string) => (
                <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
                  {status === 'completed' ? 'Tamamlandı' : status === 'pending' ? 'Gözləyir' : 'Gecikmiş'}
                </Tag>
              ),
            },
            {
              title: 'Yoxlayan',
              dataIndex: 'checker',
              key: 'checker',
            },
            {
              title: 'Tərəqqi',
              dataIndex: 'progress',
              key: 'progress',
              render: (progress: number) => (
                <Progress 
                  percent={progress} 
                  size="small" 
                  status={progress === 100 ? 'success' : progress < 50 ? 'exception' : 'active'}
                />
              ),
            }
          ]}
          pagination={false}
          onRow={(record) => ({
            onClick: () => navigate(`/checklist/${record.id}`),
            style: { cursor: 'pointer' }
          })}
        />
      </Card>
    </Space>
  );
};

export default DashboardPage; 