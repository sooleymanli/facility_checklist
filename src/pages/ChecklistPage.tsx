import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Layout, DatePicker, Segmented, theme, Select, Dropdown, Menu, Button, Drawer } from 'antd';
import { MoonOutlined, SunOutlined, SettingOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined, MenuOutlined } from '@ant-design/icons';
import { useSearchParams, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import CustomTable from '../components/CustomTable';
import SaveModal from '../components/SaveModal';

const { Header, Content, Footer } = Layout;

// Move these constants outside of component
const FLOORS = [
  { key: 'first-floor', label: '1ci mərtəbə' },
  { key: 'second-floor', label: '2ci mərtəbə' },
  { key: 'third-floor', label: '3cü mərtəbə' },
  { key: 'fourth-floor', label: '4cü mərtəbə' },
  { key: 'dalga', label: 'Dalğa' },
];

const TABS = [
  { key: 'rooms', label: 'Otaqlar' },
  { key: 'cleaning', label: 'Təmizlik' },
  { key: 'vehicles', label: 'Maşınlar' },
  { key: 'temperature', label: 'Temperator' },
];

// Cached resize observer
let resizeObserver: undefined | ResizeObserver;

const ChecklistPage: React.FC<{ toggleTheme: () => void; darkMode: boolean }> = ({ toggleTheme, darkMode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get('date');
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const [activeFloor, setActiveFloor] = useState('first-floor');
  const [activeTab, setActiveTab] = useState('rooms');
  const [selectedDate, setSelectedDate] = useState(() => dayjs(date, 'DD.MM.YYYY'));
  const [isSmallScreen, setIsSmallScreen] = useState(() => window.innerWidth < 1024);
  const [isMobileScreen, setIsMobileScreen] = useState(() => window.innerWidth < 568);
  const [selectsInHeader, setSelectsInHeader] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Parse path only when location changes
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length >= 5) {
      setActiveFloor(pathParts[3]);
      setActiveTab(pathParts[4]);
    }
  }, [location]);

  // Optimized screen size detection with debounce
  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      setIsSmallScreen(width < 1024);
      setIsMobileScreen(width < 568);
    };

    // Initial check
    checkScreen();

    // Use ResizeObserver instead of event listener for better performance
    if (!resizeObserver) {
      let timeoutId: ReturnType<typeof setTimeout>;
      resizeObserver = new ResizeObserver(() => {
        // Debounce to avoid excessive updates
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkScreen, 200);
      });
    }
    
    resizeObserver.observe(document.body);
    
    return () => {
      if (resizeObserver) {
        resizeObserver.unobserve(document.body);
      }
    };
  }, []);

  // Modify handler functions to not close the menu on selections
  const handleFloorChange = useCallback((key: string) => {
    // Only update the floor without navigation or closing drawer
    setActiveFloor(key);
  }, []);

  const handleTabChange = useCallback((key: string) => {
    // Only update the tab without navigation or closing drawer
    setActiveTab(key);
  }, []);

  const handleDateChange = useCallback((date: dayjs.Dayjs | null) => {
    if (date) {
      // Only update the date without closing drawer
      setSelectedDate(date);
      setSearchParams({ date: date.format('DD.MM.YYYY') });
    }
  }, [setSearchParams]);
  
  // Handler for the Göstər button that closes the drawer and navigates
  const handleShowSelection = useCallback(() => {
    // Navigate to the selected route
    navigate(`/checklist/building/${activeFloor}/${activeTab}?date=${selectedDate.format('DD.MM.YYYY')}`);
    // Close the drawer
    setDrawerVisible(false);
  }, [activeFloor, activeTab, selectedDate, navigate]);

  const handleMenuClick = useCallback(({ key }: { key: string }) => {
    if (key === 'toggleTheme') {
      toggleTheme();
    } else if (key === 'moveSelects') {
      setSelectsInHeader((prev) => !prev);
    }
  }, [toggleTheme]);

  const handleSave = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleModalConfirm = useCallback((inspector: string, signature: string) => {
    console.log('Inspector:', inspector);
    console.log('Signature:', signature);
    // Add logic to save the data
    setIsModalVisible(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setDrawerVisible((prev) => !prev);
  }, []);

  const handleFloorChangeAndNavigate = useCallback((key: string) => {
    navigate(`/checklist/building/${key}/${activeTab}?date=${selectedDate.format('DD.MM.YYYY')}`);
  }, [activeTab, selectedDate, navigate]);

  const handleTabChangeAndNavigate = useCallback((key: string) => {
    navigate(`/checklist/building/${activeFloor}/${key}?date=${selectedDate.format('DD.MM.YYYY')}`);
  }, [activeFloor, selectedDate, navigate]);

  // Memoize parts of the UI to avoid unnecessary re-renders
  const mobileMenu = useMemo(() => (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '16px' }}>
        <h4>Mərtəbə</h4>
        <Select value={activeFloor} onChange={handleFloorChange} style={{ width: '100%' }}>
          {FLOORS.map((floor) => (
            <Select.Option key={floor.key} value={floor.key}>
              {floor.label}
            </Select.Option>
          ))}
        </Select>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <h4>Tab</h4>
        <Select value={activeTab} onChange={handleTabChange} style={{ width: '100%' }}>
          {TABS.map((tab) => (
            <Select.Option key={tab.key} value={tab.key}>
              {tab.label}
            </Select.Option>
          ))}
        </Select>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <h4>Tarix</h4>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          format="DD.MM.YYYY"
          allowClear={false}
          inputReadOnly
          style={{ width: '100%' }}
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <h4>Tema</h4>
        <Segmented
          size="middle"
          shape="round"
          block
          options={[
            { value: 'light', icon: <SunOutlined /> },
            { value: 'dark', icon: <MoonOutlined /> },
          ]}
          value={darkMode ? 'dark' : 'light'}
          onChange={() => {
            toggleTheme();
          }}
        />
      </div>
      
      {/* Add show button that applies selection */}
      <Button 
        type="primary" 
        onClick={handleShowSelection}
        size="large"
        style={{ marginTop: 'auto', marginBottom: '16px' }}
      >
        Göstər
      </Button>
    </div>
  ), [activeFloor, activeTab, selectedDate, darkMode, handleFloorChange, handleTabChange, handleDateChange, toggleTheme, handleShowSelection]);

  // Memoize dropdown menu
  const menu = useMemo(() => (
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
          value={selectsInHeader}
          onChange={(value) => {
            setSelectsInHeader(value);
          }}
        />
      </Menu.Item>
    </Menu>
  ), [darkMode, selectsInHeader, handleMenuClick, toggleTheme]);

  // Memoize header styles
  const headerStyle = useMemo(() => ({
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
  } as const), [token.colorBgContainer, token.colorTextBase]);

  // Memoize filter header styles
  const filterHeaderStyle = useMemo(() => ({
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
  } as const), [token.colorBgContainer, token.colorTextBase]);

  // Memoize content styles
  const contentStyle = useMemo(() => ({
    marginTop: !isMobileScreen && !selectsInHeader ? 128 : 68,
    padding: '8px',
    background: token.colorBgBase,
    color: token.colorTextBase,
    flex: 1,
    overflow: 'auto',
    width: '100%',
    paddingBottom: isMobileScreen ? 60 : 0, // Add bottom padding for the footer in mobile view
  } as const), [isMobileScreen, selectsInHeader, token.colorBgBase, token.colorTextBase]);

  // Memoize footer styles
  const footerStyle = useMemo(() => ({
    position: 'fixed',
    bottom: 0,
    width: '100%',
    backgroundColor: token.colorBgContainer,
    padding: '10px 16px',
    textAlign: 'center',
    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  } as const), [token.colorBgContainer]);

  return (
    <Layout style={{ height: '100vh', background: token.colorBgBase, display: 'flex', flexDirection: 'column' }}>
      <Header style={headerStyle}>
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
          {!isMobileScreen && selectsInHeader && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Select value={activeFloor} onChange={(value) => {
                  handleFloorChange(value);
                  handleFloorChangeAndNavigate(value);
                }} style={{ width: 120 }}>
                  {FLOORS.map((floor) => (
                    <Select.Option key={floor.key} value={floor.key}>
                      {floor.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Select value={activeTab} onChange={(value) => {
                  handleTabChange(value);
                  handleTabChangeAndNavigate(value);
                }} style={{ width: 120 }}>
                  {TABS.map((tab) => (
                    <Select.Option key={tab.key} value={tab.key}>
                      {tab.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <DatePicker
                value={selectedDate}
                onChange={(date) => {
                  handleDateChange(date);
                  if (date) {
                    setSearchParams({ date: date.format('DD.MM.YYYY') });
                  }
                }}
                format="DD.MM.YYYY"
                allowClear={false}
                inputReadOnly
                size="middle"
              />
            </>
          )}

          {!isMobileScreen && (
            <Button onClick={handleSave} type="primary">
              Yadda saxla
            </Button>
          )}

          {isMobileScreen ? (
            <Button icon={<MenuOutlined />} onClick={toggleDrawer} />
          ) : (
            <Dropdown overlay={menu} trigger={['click']}>
              <Button type="default" icon={<SettingOutlined />} />
            </Dropdown>
          )}
        </div>
      </Header>
      
      {!isMobileScreen && !selectsInHeader && (
        <div className="checklist-filter-header" style={filterHeaderStyle}>
          <>
            {isSmallScreen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Select value={activeFloor} onChange={(value) => {
                  handleFloorChange(value);
                  handleFloorChangeAndNavigate(value);
                }} style={{ width: 120 }}>
                  {FLOORS.map((floor) => (
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
                  options={FLOORS.map((floor) => ({ value: floor.key, label: floor.label }))}
                  value={activeFloor}
                  onChange={(value) => {
                    handleFloorChange(value as string);
                    handleFloorChangeAndNavigate(value as string);
                  }}
                  style={{ flex: '0 1 auto' }}
                />
              </div>
            )}

            {isSmallScreen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Select value={activeTab} onChange={(value) => {
                  handleTabChange(value);
                  handleTabChangeAndNavigate(value);
                }} style={{ width: 120 }}>
                  {TABS.map((tab) => (
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
                  options={TABS.map((tab) => ({ value: tab.key, label: tab.label }))}
                  value={activeTab}
                  onChange={(value) => {
                    handleTabChange(value as string);
                    handleTabChangeAndNavigate(value as string);
                  }}
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
      
      <Content style={contentStyle}>
        <Routes>
          <Route
            path="building/:floor/:tab"
            element={<TabContent floor={activeFloor} tab={activeTab} date={selectedDate.format('DD.MM.YYYY')} />}
          />
          <Route path="*" element={<Navigate to={`/checklist/building/first-floor/rooms?date=${selectedDate.format('DD.MM.YYYY')}`} />} />
        </Routes>
      </Content>
      
      {isMobileScreen && (
        <Footer style={footerStyle}>
          <Button onClick={handleSave} type="primary" block>
            Yadda saxla
          </Button>
        </Footer>
      )}
      
      <Drawer
        title="Menyu"
        placement="right"
        onClose={toggleDrawer}
        open={drawerVisible}
        width={250}
      >
        {mobileMenu}
      </Drawer>
      
      <SaveModal visible={isModalVisible} onClose={handleModalClose} onConfirm={handleModalConfirm} />
    </Layout>
  );
};

// Memoize the TabContent component
const TabContent: React.FC<{ floor?: string; tab: string; date?: string | null }> = React.memo(({ floor, tab, date }) => {
  const { token } = theme.useToken();
  
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
});

export default React.memo(ChecklistPage);
