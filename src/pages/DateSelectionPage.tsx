import React, { useState } from 'react';
import { DatePicker, Layout, Typography, Button, theme, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/az';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface DateSelectionPageProps {
  darkMode: boolean;
}

const DateSelectionPage: React.FC<DateSelectionPageProps> = ({ darkMode }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const onDateSelect = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleContinue = () => {
    navigate(`/checklist/building/first-floor/rooms?date=${selectedDate.format('DD.MM.YYYY')}`);
  };

  // Custom date render to format the selected date
  const formatSelectedDate = (date: Dayjs) => {
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
    return `${date.date()} ${months[date.month()]} ${date.year()}`;
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
        <Title level={4} style={{ margin: 0 }}>Tarix Seçimi</Title>
      </Header>

      <Content style={{ 
        padding: '120px 24px 50px', 
        maxWidth: 400, 
        margin: '0 auto', 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ 
          background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
          padding: 32,
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24
        }}>
          <DatePicker
            defaultValue={dayjs()}
            format="DD.MM.YYYY"
            disabledDate={current => current && current > dayjs().endOf('day')}
            onChange={onDateSelect}
            allowClear={false}
            style={{
              width: '100%',
              height: 40
            }}
          />
          
          <Text style={{ 
            fontSize: 18,
            opacity: 0.8,
            marginTop: 8
          }}>
            Seçilmiş tarix: {formatSelectedDate(selectedDate)}
          </Text>

          <Button 
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={handleContinue}
            style={{
              width: '100%',
              height: 40,
              marginTop: 8
            }}
          >
            Davam et
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default DateSelectionPage; 