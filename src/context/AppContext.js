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
  daysWithEntries: 0,
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
        user: { ...(state.user || {}), ...(action.payload || {}) }
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
    case 'SET_DAYS_WITH_ENTRIES':
      return {
        ...state,
        daysWithEntries: action.payload
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children, telegramUser: propTelegramUser }) => {
  // Инициализация состояния из localStorage (если есть)
  const initializeState = () => {
    try {
      const saved = localStorage.getItem('calorieTrackerState');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialState,
          ...parsed,
          user: parsed.user ?? initialState.user,
          dailyStats: { ...initialState.dailyStats, ...(parsed.dailyStats || {}) },
          settings: { ...initialState.settings, ...(parsed.settings || {}) }
        };
      }
    } catch (e) {
      // игнорируем ошибки парсинга
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(appReducer, initialState, initializeState);
  const { getUserOrCreate, addFoodEntry, getFoodEntries, getUserStats, addAIRequest, deleteFoodEntry, getDaysWithEntries, updateUserSettings, loading: supabaseLoading, error: supabaseError } = useSupabase();
  const { telegramUser: hookTelegramUser } = useTelegram();
  
  // Используем telegramUser из пропов или из хука
  const telegramUser = propTelegramUser || hookTelegramUser;

  const actions = {
    setUser: (userData) => dispatch({ type: 'SET_USER', payload: userData }),
    setSupabaseUser: (userData) => dispatch({ type: 'SET_SUPABASE_USER', payload: userData }),
    addMeal: async (meal) => {
      dispatch({ type: 'ADD_MEAL', payload: meal });
      
      // Если есть пользователь Supabase, обновляем количество дней
      if (state.supabaseUser) {
        try {
          const { data, error } = await getDaysWithEntries(state.supabaseUser.id);
          
          if (!error && data !== undefined) {
            actions.setDaysWithEntries(data);
          }
        } catch (err) {
          console.error('Ошибка обновления количества дней:', err);
        }
      }
    },
    updateDailyStats: (stats) => dispatch({ type: 'UPDATE_DAILY_STATS', payload: stats }),
    setSettings: (settings) => dispatch({ type: 'SET_SETTINGS', payload: settings }),
    setDaysWithEntries: (days) => dispatch({ type: 'SET_DAYS_WITH_ENTRIES', payload: days }),
    resetDailyStats: () => dispatch({ type: 'RESET_DAILY_STATS' }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    saveUserSettings: async (settings) => {
      if (!state.supabaseUser) return;
      
      try {
        const { error } = await updateUserSettings(state.supabaseUser.id, settings);
        
        if (error) {
          console.warn('Ошибка сохранения настроек:', error);
          return;
        }
        
        // Обновляем локальное состояние
        actions.setSettings(settings);
        
        console.log('✅ Настройки сохранены в Supabase:', settings);
      } catch (err) {
        console.error('Ошибка сохранения настроек:', err);
      }
    },
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
    },

    addAIRequest: async (requestData) => {
      try {
        const { data, error } = await addAIRequest(requestData.user_id, requestData.request_text, requestData.response_text);
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Ошибка сохранения AI запроса:', error);
        return { data: null, error };
      }
    },

    loadDaysWithEntries: async () => {
      if (!state.supabaseUser) {
        console.warn('❌ Нет пользователя Supabase для загрузки дней');
        return;
      }
      
      try {
        console.log('🔄 Загружаем количество дней для пользователя:', state.supabaseUser.id);
        const { data, error } = await getDaysWithEntries(state.supabaseUser.id);
        
        if (error) {
          console.warn('❌ Ошибка загрузки количества дней:', error);
          return;
        }
        
        console.log('📊 Получено количество дней:', data);
        actions.setDaysWithEntries(data);
        console.log('✅ Количество дней с записями загружено:', data);
        
      } catch (err) {
        console.error('❌ Ошибка загрузки количества дней:', err);
      }
    },

    addFoodEntry: async (userId, foodData) => {
      if (!state.supabaseUser) return { error: 'Пользователь не найден' };
      
      try {
        const { data, error } = await addFoodEntry(userId, foodData);
        
        if (error) {
          console.warn('Ошибка добавления записи:', error);
          return { error };
        }
        
        // Обновляем количество дней после добавления записи
        await actions.loadDaysWithEntries();
        
        return { data, error: null };
      } catch (err) {
        console.error('Ошибка добавления записи:', err);
        return { error: err.message };
      }
    },

    deleteFoodEntry: async (entryId) => {
      if (!state.supabaseUser) return { error: 'Пользователь не найден' };
      
      try {
        const { error } = await deleteFoodEntry(entryId);
        
        if (error) {
          console.warn('Ошибка удаления записи:', error);
          return { error };
        }
        
        // Обновляем количество дней после удаления записи
        await actions.loadDaysWithEntries();
        
        return { error: null };
      } catch (err) {
        console.error('Ошибка удаления записи:', err);
        return { error: err.message };
      }
    },

    getFoodEntries: async (userId, date = null) => {
      if (!state.supabaseUser) return { error: 'Пользователь не найден' };
      
      try {
        const { data, error } = await getFoodEntries(userId, date);
        
        if (error) {
          console.warn('Ошибка получения записей:', error);
          return { error };
        }
        
        return { data, error: null };
      } catch (err) {
        console.error('Ошибка получения записей:', err);
        return { error: err.message };
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
                
                // Загружаем настройки пользователя
                if (data.settings) {
                  actions.setSettings(data.settings);
                }
                
                // Загружаем активность и цель из настроек (кросс-устройство)
                if (data.settings && data.settings.user) {
                  const activityLevel = data.settings.user.activityLevel;
                  const goal = data.settings.user.goal;
                  if (activityLevel || goal) {
                    actions.setUser({
                      ...(activityLevel ? { activityLevel } : {}),
                      ...(goal ? { goal } : {})
                    });
                  }
                }
                
                // Загружаем цели пользователя
                if (data.target_calories) {
                  actions.updateDailyStats({
                    targetCalories: data.target_calories,
                    targetProtein: data.target_protein || 150,
                    targetFat: data.target_fat || 65,
                    targetCarbs: data.target_carbs || 250
                  });
                }
                
                // Загружаем личные данные пользователя
                if (data.age !== undefined || data.height !== undefined || data.weight !== undefined || data.name) {
                  const userData = {
                    ...state.user,
                    name: data.name || telegramUser.first_name || telegramUser.username || 'Пользователь',
                    age: data.age || 0,
                    height: data.height || 0,
                    weight: data.weight || 0,
                    targetWeight: data.target_weight || 0
                  };
                  actions.setUser(userData);
                }
                
                // Синхронизируем данные из Supabase после создания пользователя
                setTimeout(async () => {
                  try {
                    console.log('🔄 Синхронизация данных из Supabase...');
                    await actions.syncFromSupabase();
                    
                    console.log('🔄 Загрузка количества дней с записями...');
                    await actions.loadDaysWithEntries();
                    
                    console.log('✅ Инициализация завершена');
                  } catch (err) {
                    console.error('❌ Ошибка при инициализации:', err);
                  }
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

  // Загружаем количество дней при изменении пользователя Supabase
  useEffect(() => {
    if (state.supabaseUser && state.supabaseUser.id) {
      console.log('🔄 Пользователь Supabase изменился, загружаем количество дней...');
      actions.loadDaysWithEntries();
    }
  }, [state.supabaseUser?.id]);

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