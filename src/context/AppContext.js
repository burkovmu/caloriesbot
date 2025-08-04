import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: {
    name: 'Пользователь',
    age: 25,
    height: 175,
    weight: 70,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    targetWeight: 65,
    preferences: {
      favoriteFoods: '',
      dislikedFoods: '',
      allergies: '',
      dietaryRestrictions: ''
    }
  },
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
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
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
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setUser: (userData) => dispatch({ type: 'SET_USER', payload: userData }),
    addMeal: (meal) => dispatch({ type: 'ADD_MEAL', payload: meal }),
    updateDailyStats: (stats) => dispatch({ type: 'UPDATE_DAILY_STATS', payload: stats }),
    setSettings: (settings) => dispatch({ type: 'SET_SETTINGS', payload: settings }),
    resetDailyStats: () => dispatch({ type: 'RESET_DAILY_STATS' })
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('calorieTrackerState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Merge with current state, keeping defaults for new fields
      Object.keys(parsedState).forEach(key => {
        if (state[key]) {
          dispatch({ type: `SET_${key.toUpperCase()}`, payload: parsedState[key] });
        }
      });
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('calorieTrackerState', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, actions }}>
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