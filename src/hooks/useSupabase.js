import { useState, useEffect } from 'react'
import { supabase, supabaseHelpers } from '../config/supabase'

export const useSupabase = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Получить или создать пользователя по Telegram ID
  const getUserOrCreate = async (telegramUser) => {
    setLoading(true)
    setError(null)
    
    try {
      // Проверяем, существует ли пользователь
      const { data: existingUser, error: fetchError } = await supabaseHelpers.getUserByTelegramId(telegramUser.id)
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }
      
      if (existingUser) {
        // Добавляем дефолтные настройки, если их нет
        const userWithDefaults = {
          ...existingUser,
          name: existingUser.name || 'Пользователь',
          settings: existingUser.settings || {},
          target_calories: existingUser.target_calories || 2000,
          target_protein: existingUser.target_protein || 150,
          target_fat: existingUser.target_fat || 65,
          target_carbs: existingUser.target_carbs || 250,
          age: existingUser.age || 0,
          height: existingUser.height || 0,
          weight: existingUser.weight || 0,
          target_weight: existingUser.target_weight || 0
        }
        return { data: userWithDefaults, error: null }
      }
      
      // Создаем нового пользователя
      const newUser = {
        telegram_id: telegramUser.id,
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        name: telegramUser.first_name || telegramUser.username || 'Пользователь'
      }
      
      const { data, error } = await supabaseHelpers.upsertUser(newUser)
      
      if (error) throw error
      
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Добавить запись о еде
  const addFoodEntry = async (userId, foodData) => {
    setLoading(true)
    setError(null)
    
    try {
      const entry = {
        user_id: userId,
        food_name: foodData.name,
        calories: foodData.calories || 0,
        proteins: foodData.proteins || 0,
        fats: foodData.fats || 0,
        carbs: foodData.carbs || 0,
        date: foodData.date || new Date().toISOString().split('T')[0],
        recommendations: foodData.recommendations || '',
        analysis_details: foodData.analysisDetails || {},
        original_description: foodData.originalDescription || foodData.name
      }
      
      const { data, error } = await supabaseHelpers.addFoodEntry(entry)
      
      if (error) throw error
      
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Получить записи о еде пользователя
  const getFoodEntries = async (userId, date = null) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabaseHelpers.getFoodEntries(userId, date)
      
      if (error) throw error
      
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Получить статистику пользователя
  const getUserStats = async (userId, startDate, endDate) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabaseHelpers.getUserStats(userId, startDate, endDate)
      
      if (error) throw error
      
      // Вычисляем общие значения
      const totals = data.reduce((acc, entry) => {
        acc.calories += entry.calories || 0
        acc.proteins += parseFloat(entry.proteins) || 0
        acc.fats += parseFloat(entry.fats) || 0
        acc.carbs += parseFloat(entry.carbs) || 0
        return acc
      }, { calories: 0, proteins: 0, fats: 0, carbs: 0 })
      
      return { data: totals, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Добавить AI запрос
  const addAIRequest = async (userId, requestText, responseText) => {
    setLoading(true)
    setError(null)
    
    try {
      const request = {
        user_id: userId,
        request_text: requestText,
        response_text: responseText
      }
      
      const { data, error } = await supabaseHelpers.addAIRequest(request)
      
      if (error) throw error
      
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Удалить запись о еде
  const deleteFoodEntry = async (entryId) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', entryId)
      
      if (error) throw error
      
      return { error: null }
    } catch (err) {
      setError(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  // Получить количество дней с записями
  const getDaysWithEntries = async (userId) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔄 useSupabase: Загружаем дни для пользователя:', userId);
      const { data, error } = await supabaseHelpers.getDaysWithEntries(userId)
      
      if (error) {
        console.error('❌ useSupabase: Ошибка получения дней:', error);
        throw error
      }
      
      console.log('📊 useSupabase: Получено дней:', data);
      return { data, error: null }
    } catch (err) {
      console.error('❌ useSupabase: Ошибка:', err);
      setError(err.message)
      return { data: 0, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Обновить настройки пользователя
  const updateUserSettings = async (userId, settings) => {
    setLoading(true)
    setError(null)
    
    try {
      // Подготавливаем данные для обновления
      const updateData = {
        settings: settings,
        updated_at: new Date().toISOString()
      }
      
      // Если есть данные о целях, добавляем их
      if (settings.dailyStats) {
        updateData.target_calories = settings.dailyStats.targetCalories || 2000
        updateData.target_protein = settings.dailyStats.targetProtein || 150
        updateData.target_fat = settings.dailyStats.targetFat || 65
        updateData.target_carbs = settings.dailyStats.targetCarbs || 250
      }
      
      // Если есть личные данные пользователя, добавляем их
      if (settings.user) {
        updateData.age = settings.user.age || 0
        updateData.height = settings.user.height || 0
        updateData.weight = settings.user.weight || 0
        updateData.target_weight = settings.user.targetWeight || 0
        updateData.name = settings.user.name || 'Пользователь'
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
      
      if (error) throw error
      
      return { data: data?.[0], error: null }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getUserOrCreate,
    addFoodEntry,
    getFoodEntries,
    getUserStats,
    addAIRequest,
    deleteFoodEntry,
    getDaysWithEntries,
    updateUserSettings
  }
} 