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

  // Предотвращаем уведомление о несохраненных изменениях при закрытии
  useEffect(() => {
    // Полностью отключаем уведомление
    window.onbeforeunload = null;
    
    // Переопределяем обработчик
    const originalBeforeUnload = window.onbeforeunload;
    window.onbeforeunload = null;
    
    // Также отключаем через addEventListener
    const handleBeforeUnload = (e) => {
      // Не делаем ничего - просто игнорируем событие
      return null;
    };

    // Проверяем, что мы в Telegram WebView
    if (window.Telegram && window.Telegram.WebApp) {
      // В Telegram WebView отключаем уведомление более агрессивно
      window.onbeforeunload = null;
      window.addEventListener('beforeunload', handleBeforeUnload, true);
      
      // Дополнительно отключаем через document
      document.addEventListener('beforeunload', handleBeforeUnload, true);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload, true);
      document.removeEventListener('beforeunload', handleBeforeUnload, true);
      window.onbeforeunload = originalBeforeUnload;
    };
  }, []);

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
