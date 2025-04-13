import React, { JSX, useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider, theme, Spin } from 'antd';
import az_AZ from 'antd/es/locale/az_AZ';
import EntryPage from './pages/EntryPage';
import ChecklistPage from './pages/ChecklistPage';
import UserTablesPage from './pages/UserTablesPage';
import DateSelectionPage from './pages/DateSelectionPage';
import ReportsPage from './pages/ReportsPage';
import './App.css'

// Lazy load the AdminPage for better performance
const AdminPage = lazy(() => import('./pages/AdminPage'));

const RequireDate: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const date = searchParams.get('date');

  if (!date) {
    return <Navigate to="/" />;
  }

  return children;
};

// Loading component for suspense fallback
const LoadingPage = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" />
  </div>
);

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

  // Apply data-theme attribute to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
          <Route
            path="/date-selection"
            element={<DateSelectionPage darkMode={darkMode} />}
          />
          <Route
            path="/reports"
            element={<ReportsPage darkMode={darkMode} />}
          />
          <Route 
            path="/admin/*" 
            element={
              <Suspense fallback={<LoadingPage />}>
                <AdminPage toggleTheme={toggleTheme} darkMode={darkMode} />
              </Suspense>
            } 
          />
          <Route
            path="/tables/*"
            element={<UserTablesPage toggleTheme={toggleTheme} darkMode={darkMode} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
