import React, { useState, useEffect } from 'react';
import { Brain, Save, Edit, Sun, CloudSun, Moon, Cookie, X, Mic } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTelegram } from '../hooks/useTelegram';
import VoiceInput from '../components/VoiceInput';
import { analyzeFoodWithOpenAI } from '../services/openaiService';
import { checkAILimits } from '../config/aiSettings';
import '../components/VoiceInput.css';

const AddFoodPage = () => {
  const { state, actions } = useApp();
  const { showAlert } = useTelegram();
  const [foodDescription, setFoodDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Функция для очистки формы
  const resetForm = () => {
    setFoodDescription('');
    setAnalysisResults(null);
  };

  // Обработка результата голосового ввода
  const handleVoiceResult = (foodData) => {
    console.log('Получен голосовой результат:', foodData);
    setFoodDescription(foodData.description);
    // Убираем автоматический анализ - теперь только заполняем поле
  };

  // Очищаем форму при размонтировании компонента
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  const analyzeFood = async () => {
    if (!foodDescription.trim()) {
      showAlert('Пожалуйста, опишите что вы съели');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Временно отключаем проверку лимитов для тестирования
      // const limits = checkAILimits();
      // if (!limits.canUseGPT) {
      //   showAlert(`Достигнуты дневные лимиты: ${limits.dailyRequests}/${limits.remainingRequests} запросов, $${limits.dailyCost.toFixed(2)}/$${limits.remainingCost.toFixed(2)}`);
      //   setIsAnalyzing(false);
      //   return;
      // }

      // Анализ через GPT-3.5
      const analysis = await analyzeFoodWithOpenAI(foodDescription);
      setAnalysisResults(analysis);
      
      // Сохраняем запрос в базу данных
      if (state.supabaseUser) {
        await actions.addAIRequest({
          user_id: state.supabaseUser.id,
          request_text: foodDescription,
          response_text: JSON.stringify(analysis)
        });
      }
    } catch (error) {
      console.error('Ошибка анализа:', error);
      
      // Более подробная информация об ошибке
      if (error.message.includes('insufficient_quota')) {
        showAlert('Превышен лимит OpenAI API. Пополните баланс или создайте новый аккаунт.');
      } else if (error.message.includes('401')) {
        showAlert('Неверный API ключ OpenAI. Проверьте файл .env');
      } else if (error.message.includes('429')) {
        showAlert('Превышен лимит запросов к OpenAI. Попробуйте позже.');
      } else {
        showAlert(`Ошибка анализа еды: ${error.message}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveMeal = async () => {
    if (!analysisResults) return;

    try {
      // Сохраняем в локальное состояние
      const meal = {
        id: Date.now(),
        type: 'meal',
        description: foodDescription,
        nutrition: analysisResults,
        date: new Date().toDateString(),
        timestamp: new Date().toISOString()
      };

      actions.addMeal(meal);

      // Сохраняем в Supabase
      if (state.supabaseUser) {
        const foodData = {
          name: foodDescription,
          calories: analysisResults.calories,
          proteins: analysisResults.protein,
          fats: analysisResults.fat,
          carbs: analysisResults.carbs,
          date: new Date().toISOString().split('T')[0]
        };

        const { error } = await actions.addFoodEntry(state.supabaseUser.id, foodData);
        
        if (error) {
          console.warn('Ошибка сохранения в Supabase:', error);
          showAlert('Сохранено локально, но ошибка в базе данных');
        } else {
          showAlert('Прием пищи сохранен в базе данных!');
          // Синхронизируем данные после сохранения
          await actions.syncFromSupabase();
        }
      } else {
        try {
          showAlert('Прием пищи сохранен локально!');
        } catch (error) {
          console.log('Прием пищи сохранен локально!');
        }
      }
      
      // Reset form
      resetForm();
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      try {
        showAlert('Ошибка при сохранении');
      } catch (error) {
        console.log('Ошибка при сохранении');
      }
    }
  };



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
            Добавить еду
          </h1>
          
          {/* Subtitle */}
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1rem',
            lineHeight: '1.5',
            maxWidth: '320px',
            margin: '0 auto'
          }}>
            Введите данные и проанализируем калории и БЖУ
          </p>


        </div>
      </section>

      {/* Input Data Section */}
      <section className="card">
        <h3 className="meals-title">Ввод данных</h3>
        
        {/* Голосовой ввод */}
        <div style={{ marginBottom: '1.5rem' }}>
          <VoiceInput onVoiceResult={handleVoiceResult} />
        </div>
        
        {/* Разделитель */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: '#e5e7eb'
          }} />
          <span style={{
            padding: '0 1rem',
            fontSize: '0.875rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            или
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: '#e5e7eb'
          }} />
        </div>
        
        {/* Текстовый ввод */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '1rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.75rem'
          }}>
            Опишите что вы съели
          </label>
          
          <textarea
            value={foodDescription}
            onChange={(e) => setFoodDescription(e.target.value)}
            placeholder="Например: паста карбонара, овощной салат с помидорами и огурцами, чизкейк, апельсиновый сок 1 стакан..."
            className="input"
            rows={4}
            style={{ resize: 'none' }}
          />
        </div>
        
        {/* Разделитель перед кнопкой */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: '#e5e7eb'
          }} />
          <span style={{
            padding: '0 1rem',
            fontSize: '0.875rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            затем
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: '#e5e7eb'
          }} />
        </div>
        
        {/* Кнопка анализа */}
        <button
          onClick={analyzeFood}
          disabled={isAnalyzing || !foodDescription.trim()}
          style={{
            width: '100%',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '1rem',
            fontSize: '1.125rem',
            fontWeight: '700',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            opacity: isAnalyzing || !foodDescription.trim() ? 0.6 : 1,
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            if (!isAnalyzing && foodDescription.trim()) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isAnalyzing && foodDescription.trim()) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }
          }}
        >
          {/* Background glow effect */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: '1rem',
            pointerEvents: 'none'
          }} />
          
          {isAnalyzing ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem',
              position: 'relative',
              zIndex: 1
            }}>
              <Brain className="w-6 h-6 animate-spin" />
              <span>Анализирую через GPT-3.5...</span>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem',
              position: 'relative',
              zIndex: 1
            }}>
              <Brain className="w-6 h-6" />
              <span>Проанализировать через GPT-3.5</span>
            </div>
          )}
        </button>
        
        {/* Подсказка если поле пустое */}
        {!foodDescription.trim() && (
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280', 
            textAlign: 'center', 
            marginTop: '0.75rem',
            fontStyle: 'italic'
          }}>
          </p>
        )}
      </section>

      {/* Analysis Results */}
      {analysisResults && (
        <section className="card">
          <h3 className="meals-title">📊 Результаты анализа GPT-3.5</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>{analysisResults.calories}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ккал</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>{analysisResults.protein}g</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>белки</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fce7f3', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ec4899' }}>{analysisResults.fat}g</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>жиры</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#dcfce7', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>{analysisResults.carbs}g</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>углеводы</div>
            </div>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: '#f8fafc', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb',
            marginBottom: '1rem'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>💡 Рекомендации</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>{analysisResults.recommendations}</p>
          </div>
          
          <button
            onClick={saveMeal}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              color: 'white',
              border: 'none',
              padding: '1.25rem',
              borderRadius: '1rem',
              fontSize: '1.125rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
            }}
          >
            {/* Background glow effect */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              borderRadius: '1rem',
              pointerEvents: 'none'
            }} />
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem',
              position: 'relative',
              zIndex: 1
            }}>
              <Save className="w-6 h-6" />
              <span>Сохранить прием пищи</span>
            </div>
          </button>
        </section>
      )}
    </div>
  );
};

export default AddFoodPage;
