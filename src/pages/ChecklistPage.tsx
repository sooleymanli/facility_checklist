import React, { useEffect, useState } from 'react';
import { Layout, DatePicker, Segmented, theme, Select, Dropdown, Menu, Button } from 'antd';
import { MoonOutlined, SunOutlined, SettingOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { useSearchParams, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import CustomTable from '../components/CustomTable';
import SaveModal from '../components/SaveModal';

const { Header, Content } = Layout;

const ChecklistPage: React.FC<{ toggleTheme: () => void; darkMode: boolean }> = ({ toggleTheme, darkMode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get('date');
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const floors = [
    { key: 'first-floor', label: '1ci mərtəbə' },
    { key: 'second-floor', label: '2ci mərtəbə' },
    { key: 'third-floor', label: '3cü mərtəbə' },
    { key: 'fourth-floor', label: '4cü mərtəbə' },
    { key: 'dalga', label: 'Dalğa' },
  ];

  const tabs = [
    { key: 'rooms', label: 'Otaqlar' },
    { key: 'cleaning', label: 'Təmizlik' },
    { key: 'vehicles', label: 'Maşınlar' },
    { key: 'temperature', label: 'Temperator' },
  ];

  const [activeFloor, setActiveFloor] = useState('first-floor');
  const [activeTab, setActiveTab] = useState('rooms');
  const [selectedDate, setSelectedDate] = useState(dayjs(date, 'DD.MM.YYYY'));
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024 || window.matchMedia('(orientation: landscape)').matches);
  const [selectsInHeader, setSelectsInHeader] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length >= 5) {
      setActiveFloor(pathParts[3]);
      setActiveTab(pathParts[4]);
    }
  }, [location]);

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      setIsSmallScreen(width < 1024);
    };

    checkScreen(); // İlk renderdə ölçünü yoxla

    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleFloorChange = (key: string) => {
    navigate(`/checklist/building/${key}/${activeTab}?date=${selectedDate.format('DD.MM.YYYY')}`);
  };

  const handleTabChange = (key: string) => {
    navigate(`/checklist/building/${activeFloor}/${key}?date=${selectedDate.format('DD.MM.YYYY')}`);
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      setSearchParams({ date: date.format('DD.MM.YYYY') });
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'toggleTheme') {
      toggleTheme();
    } else if (key === 'moveSelects') {
      setSelectsInHeader(!selectsInHeader);
    }
  };

  const handleSave = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalConfirm = (inspector: string, signature: string) => {
    console.log('Inspector:', inspector);
    console.log('Signature:', signature);
    // Add logic to save the data
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item>
        <Segmented
          size="middle"
          shape="round"
          block
          options={[
            { value: 'light', icon: <SunOutlined /> },
            { value: 'dark', icon: <MoonOutlined /> },
          ]}
          onClick={(e) => e.stopPropagation()}
          value={darkMode ? 'dark' : 'light'}
          onChange={() => {
            toggleTheme();
          }}
        />
      </Menu.Item>
      <Menu.Item>
        <Segmented
          shape="round"
          size="middle"
          block
          options={[
            { value: true, icon: <VerticalAlignTopOutlined /> },
            { value: false, icon: <VerticalAlignBottomOutlined /> },
          ]}
          onClick={(e) => e.stopPropagation()}
          value={selectsInHeader ? true : false}
          onChange={(value) => {
            setSelectsInHeader(value);
          }}
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ height: '100vh', background: token.colorBgBase, display: 'flex', flexDirection: 'column' }}>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: token.colorBgContainer,
          color: token.colorTextBase,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '0 16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 16 }}>
          <img
            src={darkMode ? '/images/logo_light.svg' : '/images/logo_original.svg'}
            alt="Logo"
            style={{ width: 80, height: 'auto' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 8,
            flexWrap: 'wrap',
          }}
        >
          {selectsInHeader && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Select value={activeFloor} onChange={(value) => handleFloorChange(value)} style={{ width: 120 }}>
                  {floors.map((floor) => (
                    <Select.Option key={floor.key} value={floor.key}>
                      {floor.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Select value={activeTab} onChange={(value) => handleTabChange(value)} style={{ width: 120 }}>
                  {tabs.map((tab) => (
                    <Select.Option key={tab.key} value={tab.key}>
                      {tab.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format="DD.MM.YYYY"
                allowClear={false}
                inputReadOnly
                size="middle"
              />
            </>
          )}

          <Button onClick={handleSave} type="primary">
            Yadda saxla
          </Button>

          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="default" icon={<SettingOutlined />} />
          </Dropdown>
        </div>
      </Header>
      {!selectsInHeader && (
        <div
          className="checklist-filter-header"
          style={{
            position: 'fixed',
            top: 64,
            width: '100%',
            zIndex: 999,
            background: token.colorBgContainer,
            color: token.colorTextBase,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            padding: '8px 16px',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <>
            {isSmallScreen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Select value={activeFloor} onChange={(value) => handleFloorChange(value)} style={{ width: 120 }}>
                  {floors.map((floor) => (
                    <Select.Option key={floor.key} value={floor.key}>
                      {floor.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Segmented
                  size="middle"
                  options={floors.map((floor) => ({ value: floor.key, label: floor.label }))}
                  value={activeFloor}
                  onChange={(value) => handleFloorChange(value as string)}
                  style={{ flex: '0 1 auto' }}
                />
              </div>
            )}

            {isSmallScreen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Select value={activeTab} onChange={(value) => handleTabChange(value)} style={{ width: 120 }}>
                  {tabs.map((tab) => (
                    <Select.Option key={tab.key} value={tab.key}>
                      {tab.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Segmented
                  size="middle"
                  options={tabs.map((tab) => ({ value: tab.key, label: tab.label }))}
                  value={activeTab}
                  onChange={(value) => handleTabChange(value as string)}
                />
              </div>
            )}
          </>

          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            format="DD.MM.YYYY"
            allowClear={false}
            inputReadOnly
            size="middle"
            style={{
              background: isSmallScreen ? '' : darkMode ? '#141414' : '#f5f5f5',
              color: isSmallScreen ? '' : darkMode ? '#ffffffa6' : '#000000a6',
              borderColor: isSmallScreen ? '' : 'transparent',
              borderRadius: '8px',
            }}
          />
        </div>
      )}
      <Content
        style={{
          marginTop: !selectsInHeader ? 128 : 68,
          padding: '8px',
          background: token.colorBgBase,
          color: token.colorTextBase,
          flex: 1,
          overflow: 'auto',
          width: '100%',
        }}
      >
        <Routes>
          <Route
            path="building/:floor/:tab"
            element={<TabContent floor={activeFloor} tab={activeTab} date={selectedDate.format('DD.MM.YYYY')} />}
          />
          <Route path="*" element={<Navigate to={`/checklist/building/first-floor/rooms?date=${selectedDate.format('DD.MM.YYYY')}`} />} />
        </Routes>
      </Content>
      <SaveModal visible={isModalVisible} onClose={handleModalClose} onConfirm={handleModalConfirm} />
    </Layout>
  );
};

const TabContent: React.FC<{ floor?: string; tab: string; date?: string | null }> = ({ floor, tab, date }) => {
  const { token } = theme.useToken();
console.log('TabContent:', floor, tab, date);
  return (
    <div
      style={{
        background: token.colorBgContainer,
        color: token.colorTextBase,
        borderRadius: 8,
        width: '100%',
      }}
    >
      <CustomTable tab={tab} />
    </div>
  );
};

export default ChecklistPage;
