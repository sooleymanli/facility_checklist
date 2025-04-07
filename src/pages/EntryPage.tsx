import React, { useState } from 'react';
import { DatePicker, Button, Segmented, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/az';

dayjs.locale('az');

const EntryPage: React.FC<{ toggleTheme: () => void; darkMode: boolean }> = ({ toggleTheme, darkMode }) => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const { token } = theme.useToken();

    const handleDateChange = (date: dayjs.Dayjs | null) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleContinue = () => {
        navigate(`/checklist?date=${selectedDate.format('DD.MM.YYYY')}`);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100%',
                background: token.colorBgBase,
                color: token.colorTextBase,
            }}
        >
<div
    style={{
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        padding: '16px 32px', 
        boxSizing: 'border-box', 
    }}
>                    <img
                        src={darkMode ? '/images/logo_light.svg' : '/images/logo_original.svg'}
                        alt="Logo"
                        style={{ width: 80, height: 'auto' }}
                    />
                    <Segmented
                        size="large"
                        shape="round"
                        options={[
                            { value: 'light', icon: <SunOutlined /> },
                            { value: 'dark', icon: <MoonOutlined /> },
                        ]}
                        value={darkMode ? 'dark' : 'light'}
                        onChange={() => toggleTheme()}
                    />
            </div>

            <div
                style={{
                    background: token.colorBgContainer,
                    padding: 32,
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                   
                }}
                className='entry-page-input'
            >
                <h2 style={{ marginBottom: 16 }}>Tarix seçin</h2>
                <DatePicker
                    defaultValue={selectedDate}
                    onChange={handleDateChange}
                    format="DD.MM.YYYY"
                    style={{ width: '100%', marginBottom: 16 }}
                    size="large"
                />
                <Button type="primary" onClick={handleContinue} style={{ width: '100%' }} size="large">
                    Davam et
                </Button>
            </div>
        </div>
    );
};

export default EntryPage;
