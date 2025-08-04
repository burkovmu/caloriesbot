import React from 'react';
import { Apple, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Apple className="header-icon" />
          <span>CalorieTracker</span>
        </div>
        
        <div className="header-user">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
};

export default Header; 