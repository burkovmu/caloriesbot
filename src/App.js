import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import BottomNavigation from './components/BottomNavigation';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import AddFoodPage from './pages/AddFoodPage';
import ProfilePage from './pages/ProfilePage';
import StatsPage from './pages/StatsPage';
import AppearancePage from './pages/AppearancePage';

// Context
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

// Hooks
import { useTelegram } from './hooks/useTelegram';

function App() {
  const { initTelegram, telegramUser } = useTelegram();

  useEffect(() => {
    initTelegram();
  }, [initTelegram]);

  return (
    <ThemeProvider>
      <AppProvider telegramUser={telegramUser}>
        <div className="app-container">
          <div className="app-wrapper">
            <ScrollToTop />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add" element={<AddFoodPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/appearance" element={<AppearancePage />} />
              </Routes>
            </main>
            
            <BottomNavigation />
          </div>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
