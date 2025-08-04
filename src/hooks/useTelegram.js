import { useCallback, useState, useEffect } from 'react';

export const useTelegram = () => {
  const [telegramUser, setTelegramUser] = useState(null);

  // Функция для получения пользователя из URL параметров
  const getUserFromURL = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const userParam = urlParams.get('user');
      if (userParam) {
        return JSON.parse(decodeURIComponent(userParam));
      }
    } catch (error) {
      console.warn('Ошибка парсинга пользователя из URL:', error);
    }
    return null;
  };

  const initTelegram = useCallback(() => {
    console.log('Инициализация Telegram...');
    console.log('window.Telegram:', window.Telegram);
    console.log('window.Telegram?.WebApp:', window.Telegram?.WebApp);
    
    // Отключаем уведомление о несохраненных изменениях
    window.onbeforeunload = null;
    
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
        // Try to get user from initData
        const initData = tg.initData;
        if (initData) {
          try {
            // Parse initData to get user
            const urlParams = new URLSearchParams(initData);
            const userParam = urlParams.get('user');
            if (userParam) {
              const parsedUser = JSON.parse(decodeURIComponent(userParam));
              console.log('Пользователь из initData:', parsedUser);
              setTelegramUser(parsedUser);
            } else {
              // Try to get from URL parameters
              const urlUser = getUserFromURL();
              if (urlUser) {
                console.log('Пользователь из URL:', urlUser);
                setTelegramUser(urlUser);
              } else {
                // Fallback for development
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
            }
          } catch (error) {
            console.warn('Ошибка парсинга initData:', error);
            // Try to get from URL parameters
            const urlUser = getUserFromURL();
            if (urlUser) {
              console.log('Пользователь из URL:', urlUser);
              setTelegramUser(urlUser);
            } else {
              // Fallback for development
              const mockUser = {
                id: 123456789,
                first_name: 'Тестовый',
                last_name: 'Пользователь',
                username: 'test_user',
                language_code: 'ru'
              };
              setTelegramUser(mockUser);
            }
          }
        } else {
          // Try to get from URL parameters
          const urlUser = getUserFromURL();
          if (urlUser) {
            console.log('Пользователь из URL:', urlUser);
            setTelegramUser(urlUser);
          } else {
            // Fallback for development
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
        }
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