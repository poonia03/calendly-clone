import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { CalendarDays, Clock, CalendarRange, Moon, Sun } from 'lucide-react';
import { useTheme } from '../App';

function DashboardLayout() {
  const { theme, setTheme } = useTheme();
  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo" aria-hidden>
            <CalendarDays size={22} strokeWidth={2} />
          </div>
          <span className="sidebar-title">Calendly</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={linkClass}>
            <CalendarDays size={20} strokeWidth={2} />
            Event Types
          </NavLink>
          <NavLink to="/availability" className={linkClass}>
            <Clock size={20} strokeWidth={2} />
            Availability
          </NavLink>
          <NavLink to="/meetings" className={linkClass}>
            <CalendarRange size={20} strokeWidth={2} />
            Meetings
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <p>Scheduling Platform v1.0</p>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <>
                <Moon size={16} strokeWidth={2} />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun size={16} strokeWidth={2} />
                <span>Light</span>
              </>
            )}
          </button>
        </div>
      </aside>
      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
