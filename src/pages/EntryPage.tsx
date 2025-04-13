import React from 'react';
import { Segmented, Card, Layout, Typography, Row, Col, Space, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  FormOutlined, 
  SettingOutlined,
  ArrowRightOutlined,
  SunOutlined,
  MoonOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/az';
import { motion } from 'framer-motion';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

interface EntryPageProps {
  toggleTheme: () => void;
  darkMode: boolean;
}

const MotionCard = motion(Card);

const EntryPage: React.FC<EntryPageProps> = ({ toggleTheme, darkMode }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const today = dayjs().format('DD.MM.YYYY');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
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
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <motion.img
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          src={darkMode ? '/images/logo_light.svg' : '/images/logo_original.svg'}
          alt="Logo"
          style={{ height: 40 }}
        />
        <Segmented
          value={darkMode ? 'dark' : 'light'}
          onChange={(value) => toggleTheme()}
          options={[
            {
              value: 'light',
              icon: <SunOutlined style={{ fontSize: 16 }} />,
            },
            {
              value: 'dark',
              icon: <MoonOutlined style={{ fontSize: 16 }} />,
            },
          ]}
          style={{
            backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : '#fff',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : token.colorBorder}`,
          }}
        />
      </Header>
      
      <Content style={{ padding: '80px 24px 50px', position: 'relative' }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{ maxWidth: 1200, margin: '0 auto' }}
        >
          <Space direction="vertical" size={32} style={{ width: '100%' }}>
            <motion.div 
              variants={itemVariants}
              style={{ textAlign: 'center' }}
            >
              <Title style={{ 
                fontSize: 36, 
          
              }}>
                Facility Checklist
              </Title>
              <Text style={{ 
                fontSize: 16, 
                opacity: 0.8,
                margin: '0 auto',
                display: 'block'
              }}>
                Obyekt yoxlama sistemini seçərək gündəlik yoxlamaları asanlıqla idarə edin
              </Text>
            </motion.div>

            <Row gutter={[24, 12]} justify="center">
              <Col xs={24} md={8}>
                <MotionCard
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  hoverable
                  onClick={() => navigate(`/checklist/building/first-floor/rooms?date=${today}`)}
                  style={{ 
                    borderRadius: 16,
                    overflow: 'hidden',
                    height: '100%',
                    background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff'
                  }}
                >
                  <Space direction="vertical" size={24} style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: 64,
                      color: '#1890ff',
                      background: darkMode ? 'rgba(24,144,255,0.1)' : 'rgba(24,144,255,0.1)',
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <FormOutlined />
                    </div>
                    <div>
                      <Title level={3} style={{ marginBottom: 8 }}>Yoxlama Cədvəli</Title>
                      <Text style={{ fontSize: 16, opacity: 0.8 }}>
                        Bu günün yoxlama cədvəlini doldurun
                      </Text>
                    </div>
                  </Space>
                </MotionCard>
              </Col>

              <Col xs={24} md={8}>
                <MotionCard
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  hoverable
                  onClick={() => navigate('/reports')}
                  style={{ 
                    borderRadius: 16,
                    overflow: 'hidden',
                    height: '100%',
                    background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff'
                  }}
                >
                  <Space direction="vertical" size={24} style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: 64,
                      color: '#722ed1',
                      background: darkMode ? 'rgba(114,46,209,0.1)' : 'rgba(114,46,209,0.1)',
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <BarChartOutlined />
                    </div>
                    <div>
                      <Title level={3} style={{ marginBottom: 8 }}>Hesabatlar</Title>
                      <Text style={{ fontSize: 16, opacity: 0.8 }}>
                        Tarix aralığı və mərtəbə üzrə hesabatlara baxın
                      </Text>
                    </div>
                  </Space>
                </MotionCard>
              </Col>

              <Col xs={24} md={8}>
                <MotionCard
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  hoverable
                  onClick={() => navigate('/admin')}
                  style={{ 
                    borderRadius: 16,
                    overflow: 'hidden',
                    height: '100%',
                    background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff'
                  }}
                >
                  <Space direction="vertical" size={24} style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: 64,
                      color: '#52c41a',
                      background: darkMode ? 'rgba(82,196,26,0.1)' : 'rgba(82,196,26,0.1)',
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <SettingOutlined />
                    </div>
                    <div>
                      <Title level={3} style={{ marginBottom: 8 }}>İdarəetmə Paneli</Title>
                      <Text style={{ fontSize: 16, opacity: 0.8 }}>
                        Sistem parametrlərini və cədvəlləri idarə edin
                      </Text>
                    </div>
                  </Space>
                </MotionCard>
              </Col>
            </Row>
          </Space>
        </motion.div>
      </Content>
      
      <Footer style={{ 
        textAlign: 'center', 
        background: 'transparent',
        borderTop: '1px solid rgba(0,0,0,0.06)'
      }}>
        <Text style={{ opacity: 0.6 }}>
          Facility Checklist © {new Date().getFullYear()}
        </Text>
      </Footer>
    </Layout>
  );
};

export default EntryPage;
