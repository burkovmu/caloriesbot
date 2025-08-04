import { useCallback } from 'react';

export const useTelegram = () => {
  const initTelegram = useCallback(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Initialize the Telegram Web App
      tg.ready();
      
      // Set the header color to match our theme
      tg.setHeaderColor('#667eea');
      
      // Enable closing confirmation
      tg.enableClosingConfirmation();
      
      // Set the main button if needed
      // tg.MainButton.setText('Сохранить');
      // tg.MainButton.show();
    }
  }, []);

  const showAlert = useCallback((message) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      alert(message);
    }
  }, []);

  const showConfirm = useCallback((message, callback) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showConfirm(message, callback);
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
    initTelegram,
    showAlert,
    showConfirm,
    showPopup,
    expand,
    close
  };
}; 