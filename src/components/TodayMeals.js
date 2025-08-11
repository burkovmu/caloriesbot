import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Trash2, Utensils, RefreshCw, Plus, TrendingUp } from 'lucide-react';

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

  const totalCalories = todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProteins = todayMeals.reduce((sum, meal) => sum + (parseFloat(meal.proteins) || 0), 0);
  const totalFats = todayMeals.reduce((sum, meal) => sum + (parseFloat(meal.fats) || 0), 0);
  const totalCarbs = todayMeals.reduce((sum, meal) => sum + (parseFloat(meal.carbs) || 0), 0);

  return (
    <>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        marginTop: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
          }}>
            <Utensils style={{
              width: '1rem',
              height: '1rem',
              color: 'white'
            }} />
          </div>
          <div>
            <h3 style={{ 
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Сегодня съели
            </h3>
            <p style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.75rem',
              color: '#9ca3af',
              fontWeight: '500'
            }}>
              {todayMeals.length} {todayMeals.length === 1 ? 'продукт' : todayMeals.length < 5 ? 'продукта' : 'продуктов'}
            </p>
          </div>
        </div>
        
        <button
          onClick={loadTodayMeals}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.2)';
          }}
        >
          {loading ? (
            <RefreshCw style={{ width: '1rem', height: '1rem' }} className="animate-spin" />
          ) : (
            <Clock style={{ width: '1rem', height: '1rem' }} />
          )}
          {loading ? 'Обновление...' : 'Обновить'}
        </button>
      </div>

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem', 
          color: '#6b7280',
          background: '#ffffff',
          borderRadius: '0.5rem',
          border: '1px solid #f3f4f6',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #667eea',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
            Загрузка данных...
          </div>
        </div>
      ) : todayMeals.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem', 
          color: '#6b7280',
          background: '#ffffff',
          borderRadius: '0.5rem',
          border: '1px solid #f3f4f6',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            background: '#f3f4f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            border: '1px solid #e5e7eb'
          }}>
            <Plus style={{
              width: '1.5rem',
              height: '1.5rem',
              color: '#9ca3af'
            }} />
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600', 
            marginBottom: '0.5rem',
            color: '#374151'
          }}>
            Сегодня еще ничего не добавлено
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            opacity: 0.8,
            lineHeight: '1.5'
          }}>
            Добавьте продукты на странице "Добавить еду"
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem'
        }}>
          {todayMeals.map((meal, index) => (
            <div
              key={meal.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: '#ffffff',
                border: '1px solid #f3f4f6',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#f3f4f6';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '0.5rem',
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
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
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
                  marginBottom: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontWeight: '500'
                  }}>
                    {meal.calories} ккал
                  </span>
                  <span style={{
                    background: '#eff6ff',
                    color: '#2563eb',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontWeight: '500'
                  }}>
                    Б: {Math.round(meal.proteins)}g
                  </span>
                  <span style={{
                    background: '#fffbeb',
                    color: '#d97706',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontWeight: '500'
                  }}>
                    Ж: {Math.round(meal.fats)}g
                  </span>
                  <span style={{
                    background: '#f0fdf4',
                    color: '#059669',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontWeight: '500'
                  }}>
                    У: {Math.round(meal.carbs)}g
                  </span>
                </div>
                
                {/* Дополнительные детали анализа */}
                {meal.analysis_details && meal.analysis_details.originalProduct && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#7c3aed',
                    background: '#f3f4f6',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    marginBottom: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    🔍 Анализ: {meal.analysis_details.originalProduct} → {meal.food_name}
                  </div>
                )}
                
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <Clock style={{ width: '0.75rem', height: '0.75rem' }} />
                  {new Date(meal.created_at).toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              
              <button
                onClick={() => deleteMeal(meal.id)}
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s ease',
                  marginLeft: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.borderColor = '#fca5a5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                  e.currentTarget.style.borderColor = '#fecaca';
                }}
                title="Удалить продукт"
              >
                <Trash2 style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
          ))}
          
          {/* Summary Section */}
          <div style={{ 
            marginTop: '1rem',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.75rem'
            }}>
              Итого за сегодня:
            </div>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '0.75rem'
            }}>
              <div style={{
                textAlign: 'center',
                padding: '0.75rem',
                background: '#ffffff',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#dc2626',
                  marginBottom: '0.25rem'
                }}>
                  {totalCalories}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  ккал
                </div>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '0.75rem',
                background: '#ffffff',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#2563eb',
                  marginBottom: '0.25rem'
                }}>
                  {Math.round(totalProteins)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Белки
                </div>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '0.75rem',
                background: '#ffffff',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#d97706',
                  marginBottom: '0.25rem'
                }}>
                  {Math.round(totalFats)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Жиры
                </div>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '0.75rem',
                background: '#ffffff',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#059669',
                  marginBottom: '0.25rem'
                }}>
                  {Math.round(totalCarbs)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Углеводы
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodayMeals; 