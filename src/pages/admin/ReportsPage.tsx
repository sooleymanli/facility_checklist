import React, { useState, useCallback, useMemo } from 'react';
import { Button, DatePicker, theme, Table, Dropdown, Menu, Space, Typography, Modal, Image, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DownOutlined, FileExcelOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

import { RecordType, FLOORS, TABS, generateSampleData, getBase64Signature } from '../../utils/adminUtils';
import { BooleanCell } from '../../components/AdminComponents';

// Reports Page Component
const ReportsPage: React.FC<{ 
  darkMode: boolean; 
}> = ({ darkMode }) => {
  const { token } = theme.useToken();
  const [selectedDateRange, setSelectedDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs()
  ]);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [currentSignature, setCurrentSignature] = useState<string | null>(null);
  const [currentInspector, setCurrentInspector] = useState<string | null>(null);
  const [lastFormatted, setLastFormatted] = useState<string | null>(null);
  const [tableFormat, setTableFormat] = useState({
    zebra: false,
    compact: false,
    bordered: true,
    size: 'middle' as 'small' | 'middle' | 'large',
  });
  
  // Generate sample data based on selected date range
  const data = useMemo(() => {
    const [startDate, endDate] = selectedDateRange;
    return generateSampleData(startDate, endDate);
  }, [selectedDateRange]);
  
  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (selectedFloor && item.floorName !== selectedFloor) return false;
      if (selectedCategory && item.category !== selectedCategory) return false;
      return true;
    });
  }, [data, selectedFloor, selectedCategory]);

  // Function to show signature modal
  const showSignatureModal = useCallback((signature: string, inspector: string) => {
    setCurrentSignature(signature);
    setCurrentInspector(inspector);
    setSignatureModalVisible(true);
  }, []);

  // Table columns definition
  const columns: ColumnsType<RecordType> = useMemo(() => [
    {
      title: 'Tarix',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      sorter: (a, b) => dayjs(a.date, 'DD.MM.YYYY').unix() - dayjs(b.date, 'DD.MM.YYYY').unix(),
    },
    {
      title: 'Mərtəbə',
      dataIndex: 'floorName',
      key: 'floorName',
      width: 120,
      filters: FLOORS.map(floor => ({ text: floor.label, value: floor.label })),
      onFilter: (value, record) => record.floorName === value,
    },
    {
      title: 'Kateqoriya',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      filters: TABS.map(tab => ({ text: tab.label, value: tab.label })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Otaq',
      dataIndex: 'roomName',
      key: 'roomName',
      width: 150,
    },
    {
      title: 'Işıq',
      dataIndex: 'light',
      key: 'light',
      width: 80,
      render: (value) => <BooleanCell value={value} />,
    },
    {
      title: 'Avadanlıq',
      dataIndex: 'equipment',
      key: 'equipment',
      width: 80,
      render: (value) => <BooleanCell value={value} />,
    },
    {
      title: 'Masa altı',
      dataIndex: 'underTable',
      key: 'underTable',
      width: 80,
      render: (value) => <BooleanCell value={value} />,
    },
    {
      title: 'Divar',
      dataIndex: 'wall',
      key: 'wall',
      width: 80,
      render: (value) => <BooleanCell value={value} />,
    },
    {
      title: 'Tavan',
      dataIndex: 'ceiling',
      key: 'ceiling',
      width: 80,
      render: (value) => <BooleanCell value={value} />,
    },
    {
      title: 'Pəncərə',
      dataIndex: 'window',
      key: 'window',
      width: 80,
      render: (value) => <BooleanCell value={value} />,
    },
    {
      title: 'Qapı',
      dataIndex: 'door',
      key: 'door',
      width: 80,
      render: (value) => <BooleanCell value={value} />,
    },
    {
      title: 'Döşəmə',
      dataIndex: 'floorCondition',
      key: 'floorCondition',
      width: 80,
      render: (value) => <BooleanCell value={value} />,
    },
    {
      title: 'Kreslo',
      dataIndex: 'chair',
      key: 'chair',
      width: 80,
      render: (value) => <BooleanCell value={value} />,
    },
    {
      title: 'Yoxlayan Şəxs',
      dataIndex: 'inspector',
      key: 'inspector',
      width: 150,
      sorter: (a, b) => a.inspector.localeCompare(b.inspector),
      filters: [
        ...new Set(data.map(item => item.inspector))
      ].map(inspector => ({ text: inspector, value: inspector })),
      onFilter: (value, record) => record.inspector === value,
    },
    {
      title: 'İmza',
      dataIndex: 'signature',
      key: 'signature',
      width: 120,
      render: (value, record) => (
        value ? (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showSignatureModal(value, record.inspector)}
            style={{ padding: 0 }}
          >
            İmzaya bax
          </Button>
        ) : "İmza yoxdur"
      ),
    },
  ], [data, showSignatureModal]);

  // Export to Excel
  const exportToExcel = useCallback(() => {
    const exportData = filteredData.map(item => ({
      Tarix: item.date,
      Mərtəbə: item.floorName,
      Kateqoriya: item.category,
      Otaq: item.roomName,
      Işıq: item.light === null ? 'N/A' : item.light ? '+' : '-',
      Avadanlıq: item.equipment === null ? 'N/A' : item.equipment ? '+' : '-',
      'Masa altı': item.underTable === null ? 'N/A' : item.underTable ? '+' : '-',
      Divar: item.wall === null ? 'N/A' : item.wall ? '+' : '-',
      Tavan: item.ceiling === null ? 'N/A' : item.ceiling ? '+' : '-',
      Pəncərə: item.window === null ? 'N/A' : item.window ? '+' : '-',
      Qapı: item.door === null ? 'N/A' : item.door ? '+' : '-',
      Döşəmə: item.floorCondition === null ? 'N/A' : item.floorCondition ? '+' : '-',
      Kreslo: item.chair === null ? 'N/A' : item.chair ? '+' : '-',
      'Yoxlayan Şəxs': item.inspector,
      'İmza': item.signature ? 'Var' : 'Yoxdur',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate filename with current date
    const fileName = `facility-checklist-export-${dayjs().format('YYYY-MM-DD')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }, [filteredData]);

  // Function to format the table
  const formatTable = useCallback(() => {
    message.success('Cədvəl formalaşdırıldı');
    setLastFormatted(dayjs().format('HH:mm:ss'));
  }, []);

  // Filters section style
  const filtersStyle = {
    padding: '16px 24px',
    background: token.colorBgContainer,
    borderRadius: '8px',
    marginBottom: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  } as const;

  return (
    <>
      <div style={filtersStyle}>
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold' }}>Tarix Aralığı:</label>
          <DatePicker.RangePicker 
            value={selectedDateRange}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setSelectedDateRange([dates[0], dates[1]]);
              }
            }}
            format="DD.MM.YYYY"
          />
        </div>
        
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold' }}>Mərtəbə:</label>
          <Dropdown
            overlay={
              <Menu 
                selectedKeys={selectedFloor ? [selectedFloor] : []}
                onClick={({key}) => setSelectedFloor(key === 'all' ? null : key)}
              >
                <Menu.Item key="all">Hamısı</Menu.Item>
                {FLOORS.map(floor => (
                  <Menu.Item key={floor.label}>{floor.label}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button>
              <Space>
                {selectedFloor || 'Bütün mərtəbələr'}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
        
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold' }}>Kateqoriya:</label>
          <Dropdown
            overlay={
              <Menu 
                selectedKeys={selectedCategory ? [selectedCategory] : []}
                onClick={({key}) => setSelectedCategory(key === 'all' ? null : key)}
              >
                <Menu.Item key="all">Hamısı</Menu.Item>
                {TABS.map(tab => (
                  <Menu.Item key={tab.label}>{tab.label}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button>
              <Space>
                {selectedCategory || 'Bütün kateqoriyalar'}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
        
        <Button 
          type="primary" 
          icon={<FileExcelOutlined />}
          onClick={exportToExcel}
        >
          Excel Export
        </Button>

        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={formatTable}
          style={{ marginLeft: '8px', background: token.colorPrimary, borderColor: token.colorPrimary }}
        >
          Cədvəli Formalaşdır
        </Button>
        
        {lastFormatted && (
          <Typography.Text type="secondary" style={{ marginLeft: '8px' }}>
            Son formalaşdırılma: {lastFormatted}
          </Typography.Text>
        )}
      </div>
      
      <div style={{ background: token.colorBgContainer, padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
        <Table 
          columns={columns} 
          dataSource={filteredData}
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1300 }}
          size={tableFormat.size}
          bordered={tableFormat.bordered}
        />
      </div>
      
      {/* Signature Modal */}
      <Modal
        title={`${currentInspector} - İmza`}
        open={signatureModalVisible}
        onCancel={() => setSignatureModalVisible(false)}
        footer={null}
        width={400}
        centered
      >
        {currentSignature && (
          <div style={{ textAlign: 'center' }}>
            <Image
              src={getBase64Signature(currentSignature)}
              alt={`${currentInspector} imzası`}
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default ReportsPage; 