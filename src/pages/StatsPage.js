import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Target, Flame, Dumbbell, Droplets, Wheat, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

const StatsPage = () => {
  const { state, supabaseActions } = useApp();
  const [supabaseStats, setSupabaseStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const getProgressPercentage = () => {
    return Math.min((state.dailyStats.calories / state.dailyStats.targetCalories) * 100, 100);
  };

  const getMacroPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  // Загрузка статистики из Supabase
  const loadSupabaseStats = async () => {
    if (!state.supabaseUser) return;

    setLoading(true);
    try {
      // Получаем статистику за последние 7 дней
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const { data, error } = await supabaseActions.getUserStats(state.supabaseUser.id, startDate, endDate);
      
      if (error) {
        console.warn('Ошибка загрузки статистики:', error);
      } else {
        setSupabaseStats(data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем статистику при монтировании компонента и при изменении пользователя
  useEffect(() => {
    loadSupabaseStats();
  }, [state.supabaseUser]);

  // Загружаем статистику при каждом открытии страницы
  useEffect(() => {
    const handleFocus = () => {
      if (state.supabaseUser) {
        loadSupabaseStats();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [state.supabaseUser]);

  const weeklyData = [
    { day: 'Пн', calories: 1850, protein: 120, fat: 65, carbs: 200 },
    { day: 'Вт', calories: 2100, protein: 140, fat: 70, carbs: 220 },
    { day: 'Ср', calories: 1950, protein: 130, fat: 68, carbs: 210 },
    { day: 'Чт', calories: 2200, protein: 150, fat: 75, carbs: 230 },
    { day: 'Пт', calories: 1800, protein: 125, fat: 60, carbs: 190 },
    { day: 'Сб', calories: 2400, protein: 160, fat: 80, carbs: 250 },
    { day: 'Вс', calories: 2000, protein: 135, fat: 70, carbs: 215 }
  ];

  const quickStats = [
    {
      icon: Flame,
      label: 'Средние калории',
      value: supabaseStats ? Math.round(supabaseStats.calories / 7) : '2050',
      unit: 'ккал/день',
      color: '#f59e0b',
      trend: '+5%'
    },
    {
      icon: Target,
      label: 'Достижение целей',
      value: supabaseStats ? Math.round((supabaseStats.calories / (state.dailyStats.targetCalories * 7)) * 100) : '85',
      unit: '% эффективность',
      color: '#10b981',
      trend: '+2%'
    },
    {
      icon: Calendar,
      label: 'Дней подряд',
      value: '12',
      unit: 'дней',
      color: '#3b82f6',
      trend: '+3'
    },
    {
      icon: TrendingUp,
      label: 'Прогресс веса',
      value: '-2.5',
      unit: 'кг за месяц',
      color: '#8b5cf6',
      trend: '📉'
    }
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Отличная неделя!',
      description: 'Вы достигли своих целей по белкам на 95% этой недели.',
      icon: '🎉'
    },
    {
      type: 'warning',
      title: 'Можно улучшить',
      description: 'Попробуйте добавить больше овощей в рацион для лучшего баланса.',
      icon: '🥬'
    },
    {
      type: 'info',
      title: 'Персональный совет',
      description: 'Ваш метаболизм лучше всего работает с приемом пищи в 8:00, 13:00 и 19:00.',
      icon: '⏰'
    }
  ];

  return (
    <div>
      {/* Beautiful Header */}
      <section style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "1.5rem",
        padding: "2rem",
        marginBottom: "1.5rem",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)"
      }}>
        {/* Background Pattern */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-20%",
          width: "200px",
          height: "200px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-30%",
          left: "-10%",
          width: "150px",
          height: "150px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite reverse"
        }} />
        
        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          {/* Icon */}
          <div style={{
            width: "4rem",
            height: "4rem",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255, 255, 255, 0.3)"
          }}>
            <BarChart3 className="w-8 h-8 text-white" style={{ animation: "pulse 2s infinite" }} />
          </div>
          
          {/* Title */}
          <h1 style={{
            fontSize: "1.75rem",
            fontWeight: "bold",
            color: "white",
            marginBottom: "0.5rem",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
          }}>
            Статистика
          </h1>
          
          {/* Subtitle */}
          <p style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "1rem",
            lineHeight: "1.5",
            marginBottom: "1rem",
            maxWidth: "320px",
            margin: "0 auto 1rem"
          }}>
            Анализ вашего питания и прогресса
          </p>
          
          {/* Refresh Button */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem"
          }}>
            <button
              onClick={loadSupabaseStats}
              disabled={loading}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                color: "white",
                fontSize: "0.875rem",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s"
              }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Обновление...' : 'Обновить'}
            </button>
            {lastUpdated && (
              <span style={{
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.7)"
              }}>
                Обновлено: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          {/* Quick Stats */}
          <div style={{
            display: "flex",
            justifyContent: "space-around",
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: "1rem",
            padding: "1rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "white",
                marginBottom: "0.25rem"
              }}>
                📊
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.8)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Анализ
              </div>
            </div>
            <div style={{
              width: "1px",
              background: "rgba(255, 255, 255, 0.2)",
              height: "2rem"
            }} />
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "white",
                marginBottom: "0.25rem"
              }}>
                {state.supabaseUser ? '✅' : '❌'}
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.8)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {state.supabaseUser ? 'База данных' : 'Локально'}
              </div>
            </div>
            <div style={{
              width: "1px",
              background: "rgba(255, 255, 255, 0.3)",
              margin: "0 0.5rem"
            }} />
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "white",
                marginBottom: "0.25rem"
              }}>
                📈
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.8)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Прогресс
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Progress */}
      <section className="card">
        <h3 className="meals-title">Прогресс сегодня</h3>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Калории</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
              {state.dailyStats.calories} / {state.dailyStats.targetCalories} ккал
            </span>
          </div>
          <div style={{ width: '100%', height: '0.75rem', background: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${getProgressPercentage()}%`, 
                height: '100%', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '0.375rem',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>

        {/* Macro Distribution */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          {[
            { 
              label: 'Белки', 
              current: state.dailyStats.protein, 
              target: state.dailyStats.targetProtein, 
              unit: 'г',
              color: '#3b82f6',
              icon: Dumbbell
            },
            { 
              label: 'Жиры', 
              current: state.dailyStats.fat, 
              target: state.dailyStats.targetFat, 
              unit: 'г',
              color: '#f59e0b',
              icon: Droplets
            },
            { 
              label: 'Углеводы', 
              current: state.dailyStats.carbs, 
              target: state.dailyStats.targetCarbs, 
              unit: 'г',
              color: '#10b981',
              icon: Wheat
            }
          ].map((macro) => (
            <div key={macro.label} style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
              <div style={{ color: macro.color, marginBottom: '0.5rem' }}>
                <macro.icon className="w-5 h-5 mx-auto" />
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                {macro.current}/{macro.target}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {macro.label}
              </div>
              <div style={{ width: '100%', height: '0.25rem', background: '#e5e7eb', borderRadius: '0.125rem', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${getMacroPercentage(macro.current, macro.target)}%`, 
                    height: '100%', 
                    background: macro.color,
                    borderRadius: '0.125rem'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="card">
        <h3 className="meals-title">Быстрая статистика</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {quickStats.map((stat) => (
            <div key={stat.label} style={{ 
              padding: '1rem', 
              background: '#f9fafb', 
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ color: stat.color }}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{stat.trend}</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {stat.unit}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Overview */}
      <section className="card">
        <h3 className="meals-title">Недельный обзор</h3>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {weeklyData.map((day) => (
            <div key={day.day} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.75rem', 
              background: '#f9fafb', 
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {day.day}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.125rem' }}>
                    {day.day === 'Пн' ? 'Понедельник' : 
                     day.day === 'Вт' ? 'Вторник' : 
                     day.day === 'Ср' ? 'Среда' : 
                     day.day === 'Чт' ? 'Четверг' : 
                     day.day === 'Пт' ? 'Пятница' : 
                     day.day === 'Сб' ? 'Суббота' : 'Воскресенье'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Белки: {day.protein}г | Жиры: {day.fat}г | Углеводы: {day.carbs}г
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {day.calories}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  ккал
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personalized Insights */}
      <section className="card">
        <h3 className="meals-title">Персональные рекомендации</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {insights.map((insight, index) => (
            <div key={index} style={{
              padding: '1rem',
              background: insight.type === 'positive' ? '#f0fdf4' : 
                         insight.type === 'warning' ? '#fef3c7' : '#eff6ff',
              borderRadius: '0.75rem',
              border: `1px solid ${
                insight.type === 'positive' ? '#bbf7d0' : 
                insight.type === 'warning' ? '#fde68a' : '#bfdbfe'
              }`
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem' }}>{insight.icon}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: '0.25rem' 
                  }}>
                    {insight.title}
                  </h4>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    lineHeight: '1.5' 
                  }}>
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StatsPage;

