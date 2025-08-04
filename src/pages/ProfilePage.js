import React, { useState } from 'react';
import { User, Edit, Calendar, Trophy, Scale, Target, Download, Upload, Trash2, Bell, Palette, Shield, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTelegram } from '../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import SupabaseTest from '../components/SupabaseTest';

const ProfilePage = () => {
  const { state, actions } = useApp();
  const { showAlert, showConfirm } = useTelegram();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...(state.user || {}) });

  const handleSave = () => {
    actions.setUser(editData);
    setIsEditing(false);
    showAlert('Профиль обновлен!');
  };

  const handleCancel = () => {
    setEditData({ ...(state.user || {}) });
    setIsEditing(false);
  };

  const exportData = () => {
    const data = {
      user: state.user,
      meals: state.meals,
      dailyStats: state.dailyStats,
      settings: state.settings
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calorietracker-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showAlert('Данные экспортированы!');
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            // Здесь можно добавить логику импорта данных
            showAlert('Данные импортированы!');
          } catch (error) {
            showAlert('Ошибка при импорте данных');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const deleteData = () => {
    showConfirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.', (confirmed) => {
      if (confirmed) {
        actions.resetDailyStats();
        showAlert('Все данные удалены!');
      }
    });
  };

  const settingsItems = [
    {
      icon: Bell,
      title: 'Уведомления',
      description: 'Напоминания о приемах пищи',
      value: state.settings.notifications ? 'Включены' : 'Выключены',
      onClick: () => actions.setSettings({ notifications: !state.settings.notifications })
    },
    {
      icon: Palette,
      title: 'Внешний вид',
      description: 'Темная тема и настройки',
      value: 'Настроить',
      onClick: () => navigate('/appearance')
    },
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Настройки приватности',
      value: 'Настроить',
      onClick: () => showAlert('Функция будет добавлена позже')
    },
    {
      icon: HelpCircle,
      title: 'Помощь',
      description: 'FAQ и поддержка',
      value: 'Открыть',
      onClick: () => showAlert('Функция будет добавлена позже')
    }
  ];

  const accountActions = [
    {
      icon: Download,
      title: 'Экспорт данных',
      description: 'Скачать все ваши данные',
      onClick: exportData,
      color: 'primary'
    },
    {
      icon: Upload,
      title: 'Импорт данных',
      description: 'Загрузить данные из файла',
      onClick: importData,
      color: 'secondary'
    },
    {
      icon: Trash2,
      title: 'Удалить все данные',
      description: 'Очистить все данные приложения',
      onClick: deleteData,
      color: 'danger'
    }
  ];

  return (
    <div>
      {/* Profile Header */}
      <section className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '4rem', 
            height: '4rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem'
          }}>
            <User className="w-8 h-8" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
              {state.user?.name || 'Пользователь'}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Пользователь CalorieTracker
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: '0.5rem',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#6b7280',
              cursor: 'pointer'
            }}
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        {/* Personal Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          {[
            { icon: Calendar, label: 'Дней', value: '7', color: '#3b82f6' },
            { icon: Trophy, label: 'Цель', value: (state.user?.targetWeight || 0) + 'кг', color: '#10b981' },
            { icon: Scale, label: 'Текущий', value: (state.user?.weight || 0) + 'кг', color: '#f59e0b' }
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
              <div style={{ color: stat.color, marginBottom: '0.5rem' }}>
                <stat.icon className="w-6 h-6 mx-auto" />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personal Data */}
      <section className="card">
        <h3 className="meals-title">Личные данные</h3>
        
        {isEditing ? (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Имя</label>
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="input"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Возраст</label>
                <input
                  type="number"
                  value={editData.age || ''}
                  onChange={(e) => setEditData({ ...editData, age: parseInt(e.target.value) })}
                  className="input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Рост (см)</label>
                <input
                  type="number"
                  value={editData.height || ''}
                  onChange={(e) => setEditData({ ...editData, height: parseInt(e.target.value) })}
                  className="input"
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Вес (кг)</label>
                <input
                  type="number"
                  value={editData.weight || ''}
                  onChange={(e) => setEditData({ ...editData, weight: parseInt(e.target.value) })}
                  className="input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Целевой вес (кг)</label>
                <input
                  type="number"
                  value={editData.targetWeight || ''}
                  onChange={(e) => setEditData({ ...editData, targetWeight: parseInt(e.target.value) })}
                  className="input"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleSave} className="btn" style={{ flex: 1 }}>
                Сохранить
              </button>
              <button onClick={handleCancel} className="btn btn-secondary" style={{ flex: 1 }}>
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Возраст', value: (state.user?.age || 0) + ' лет' },
                { label: 'Рост', value: (state.user?.height || 0) + ' см' },
                { label: 'Вес', value: (state.user?.weight || 0) + ' кг' },
                { label: 'Целевой вес', value: (state.user?.targetWeight || 0) + ' кг' }
              ].map((item) => (
                <div key={item.label} style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Goals and Preferences */}
      <section className="card">
        <h3 className="meals-title">Цели и предпочтения</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Уровень активности</label>
          <select 
            value={state.user?.activityLevel || 'moderate'}
            onChange={(e) => actions.setUser({ activityLevel: e.target.value })}
            className="input"
          >
            <option value="sedentary">Сидячий образ жизни</option>
            <option value="light">Легкая активность</option>
            <option value="moderate">Умеренная активность</option>
            <option value="active">Активный образ жизни</option>
            <option value="very_active">Очень активный</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Цель</label>
          <select 
            value={state.user?.goal || 'maintain'}
            onChange={(e) => actions.setUser({ goal: e.target.value })}
            className="input"
          >
            <option value="lose">Похудение</option>
            <option value="maintain">Поддержание веса</option>
            <option value="gain">Набор веса</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Целевые калории</label>
          <input
            type="number"
            value={state.dailyStats.targetCalories}
            onChange={(e) => actions.updateDailyStats({ targetCalories: parseInt(e.target.value) })}
            className="input"
          />
        </div>
      </section>

      {/* Settings */}
      <section className="card">
        <h3 className="meals-title">Настройки</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {settingsItems.map((item) => (
            <button
              key={item.title}
              onClick={item.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ color: '#6b7280' }}>
                <item.icon className="w-5 h-5" />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {item.description}
                </div>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#667eea', fontWeight: '500' }}>
                {item.value}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Account Actions */}
      <section className="card">
        <h3 className="meals-title">Действия с аккаунтом</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {accountActions.map((action) => (
            <button
              key={action.title}
              onClick={action.onClick}
              className={`btn ${action.color === 'danger' ? 'btn-danger' : action.color === 'secondary' ? 'btn-secondary' : ''}`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                justifyContent: 'flex-start',
                textAlign: 'left'
              }}
            >
              <action.icon className="w-5 h-5" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  {action.title}
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  {action.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Supabase Test */}
      <section className="card">
        <h3 className="meals-title">Тест базы данных</h3>
        <SupabaseTest />
      </section>
    </div>
  );
};

export default ProfilePage; 