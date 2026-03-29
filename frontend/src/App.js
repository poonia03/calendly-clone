import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import EventTypes from './components/EventTypes';
import Availability from './components/Availability';
import Meetings from './components/Meetings';
import PublicBooking from './components/PublicBooking';
import { loadTheme, saveTheme } from './utils/themeStorage';
import './App.css';

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

function App() {
  const [theme, setTheme] = useState(() => loadTheme());

  useEffect(() => {
    saveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Router>
        <Routes>
          <Route path="/book/:slug" element={<PublicBooking />} />
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<EventTypes />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/meetings" element={<Meetings />} />
          </Route>
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
