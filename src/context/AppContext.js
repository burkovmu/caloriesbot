import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { useTelegram } from '../hooks/useTelegram';

const AppContext = createContext();

const initialState = {
  user: null,
  supabaseUser: null,
  dailyStats: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    targetCalories: 2000,
    targetProtein: 150,
    targetFat: 65,
    targetCarbs: 250
  },
  meals: [],
  weeklyStats: [],
  settings: {
    notifications: true,
    darkMode: false,
    language: 'ru'
  },
  loading: false,
  error: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'SET_SUPABASE_USER':
      return {
        ...state,
        supabaseUser: action.payload
      };
    case 'ADD_MEAL':
      return {
        ...state,
        meals: [...state.meals, action.payload],
        dailyStats: {
          ...state.dailyStats,
          calories: state.dailyStats.calories + action.payload.nutrition.calories,
          protein: state.dailyStats.protein + action.payload.nutrition.protein,
          fat: state.dailyStats.fat + action.payload.nutrition.fat,
          carbs: state.dailyStats.carbs + action.payload.nutrition.carbs
        }
      };
    case 'UPDATE_DAILY_STATS':
      return {
        ...state,
        dailyStats: { ...state.dailyStats, ...action.payload }
      };
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'RESET_DAILY_STATS':
      return {
        ...state,
        dailyStats: {
          ...state.dailyStats,
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0
        }
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children, telegramUser: propTelegramUser }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { getUserOrCreate, addFoodEntry, getFoodEntries, getUserStats, addAIRequest, deleteFoodEntry, loading: supabaseLoading, error: supabaseError } = useSupabase();
  const { telegramUser: hookTelegramUser } = useTelegram();
  
  // Используем telegramUser из пропов или из хука
  const telegramUser = propTelegramUser || hookTelegramUser;

  const actions = {
    setUser: (userData) => dispatch({ type: 'SET_USER', payload: userData }),
    setSupabaseUser: (userData) => dispatch({ type: 'SET_SUPABASE_USER', payload: userData }),
    addMeal: (meal) => dispatch({ type: 'ADD_MEAL', payload: meal }),
    updateDailyStats: (stats) => dispatch({ type: 'UPDATE_DAILY_STATS', payload: stats }),
    setSettings: (settings) => dispatch({ type: 'SET_SETTINGS', payload: settings }),
    resetDailyStats: () => dispatch({ type: 'RESET_DAILY_STATS' }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    syncFromSupabase: async () => {
      if (!state.supabaseUser) return;
      
      try {
        actions.setLoading(true);
        
        // Получаем данные за сегодня
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await getFoodEntries(state.supabaseUser.id, today);
        
        if (error) {
          console.warn('Ошибка синхронизации:', error);
          return;
        }
        
        // Вычисляем общую статистику
        const totalCalories = data.reduce((sum, item) => sum + (parseInt(item.calories) || 0), 0);
        const totalProtein = data.reduce((sum, item) => sum + (parseFloat(item.proteins) || 0), 0);
        const totalFat = data.reduce((sum, item) => sum + (parseFloat(item.fats) || 0), 0);
        const totalCarbs = data.reduce((sum, item) => sum + (parseFloat(item.carbs) || 0), 0);
        
        // Обновляем локальное состояние
        actions.updateDailyStats({
          calories: totalCalories,
          protein: totalProtein,
          fat: totalFat,
          carbs: totalCarbs
        });
        
        console.log('✅ Данные синхронизированы из Supabase:', {
          calories: totalCalories,
          protein: totalProtein,
          fat: totalFat,
          carbs: totalCarbs
        });
        
      } catch (err) {
        console.error('Ошибка синхронизации:', err);
      } finally {
        actions.setLoading(false);
      }
    }
  };

  // Инициализация пользователя Supabase при загрузке
  useEffect(() => {
    const initializeUser = async () => {
      // console.log('AppContext: Инициализация пользователя');
      
      if (telegramUser) {
        try {
          actions.setLoading(true);
          
          // Временно используем данные Telegram без Supabase
          const userData = {
            name: telegramUser.first_name || telegramUser.username || 'Пользователь',
            telegramId: telegramUser.id
          };
          // console.log('AppContext: Устанавливаем пользователя:', userData);
          actions.setUser(userData);
          
          // Пытаемся подключиться к Supabase только если настроены переменные
          if (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_URL !== 'your_supabase_project_url') {
            // console.log('AppContext: Подключаемся к Supabase...');
            try {
              const { data, error } = await getUserOrCreate(telegramUser);
              
              if (error) {
                console.warn('Ошибка Supabase:', error.message);
                return;
              }
              
              if (data) {
                // console.log('AppContext: Supabase пользователь создан:', data);
                actions.setSupabaseUser(data);
                
                // Синхронизируем данные из Supabase после создания пользователя
                setTimeout(async () => {
                  await actions.syncFromSupabase();
                }, 1000);
              }
            } catch (err) {
              console.warn('Ошибка подключения к Supabase:', err.message);
            }
                      } else {
              // console.log('AppContext: Supabase не настроен, пропускаем');
            }
        } catch (err) {
          console.warn('Ошибка инициализации:', err.message);
        } finally {
          actions.setLoading(false);
        }
              } else {
          // console.log('AppContext: Пользователь уже инициализирован или telegramUser отсутствует');
        }
    };

    initializeUser();
  }, [telegramUser]);

  // Обновляем состояние загрузки и ошибок из Supabase
  useEffect(() => {
    actions.setLoading(supabaseLoading);
  }, [supabaseLoading]);

  useEffect(() => {
    if (supabaseError) {
      actions.setError(supabaseError);
    }
  }, [supabaseError]);

  // Синхронизируем данные при изменении supabaseUser
  useEffect(() => {
    if (state.supabaseUser) {
      // Синхронизируем данные из Supabase
      actions.syncFromSupabase();
    }
  }, [state.supabaseUser]);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('calorieTrackerState', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ 
      state, 
      actions,
      telegramUser,
      supabaseActions: {
        addFoodEntry,
        getFoodEntries,
        getUserStats,
        addAIRequest,
        deleteFoodEntry
      }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 