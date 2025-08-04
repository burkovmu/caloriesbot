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
        return { data: existingUser, error: null }
      }
      
      // Создаем нового пользователя
      const newUser = {
        telegram_id: telegramUser.id,
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name
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
        date: foodData.date || new Date().toISOString().split('T')[0]
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

  // Обновить настройки пользователя
  const updateUserSettings = async (userId, settings) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          settings: settings,
          updated_at: new Date().toISOString()
        })
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
    updateUserSettings
  }
} 