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
            maxWidth: '280px',
            margin: '0 auto'
          }}>
            Начните свой путь к здоровому питанию с нашим трекером
          </p>
        </div>
      </section>

      {/* Calories Today Section */}
      <section style={{
        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        borderRadius: '1rem',
        padding: '1.25rem',
        marginBottom: '1rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)'
      }}>
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                  marginBottom: '0.125rem'
                }}>
                  Калории сегодня
                </h2>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0
                }}>
                  Ваш прогресс
                </p>
              </div>
            </div>
            
            <div style={{
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '0.75rem',
              padding: '0.75rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: '3.5rem'
            }}>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '0.125rem'
              }}>
                {getProgressPercentage().toFixed(0)}%
              </div>
              <div style={{
                fontSize: '0.625rem',
                color: 'rgba(255, 255, 255, 0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Прогресс
              </div>
            </div>
          </div>
          
          {/* Progress Bar with Integrated Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '0.75rem',
            height: '2.5rem',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            {/* Progress Fill */}
            <div style={{
              background: 'linear-gradient(90deg, #ffffff 0%, #f0fdf4 100%)',
              height: '100%',
              width: `${getProgressPercentage()}%`,
              borderRadius: '0.75rem',
              transition: 'width 0.5s ease',
              boxShadow: '0 2px 8px rgba(255, 255, 255, 0.3)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Съедено - внутри прогресс-бара */}
              <div style={{
                position: 'absolute',
                left: '0.75rem',
                color: '#10b981',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}>
                {state.dailyStats.calories}
              </div>
            </div>
            
            {/* Осталось - справа от прогресс-бара */}
            <div style={{
              position: 'absolute',
              right: '0.75rem',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              {Math.max(0, state.dailyStats.targetCalories - state.dailyStats.calories)}
            </div>
            
            {/* Подписи под прогресс-баром */}
            <div style={{
              position: 'absolute',
              bottom: '-1.25rem',
              left: '0',
              right: '0',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.625rem',
              color: 'rgba(255, 255, 255, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <span>Съедено</span>
              <span>{state.dailyStats.calories > state.dailyStats.targetCalories ? 'Превышено' : 'Осталось'}</span>
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