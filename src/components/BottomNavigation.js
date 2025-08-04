import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, BarChart3, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/add', icon: PlusCircle, label: 'Добавить' },
    { path: '/stats', icon: BarChart3, label: 'Статистика' },
    { path: '/profile', icon: User, label: 'Профиль' }
  ];

  return (
    <nav className="nav">
      <div className="nav-content">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <div
              key={path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <Icon className="nav-icon" />
              <span className="nav-text">{label}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation; 