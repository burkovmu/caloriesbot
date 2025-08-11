// Настройки для управления использованием AI

export const AI_SETTINGS = {
  // Модель OpenAI для использования
  OPENAI_MODEL: 'gpt-3.5-turbo',
  
  // Максимальное количество токенов
  MAX_TOKENS: 500,
  
  // Температура для генерации (0.1 = более предсказуемо, 0.9 = более креативно)
  TEMPERATURE: 0.3,
  
  // Лимит стоимости в день (в долларах)
  MAX_DAILY_COST: 2.0,
  
  // Максимальное количество запросов в день
  MAX_DAILY_REQUESTS: 100
};

// Функция для проверки лимитов
export const checkAILimits = () => {
  const today = new Date().toDateString();
  const dailyRequests = parseInt(localStorage.getItem(`gpt_requests_${today}`) || '0');
  const dailyCost = parseFloat(localStorage.getItem(`gpt_cost_${today}`) || '0');
  
  return {
    canUseGPT: dailyRequests < AI_SETTINGS.MAX_DAILY_REQUESTS && dailyCost < AI_SETTINGS.MAX_DAILY_COST,
    dailyRequests,
    dailyCost,
    remainingRequests: AI_SETTINGS.MAX_DAILY_REQUESTS - dailyRequests,
    remainingCost: AI_SETTINGS.MAX_DAILY_COST - dailyCost
  };
};

// Функция для обновления счетчиков использования
export const updateAIUsage = (tokensUsed, cost) => {
  const today = new Date().toDateString();
  
  // Обновляем количество запросов
  const currentRequests = parseInt(localStorage.getItem(`gpt_requests_${today}`) || '0');
  localStorage.setItem(`gpt_requests_${today}`, currentRequests + 1);
  
  // Обновляем стоимость
  const currentCost = parseFloat(localStorage.getItem(`gpt_cost_${today}`) || '0');
  localStorage.setItem(`gpt_cost_${today}`, currentCost + cost);
  
  // Проверяем лимиты
  const limits = checkAILimits();
  
  if (limits.dailyCost >= AI_SETTINGS.MAX_DAILY_COST) {
    console.warn('⚠️ Достигнут дневной лимит стоимости GPT-3.5');
  }
  
  if (limits.dailyRequests >= AI_SETTINGS.MAX_DAILY_REQUESTS) {
    console.warn('⚠️ Достигнут дневной лимит запросов к GPT-3.5');
  }
  
  return limits;
};

// Функция для сброса дневных счетчиков
export const resetDailyCounters = () => {
  const today = new Date().toDateString();
  localStorage.removeItem(`gpt_requests_${today}`);
  localStorage.removeItem(`gpt_cost_${today}`);
  console.log('✅ Счетчики использования GPT-3.5 сброшены');
};

// Функция для получения статистики использования
export const getAIUsageStats = () => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  
  return {
    today: {
      requests: parseInt(localStorage.getItem(`gpt_requests_${today}`) || '0'),
      cost: parseFloat(localStorage.getItem(`gpt_cost_${today}`) || '0')
    },
    yesterday: {
      requests: parseInt(localStorage.getItem(`gpt_requests_${yesterday}`) || '0'),
      cost: parseFloat(localStorage.getItem(`gpt_cost_${yesterday}`) || '0')
    },
    limits: AI_SETTINGS
  };
}; 