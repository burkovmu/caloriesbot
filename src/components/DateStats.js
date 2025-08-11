import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const DateStats = () => {
  const { state, supabaseActions } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateMeals, setDateMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateStats, setDateStats] = useState({
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0
  });

  // Загружаем данные за выбранную дату
  const loadDateMeals = async (date) => {
    if (!state.supabaseUser) return;

    setLoading(true);
    try {
      const { data, error } = await supabaseActions.getFoodEntries(state.supabaseUser.id, date);
      
      if (error) {
        console.warn('Ошибка загрузки данных за дату:', error);
      } else {
        setDateMeals(data || []);
        
        // Вычисляем статистику
        const stats = data?.reduce((acc, meal) => {
          acc.calories += meal.calories || 0;
          acc.proteins += parseFloat(meal.proteins) || 0;
          acc.fats += parseFloat(meal.fats) || 0;
          acc.carbs += parseFloat(meal.carbs) || 0;
          return acc;
        }, { calories: 0, proteins: 0, fats: 0, carbs: 0 }) || { calories: 0, proteins: 0, fats: 0, carbs: 0 };
        
        setDateStats(stats);
      }
    } catch (err) {
      console.error('Ошибка загрузки данных за дату:', err);
    } finally {
      setLoading(false);
    }
  };

  // Удаляем продукт
  const deleteMeal = async (mealId) => {
    if (!state.supabaseUser) return;

    try {
      const { error } = await supabaseActions.deleteFoodEntry(mealId);
      
      if (error) {
        console.warn('Ошибка удаления продукта:', error);
      } else {
        // Обновляем список после удаления
        await loadDateMeals(selectedDate);
        // Синхронизируем данные
        await state.actions.syncFromSupabase();
      }
    } catch (err) {
      console.error('Ошибка удаления продукта:', err);
    }
  };

  // Изменение даты
  const changeDate = (direction) => {
    const currentDate = new Date(selectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const newDate = currentDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
    loadDateMeals(newDate);
  };

  // Форматирование даты для отображения
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  };

  // Загружаем данные при изменении даты или пользователя
  useEffect(() => {
    loadDateMeals(selectedDate);
  }, [selectedDate, state.supabaseUser]);

  if (!state.supabaseUser) {
    return null;
  }

  return (
    <div className="card">
      {/* Заголовок с навигацией по датам */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <button
          onClick={() => changeDate('prev')}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem'
          }}>
            <Calendar className="w-4 h-4 text-gray-500" />
            <h3 className="meals-title" style={{ margin: 0 }}>
              {formatDate(selectedDate)}
            </h3>
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280',
            textTransform: 'capitalize'
          }}>
            {new Date(selectedDate).toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
        
        <button
          onClick={() => changeDate('next')}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Статистика за день */}
      <div style={{ 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderRadius: '0.75rem',
        padding: '1rem',
        marginBottom: '1.5rem',
        border: '1px solid #bae6fd'
      }}>
        <div style={{ 
          fontSize: '0.875rem', 
          fontWeight: '600', 
          color: '#0369a1',
          marginBottom: '0.75rem'
        }}>
          Итого за {formatDate(selectedDate).toLowerCase()}:
        </div>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: '0.25rem'
            }}>
              {Math.round(dateStats.calories)}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280' 
            }}>
              ккал
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: '0.25rem'
            }}>
              {Math.round(dateStats.proteins)}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280' 
            }}>
              белков (г)
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: '0.25rem'
            }}>
              {Math.round(dateStats.fats)}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280' 
            }}>
              жиров (г)
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: '0.25rem'
            }}>
              {Math.round(dateStats.carbs)}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280' 
            }}>
              углеводов (г)
            </div>
          </div>
        </div>
      </div>

      {/* Список продуктов */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          Загрузка...
        </div>
      ) : dateMeals.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#6b7280',
          background: '#f9fafb',
          borderRadius: '0.5rem'
        }}>
          <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            В этот день ничего не добавлено
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
            Добавьте продукты на странице "Добавить еду"
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {dateMeals.map((meal) => (
            <div
              key={meal.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '0.25rem',
                  fontSize: '0.875rem'
                }}>
                  {meal.food_name}
                  {meal.original_description && meal.original_description !== meal.food_name && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      fontWeight: 'normal',
                      marginLeft: '0.5rem',
                      fontStyle: 'italic'
                    }}>
                      (было: {meal.original_description})
                    </span>
                  )}
                </div>
                
                {/* Рекомендации от GPT */}
                {meal.recommendations && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#059669',
                    background: '#f0fdf4',
                    padding: '0.375rem',
                    borderRadius: '0.25rem',
                    marginBottom: '0.5rem',
                    border: '1px solid #bbf7d0',
                    fontStyle: 'italic'
                  }}>
                    💡 {meal.recommendations}
                  </div>
                )}
                
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <span>{meal.calories} ккал</span>
                  <span>Белки: {Math.round(meal.proteins)}g</span>
                  <span>Жиры: {Math.round(meal.fats)}g</span>
                  <span>Углеводы: {Math.round(meal.carbs)}g</span>
                </div>
                
                {/* Дополнительные детали анализа */}
                {meal.analysis_details && meal.analysis_details.originalProduct && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#7c3aed',
                    background: '#f3f4f6',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    marginTop: '0.25rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    🔍 Анализ: {meal.analysis_details.originalProduct} → {meal.food_name}
                  </div>
                )}
                
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#9ca3af',
                  marginTop: '0.25rem'
                }}>
                  {new Date(meal.created_at).toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              
              <button
                onClick={() => deleteMeal(meal.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  transition: 'all 0.2s'
                }}
                title="Удалить продукт"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateStats; 