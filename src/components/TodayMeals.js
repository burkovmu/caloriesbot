import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Trash2 } from 'lucide-react';

const TodayMeals = () => {
  const { state, supabaseActions } = useApp();
  const [todayMeals, setTodayMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Загружаем сегодняшние продукты
  const loadTodayMeals = async () => {
    if (!state.supabaseUser) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabaseActions.getFoodEntries(state.supabaseUser.id, today);
      
      if (error) {
        console.warn('Ошибка загрузки сегодняшних продуктов:', error);
      } else {
        setTodayMeals(data || []);
      }
    } catch (err) {
      console.error('Ошибка загрузки сегодняшних продуктов:', err);
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
        await loadTodayMeals();
        // Синхронизируем данные
        await state.actions.syncFromSupabase();
      }
    } catch (err) {
      console.error('Ошибка удаления продукта:', err);
    }
  };

  // Загружаем данные при монтировании и при изменении пользователя
  useEffect(() => {
    loadTodayMeals();
  }, [state.supabaseUser]);

  // Обновляем данные при фокусе на окне
  useEffect(() => {
    const handleFocus = () => {
      loadTodayMeals();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [state.supabaseUser]);

  if (!state.supabaseUser) {
    return null;
  }

  return (
    <div className="card">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <h3 className="meals-title" style={{ margin: 0 }}>
          Сегодня съели
        </h3>
        <button
          onClick={loadTodayMeals}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <Clock className="w-4 h-4" />
          Обновить
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          Загрузка...
        </div>
      ) : todayMeals.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#6b7280',
          background: '#f9fafb',
          borderRadius: '0.5rem'
        }}>
          <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Сегодня еще ничего не добавлено
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
            Добавьте продукты на странице "Добавить еду"
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {todayMeals.map((meal) => (
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
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  display: 'flex',
                  gap: '1rem'
                }}>
                  <span>{meal.calories} ккал</span>
                  <span>Белки: {Math.round(meal.proteins)}g</span>
                  <span>Жиры: {Math.round(meal.fats)}g</span>
                  <span>Углеводы: {Math.round(meal.carbs)}g</span>
                </div>
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
          
          <div style={{ 
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#f0f9ff',
            borderRadius: '0.5rem',
            border: '1px solid #bae6fd'
          }}>
            <div style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#0369a1',
              marginBottom: '0.25rem'
            }}>
              Итого за сегодня:
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#0c4a6e',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0)} ккал</span>
              <span>Белки: {Math.round(todayMeals.reduce((sum, meal) => sum + (parseFloat(meal.proteins) || 0), 0))}g</span>
              <span>Жиры: {Math.round(todayMeals.reduce((sum, meal) => sum + (parseFloat(meal.fats) || 0), 0))}g</span>
              <span>Углеводы: {Math.round(todayMeals.reduce((sum, meal) => sum + (parseFloat(meal.carbs) || 0), 0))}g</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayMeals; 