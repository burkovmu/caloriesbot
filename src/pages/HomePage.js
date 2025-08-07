import React, { useState, useEffect } from 'react';
import { Heart, Flame, Target, Plus, BarChart3, Settings, Book, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import TodayMeals from '../components/TodayMeals';

const HomePage = () => {
  const { state, supabaseActions } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро!';
    if (hour < 18) return 'Добрый день!';
    return 'Добрый вечер!';
  };

  const getProgressPercentage = () => {
    return Math.min((state.dailyStats.calories / state.dailyStats.targetCalories) * 100, 100);
  };

  // Загрузка актуальных данных из Supabase
  const loadTodayData = async () => {
    if (!state.supabaseUser) return;

    setLoading(true);
    try {
      // Синхронизируем данные из Supabase с локальным состоянием
      await actions.syncFromSupabase();
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при монтировании и при изменении пользователя
  useEffect(() => {
    loadTodayData();
  }, [state.supabaseUser]);

  // Обновляем данные при изменении dailyStats
  useEffect(() => {
    if (state.dailyStats.calories > 0) {
      setLastUpdated(new Date());
    }
  }, [state.dailyStats]);

  const actionCards = [
    {
      icon: Plus,
      title: 'Добавить еду',
      description: 'Записать прием пищи',
      onClick: () => navigate('/add'),
      iconClass: 'primary'
    },
    {
      icon: BarChart3,
      title: 'Статистика',
      description: 'Посмотреть прогресс',
      onClick: () => navigate('/stats'),
      iconClass: 'secondary'
    },
    {
      icon: Settings,
      title: 'Настройки',
      description: 'Персонализация',
      onClick: () => navigate('/profile'),
      iconClass: 'blue'
    },
    {
      icon: Book,
      title: 'База данных',
      description: 'Поиск продуктов',
      onClick: () => alert('Функция будет добавлена позже'),
      iconClass: 'green'
    }
  ];

  return (
    <div>
      {/* Welcome Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '1.5rem',
        padding: '2rem',
        marginBottom: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Icon */}
          <div style={{
            width: '4rem',
            height: '4rem',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            <Heart className="w-8 h-8 text-white" style={{ animation: 'pulse 2s infinite' }} />
          </div>
          
          {/* Title */}
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {getWelcomeMessage()}
          </h1>
          
          {/* Subtitle */}
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1rem',
            lineHeight: '1.5',
            marginBottom: '1.5rem',
            maxWidth: '280px',
            margin: '0 auto 1.5rem'
          }}>
            Начните свой путь к здоровому питанию с нашим трекером
          </p>
          
          {/* Calories Progress Bar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '1rem',
            padding: '1rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                margin: 0
              }}>
                Калории сегодня
              </h3>
              <span style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white'
              }}>
                {getProgressPercentage().toFixed(0)}%
              </span>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              height: '0.5rem',
              overflow: 'hidden',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                height: '100%',
                width: `${getProgressPercentage()}%`,
                borderRadius: '0.5rem',
                transition: 'width 0.3s ease'
              }} />
            </div>
            
            <div style={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center'
            }}>
              {state.dailyStats.calories} / {state.dailyStats.targetCalories} ккал
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="meals-title">Быстрые действия</h2>
        <div className="actions-grid">
          {actionCards.map((card, index) => (
            <div
              key={card.title}
              className="action-card"
              onClick={card.onClick}
            >
              <div className={`action-icon ${card.iconClass}`}>
                <card.icon className="w-8 h-8" />
              </div>
              <h3 className="action-title">{card.title}</h3>
              <p className="action-description">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Meals */}
      <TodayMeals />
    </div>
  );
};

export default HomePage; 