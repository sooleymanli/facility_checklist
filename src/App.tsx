import React, { JSX, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import az_AZ from 'antd/es/locale/az_AZ';
import EntryPage from './pages/EntryPage';
import ChecklistPage from './pages/ChecklistPage';
import './App.css'

const RequireDate: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const date = searchParams.get('date');

  if (!date) {
    return <Navigate to="/" />;
  }

  return children;
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Retrieve the dark mode state from localStorage
    const storedTheme = localStorage.getItem('darkMode');
    return storedTheme === 'true';
  });

  const toggleTheme = () => {
    setDarkMode((prevTheme) => {
      const newTheme = !prevTheme;
      localStorage.setItem('darkMode', String(newTheme)); // Save the new state to localStorage
      return newTheme;
    });
  };

  useEffect(() => {
    // Sync the theme state with localStorage on app load
    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme !== null) {
      setDarkMode(storedTheme === 'true');
    }
  }, []);

  return (
    <ConfigProvider
      locale={az_AZ}
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: darkMode ? '#177ddc' : '#1890ff',
          colorBgBase: darkMode ? '#141414' : '#ffffff',
          colorTextBase: darkMode ? '#ffffff' : '#000000',
          colorBgContainer: darkMode ? '#1f1f1f' : '#ffffff',
          colorBorder: darkMode ? '#434343' : '#d9d9d9',
        },
      }}
    >
      <Router>
        <Routes>
          <Route
            path="/"
            element={<EntryPage toggleTheme={toggleTheme} darkMode={darkMode} />}
          />
          <Route
            path="/checklist/*"
            element={
              <RequireDate>
                <ChecklistPage toggleTheme={toggleTheme} darkMode={darkMode} />
              </RequireDate>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
