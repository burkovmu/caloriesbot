import React from 'react';
import { ArrowLeft, Sun, Moon, Palette, Smartphone, Monitor, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTelegram } from '../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

const AppearancePage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { showAlert } = useTelegram();
  const navigate = useNavigate();

  const themeOptions = [
    {
      id: 'light',
      name: 'Светлая тема',
      description: 'Классический светлый дизайн',
      icon: Sun,
      active: !isDarkMode
    },
    {
      id: 'dark',
      name: 'Темная тема',
      description: 'Современная темная тема',
      icon: Moon,
      active: isDarkMode
    }
  ];

  const colorSchemes = [
    {
      id: 'default',
      name: 'Стандартная',
      description: 'Синий и фиолетовый градиент',
      colors: ['#667eea', '#764ba2'],
      active: true
    },
    {
      id: 'ocean',
      name: 'Океан',
      description: 'Синие и голубые тона',
      colors: ['#0ea5e9', '#06b6d4'],
      active: false
    },
    {
      id: 'sunset',
      name: 'Закат',
      description: 'Оранжевые и красные тона',
      colors: ['#f59e0b', '#ef4444'],
      active: false
    },
    {
      id: 'forest',
      name: 'Лес',
      description: 'Зеленые и природные тона',
      colors: ['#10b981', '#059669'],
      active: false
    },
    {
      id: 'lavender',
      name: 'Лаванда',
      description: 'Фиолетовые и розовые тона',
      colors: ['#8b5cf6', '#ec4899'],
      active: false
    },
    {
      id: 'monochrome',
      name: 'Монохром',
      description: 'Черно-белая схема',
      colors: ['#374151', '#6b7280'],
      active: false
    }
  ];

  const additionalSettings = [
    {
      icon: Smartphone,
      title: 'Адаптивный дизайн',
      description: 'Автоматическая адаптация под размер экрана',
      enabled: true
    },
    {
      icon: Monitor,
      title: 'Высокое разрешение',
      description: 'Оптимизация для дисплеев с высоким DPI',
      enabled: true
    },
    {
      icon: Palette,
      title: 'Анимации',
      description: 'Плавные переходы и анимации',
      enabled: true
    }
  ];

  const handleThemeChange = (themeId) => {
    if (themeId === 'dark' && !isDarkMode) {
      toggleTheme();
    } else if (themeId === 'light' && isDarkMode) {
      toggleTheme();
    }
    showAlert('Тема изменена!');
  };

  const handleColorSchemeChange = (schemeId) => {
    showAlert(`Цветовая схема "${schemeId}" будет добавлена в следующем обновлении!`);
  };

  return (
    <div>
      {/* Header */}
      <section className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '0.5rem',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#6b7280',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
              Внешний вид
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Настройте внешний вид приложения
            </p>
          </div>
        </div>
      </section>

      {/* Theme Selection */}
      <section className="card">
        <h3 className="meals-title">Выбор темы</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {themeOptions.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                background: theme.active ? '#f0f9ff' : 'white',
                border: theme.active ? '2px solid #667eea' : '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <div style={{ color: theme.active ? '#667eea' : '#6b7280' }}>
                <theme.icon className="w-6 h-6" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                  {theme.name}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {theme.description}
                </div>
              </div>
              {theme.active && (
                <div style={{ color: '#667eea' }}>
                  <Check className="w-5 h-5" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Color Schemes */}
      <section className="card">
        <h3 className="meals-title">Цветовые схемы</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => handleColorSchemeChange(scheme.id)}
              style={{
                padding: '1rem',
                background: 'white',
                border: scheme.active ? '2px solid #667eea' : '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ 
                  width: '1.5rem', 
                  height: '1.5rem', 
                  background: `linear-gradient(135deg, ${scheme.colors[0]} 0%, ${scheme.colors[1]} 100%)`,
                  borderRadius: '0.25rem'
                }} />
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                  {scheme.name}
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {scheme.description}
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {scheme.colors.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      width: '1rem',
                      height: '1rem',
                      background: color,
                      borderRadius: '0.125rem'
                    }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Additional Settings */}
      <section className="card">
        <h3 className="meals-title">Дополнительные настройки</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {additionalSettings.map((setting) => (
            <div
              key={setting.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem'
              }}
            >
              <div style={{ color: '#6b7280' }}>
                <setting.icon className="w-5 h-5" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                  {setting.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {setting.description}
                </div>
              </div>
              <div style={{
                width: '2.5rem',
                height: '1.5rem',
                background: setting.enabled ? '#667eea' : '#d1d5db',
                borderRadius: '0.75rem',
                position: 'relative',
                transition: 'background 0.2s'
              }}>
                <div style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  background: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '0.125rem',
                  left: setting.enabled ? '1.125rem' : '0.125rem',
                  transition: 'left 0.2s'
                }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Preview */}
      <section className="card">
        <h3 className="meals-title">Предварительный просмотр</h3>
        
        <div style={{ 
          padding: '1.5rem', 
          background: isDarkMode ? '#1f2937' : 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem'
            }}>
              🍎
            </div>
            <div>
              <div style={{ 
                fontWeight: '600', 
                color: isDarkMode ? 'white' : '#1f2937',
                marginBottom: '0.25rem'
              }}>
                CalorieTracker
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: isDarkMode ? '#9ca3af' : '#6b7280'
              }}>
                Предварительный просмотр
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '0.75rem' 
          }}>
            {[
              { label: 'Калории', value: '1250', color: '#f59e0b' },
              { label: 'Цель', value: '2000', color: '#10b981' }
            ].map((stat) => (
              <div key={stat.label} style={{ 
                padding: '0.75rem', 
                background: isDarkMode ? '#374151' : '#f9fafb',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 'bold', 
                  color: isDarkMode ? 'white' : '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: isDarkMode ? '#9ca3af' : '#6b7280'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="card">
        <div style={{ 
          padding: '1rem', 
          background: '#f0f9ff', 
          borderRadius: '0.5rem',
          border: '1px solid #bae6fd'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '0.75rem' 
          }}>
            <div style={{ fontSize: '1.25rem' }}>💡</div>
            <div>
              <div style={{ 
                fontWeight: '600', 
                color: '#1e40af', 
                marginBottom: '0.25rem' 
              }}>
                Совет
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#1e40af',
                lineHeight: '1.5'
              }}>
                Выбранная тема будет применена ко всему приложению. Изменения сохраняются автоматически.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppearancePage; 