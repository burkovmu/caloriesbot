import { createClient } from '@supabase/supabase-js'

// Конфигурация Supabase из переменных окружения
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder_key'

if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.warn('Предупреждение: Не настроены переменные окружения Supabase. Используются placeholder значения.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Вспомогательные функции для работы с данными
export const supabaseHelpers = {
  // Получить пользователя по Telegram ID
  async getUserByTelegramId(telegramId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single()
    
    return { data, error }
  },

  // Создать или обновить пользователя
  async upsertUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'telegram_id' })
      .select()
      .single()
    
    return { data, error }
  },

  // Добавить запись о еде
  async addFoodEntry(foodData) {
    const { data, error } = await supabase
      .from('food_entries')
      .insert(foodData)
      .select()
      .single()
    
    return { data, error }
  },

  // Получить записи о еде пользователя
  async getFoodEntries(userId, date = null) {
    let query = supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (date) {
      query = query.eq('date', date)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  // Добавить запрос к AI
  async addAIRequest(requestData) {
    const { data, error } = await supabase
      .from('ai_requests')
      .insert(requestData)
      .select()
      .single()
    
    return { data, error }
  },

  // Получить статистику пользователя
  async getUserStats(userId, startDate, endDate) {
    const { data, error } = await supabase
      .from('food_entries')
      .select('calories, proteins, fats, carbs')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
    
    return { data, error }
  },

  // Получить количество дней с записями
  async getDaysWithEntries(userId) {
    const { data, error } = await supabase
      .from('food_entries')
      .select('date')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    
    if (error) {
      return { data: 0, error }
    }
    
    // Подсчитываем уникальные дни
    const uniqueDays = new Set(data.map(entry => entry.date))
    const daysCount = uniqueDays.size
    
    return { data: daysCount, error: null }
  }
} 