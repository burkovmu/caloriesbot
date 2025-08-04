import React from 'react';
import { Heart, Flame, Target, Plus, BarChart3, Settings, Book } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро!';
    if (hour < 18) return 'Добрый день!';
    return 'Добрый вечер!';
  };

  const getProgressPercentage = () => {
    return Math.min((state.dailyStats.calories / state.dailyStats.targetCalories) * 100, 100);
  };

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
          
          {/* Quick Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '1rem',
            padding: '1rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '0.25rem'
              }}>
                {state.dailyStats.calories}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                ккал сегодня
              </div>
            </div>
            <div style={{
              width: '1px',
              background: 'rgba(255, 255, 255, 0.3)',
              margin: '0 0.5rem'
            }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '0.25rem'
              }}>
                {getProgressPercentage().toFixed(0)}%
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                прогресс
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon flame">
            <Flame className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <h3>{state.dailyStats.calories}</h3>
            <p>Калории сегодня</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon target">
            <Target className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <h3>{state.dailyStats.targetCalories}</h3>
            <p>Цель калорий</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
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

      {/* Progress Section */}
      <section className="progress-section">
        <div className="progress-header">
          <h3 className="progress-title">Прогресс дня</h3>
          <span className="progress-percentage">{getProgressPercentage().toFixed(0)}%</span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        
        <div className="progress-text">
          {state.dailyStats.calories} / {state.dailyStats.targetCalories} ккал
        </div>
      </section>

      {/* Today's Meals */}
      <section>
        <h3 className="meals-title">Сегодняшние приемы пищи</h3>
        <div className="meals-section">
          {['Завтрак', 'Обед', 'Ужин'].map((meal, index) => (
            <div key={meal} className="meal-item">
              <div className="meal-icon">
                {index === 0 && '☀️'}
                {index === 1 && '🌤️'}
                {index === 2 && '🌙'}
              </div>
              <div className="meal-name">{meal}</div>
              <div className="meal-calories">0 ккал</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage; 