import React from 'react';
import { BarChart3, TrendingUp, Calendar, Target, Flame, Dumbbell, Droplets, Wheat } from 'lucide-react';
import { useApp } from '../context/AppContext';

const StatsPage = () => {
  const { state } = useApp();

  const getProgressPercentage = () => {
    return Math.min((state.dailyStats.calories / state.dailyStats.targetCalories) * 100, 100);
  };

  const getMacroPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

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
      value: '2050',
      unit: 'ккал/день',
      color: '#f59e0b',
      trend: '+5%'
    },
    {
      icon: Target,
      label: 'Достижение целей',
      value: '85%',
      unit: 'эффективность',
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
      {/* Header */}
      <section className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
              Статистика
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Анализ вашего питания и прогресса
            </p>
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
        <h3 className="meals-title">Ключевые показатели</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {quickStats.map((stat) => (
            <div key={stat.label} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ color: stat.color }}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {stat.label}
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {stat.unit}
              </div>
              <div style={{ fontSize: '0.75rem', color: stat.trend.includes('+') ? '#10b981' : stat.trend.includes('-') ? '#ef4444' : '#6b7280' }}>
                {stat.trend}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Overview */}
      <section className="card">
        <h3 className="meals-title">Недельный обзор</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '8rem', padding: '1rem 0' }}>
          {weeklyData.map((day, index) => {
            const maxCalories = Math.max(...weeklyData.map(d => d.calories));
            const height = (day.calories / maxCalories) * 100;
            
            return (
              <div key={day.day} style={{ textAlign: 'center', flex: 1 }}>
                <div 
                  style={{ 
                    height: `${height}%`,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '0.25rem',
                    marginBottom: '0.5rem',
                    minHeight: '1rem'
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {day.day}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1f2937' }}>
                  {day.calories}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Personalized Insights */}
      <section className="card">
        <h3 className="meals-title">Персональные инсайты</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {insights.map((insight, index) => (
            <div 
              key={index}
              style={{ 
                padding: '1rem', 
                background: insight.type === 'positive' ? '#f0fdf4' : 
                           insight.type === 'warning' ? '#fffbeb' : '#eff6ff',
                borderRadius: '0.5rem',
                borderLeft: `4px solid ${
                  insight.type === 'positive' ? '#10b981' : 
                  insight.type === 'warning' ? '#f59e0b' : '#3b82f6'
                }`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem' }}>
                  {insight.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {insight.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                    {insight.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Stats */}
      <section className="card">
        <h3 className="meals-title">Детальная статистика</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { label: 'Средние калории за неделю', value: '2050 ккал', color: '#f59e0b' },
            { label: 'Лучший день', value: 'Суббота', color: '#10b981' },
            { label: 'Самый активный прием пищи', value: 'Обед', color: '#3b82f6' },
            { label: 'Точность подсчета', value: '92%', color: '#8b5cf6' },
            { label: 'Любимый продукт', value: 'Куриная грудка', color: '#ef4444' },
            { label: 'Цель на следующую неделю', value: '2000 ккал/день', color: '#06b6d4' }
          ].map((stat) => (
            <div key={stat.label} style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StatsPage; 