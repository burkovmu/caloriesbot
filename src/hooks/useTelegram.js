import { useCallback, useState, useEffect } from 'react';

export const useTelegram = () => {
  const [telegramUser, setTelegramUser] = useState(null);

  const initTelegram = useCallback(() => {
    console.log('Инициализация Telegram...');
    console.log('window.Telegram:', window.Telegram);
    console.log('window.Telegram?.WebApp:', window.Telegram?.WebApp);
    
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Initialize the Telegram Web App
      tg.ready();
      
      // Set the header color to match our theme
      tg.setHeaderColor('#667eea');
      
      // Enable closing confirmation
      tg.enableClosingConfirmation();
      
      // Get user data
      const user = tg.initDataUnsafe?.user;
      console.log('Telegram user data:', user);
      
      if (user) {
        console.log('Устанавливаем пользователя Telegram:', user);
        setTelegramUser(user);
      } else {
        // Fallback for development - create mock user
        const mockUser = {
          id: 123456789,
          first_name: 'Тестовый',
          last_name: 'Пользователь',
          username: 'test_user',
          language_code: 'ru'
        };
        console.log('Устанавливаем тестового пользователя:', mockUser);
        setTelegramUser(mockUser);
      }
      
      // Set the main button if needed
      // tg.MainButton.setText('Сохранить');
      // tg.MainButton.show();
    } else {
      console.log('Telegram WebApp не найден, создаем тестового пользователя');
      const mockUser = {
        id: 123456789,
        first_name: 'Тестовый',
        last_name: 'Пользователь',
        username: 'test_user',
        language_code: 'ru'
      };
      setTelegramUser(mockUser);
    }
  }, []);

  const showAlert = useCallback((message) => {
    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.showAlert(message);
      } catch (error) {
        console.warn('Telegram showAlert не поддерживается, используем alert:', error);
        alert(message);
      }
    } else {
      alert(message);
    }
  }, []);

  const showConfirm = useCallback((message, callback) => {
    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.showConfirm(message, callback);
      } catch (error) {
        console.warn('Telegram showConfirm не поддерживается, используем confirm:', error);
        const confirmed = confirm(message);
        callback(confirmed);
      }
    } else {
      const confirmed = confirm(message);
      callback(confirmed);
    }
  }, []);

  const showPopup = useCallback((params) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showPopup(params);
    }
  }, []);

  const expand = useCallback(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  const close = useCallback(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  }, []);

  return {
    telegramUser,
    initTelegram,
    showAlert,
    showConfirm,
    showPopup,
    expand,
    close
  };
}; 