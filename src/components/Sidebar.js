// src/components/Sidebar.js
// Left sidebar with navigation links – shown on all admin pages.

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/',             label: 'Event Types', icon: '📅' },
  { to: '/availability', label: 'Availability', icon: '🕐' },
  { to: '/meetings',     label: 'Meetings',     icon: '📋' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="logo-icon">🗓</span>
        <span className="logo-text">Calendly</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom profile */}
      <div className="sidebar-profile">
        <div className="avatar">JD</div>
        <div>
          <div className="profile-name">John Doe</div>
          <div className="profile-email">john@example.com</div>
        </div>
      </div>
    </aside>
  );
}
