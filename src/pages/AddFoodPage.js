import React, { useState } from 'react';
import { Brain, Save, Edit, Sun, CloudSun, Moon, Cookie, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTelegram } from '../hooks/useTelegram';

const AddFoodPage = () => {
  const { state, actions, supabaseActions } = useApp();
  const { showAlert } = useTelegram();
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [foodDescription, setFoodDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [portions, setPortions] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedQuickFood, setSelectedQuickFood] = useState(null);

  const mealTypes = [
    { id: 'breakfast', label: 'Завтрак', icon: Sun },
    { id: 'lunch', label: 'Обед', icon: CloudSun },
    { id: 'dinner', label: 'Ужин', icon: Moon },
    { id: 'snack', label: 'Перекус', icon: Cookie }
  ];

  const quickFoods = [
    { name: 'Куриная грудка', calories: 165, protein: 31, fat: 3.6, carbs: 0, icon: '🍗' },
    { name: 'Рис отварной', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, icon: '🍚' },
    { name: 'Овсянка', calories: 68, protein: 2.4, fat: 1.4, carbs: 12, icon: '🥣' },
    { name: 'Яйцо вареное', calories: 70, protein: 6, fat: 5, carbs: 1, icon: '��' },
    { name: 'Творог 5%', calories: 121, protein: 18, fat: 5, carbs: 3, icon: '🧀' },
    { name: 'Банан', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, icon: '🍌' },
    { name: 'Яблоко', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, icon: '🍎' },
    { name: 'Гречка', calories: 110, protein: 4, fat: 1, carbs: 21, icon: '🌾' },
    { name: 'Лосось', calories: 208, protein: 25, fat: 12, carbs: 0, icon: '🐟' },
    { name: 'Брокколи', calories: 34, protein: 2.8, fat: 0.4, carbs: 7, icon: '🥦' },
    { name: 'Авокадо', calories: 160, protein: 2, fat: 15, carbs: 9, icon: '🥑' },
    { name: 'Орехи грецкие', calories: 654, protein: 15, fat: 65, carbs: 14, icon: '🌰' }
  ];

  const analyzeFood = async () => {
    if (!foodDescription.trim()) {
      showAlert('Пожалуйста, опишите что вы съели');
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis (replace with real API call)
    setTimeout(() => {
      const analysis = analyzeFoodWithAI(foodDescription, selectedMeal);
      setAnalysisResults(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const saveMeal = async () => {
    if (!analysisResults) return;

    try {
      // Сохраняем в локальное состояние
      const meal = {
        id: Date.now(),
        type: selectedMeal,
        description: foodDescription,
        weight: parseInt(weight) || 0,
        portions: parseInt(portions),
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

        const { error } = await supabaseActions.addFoodEntry(state.supabaseUser.id, foodData);
        
        if (error) {
          console.warn('Ошибка сохранения в Supabase:', error);
          showAlert('Сохранено локально, но ошибка в базе данных');
        } else {
          showAlert('Прием пищи сохранен в базе данных!');
        }
              } else {
          try {
            showAlert('Прием пищи сохранен локально!');
          } catch (error) {
            console.log('Прием пищи сохранен локально!');
          }
        }
      
      // Reset form
      setFoodDescription('');
      setWeight('');
      setPortions(1);
      setAnalysisResults(null);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      try {
        showAlert('Ошибка при сохранении');
      } catch (error) {
        console.log('Ошибка при сохранении');
      }
    }
  };

  const handleQuickAdd = (food) => {
    setSelectedQuickFood(food);
    setShowQuickAdd(true);
  };

  const saveQuickMeal = async () => {
    if (!selectedQuickFood) return;

    try {
      // Сохраняем в локальное состояние
      const meal = {
        id: Date.now(),
        type: selectedMeal,
        description: selectedQuickFood.name,
        weight: parseInt(weight) || 100,
        portions: parseInt(portions),
        nutrition: {
          calories: selectedQuickFood.calories,
          protein: selectedQuickFood.protein,
          fat: selectedQuickFood.fat,
          carbs: selectedQuickFood.carbs,
          recommendations: `Быстро добавлен продукт: ${selectedQuickFood.name}`
        },
        date: new Date().toDateString(),
        timestamp: new Date().toISOString()
      };

      actions.addMeal(meal);

      // Сохраняем в Supabase
      if (state.supabaseUser) {
        const foodData = {
          name: selectedQuickFood.name,
          calories: selectedQuickFood.calories,
          proteins: selectedQuickFood.protein,
          fats: selectedQuickFood.fat,
          carbs: selectedQuickFood.carbs,
          date: new Date().toISOString().split('T')[0]
        };

        const { error } = await supabaseActions.addFoodEntry(state.supabaseUser.id, foodData);
        
        if (error) {
          console.warn('Ошибка сохранения в Supabase:', error);
          showAlert('Сохранено локально, но ошибка в базе данных');
        } else {
          try {
            showAlert('Продукт добавлен в базу данных!');
          } catch (error) {
            console.log('Продукт добавлен в базу данных!');
          }
        }
              } else {
          try {
            showAlert('Продукт добавлен локально!');
          } catch (error) {
            console.log('Продукт добавлен локально!');
          }
        }
      
      setShowQuickAdd(false);
      setSelectedQuickFood(null);
      setWeight('');
      setPortions(1);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      try {
        showAlert('Ошибка при сохранении');
      } catch (error) {
        console.log('Ошибка при сохранении');
      }
    }
  };

  const analyzeFoodWithAI = (description, mealType) => {
    // Simulate AI analysis
    const words = description.toLowerCase().split(' ');
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    words.forEach(word => {
      if (word.includes('куриц') || word.includes('грудк')) {
        totalCalories += 165;
        totalProtein += 31;
        totalFat += 3.6;
        totalCarbs += 0;
      } else if (word.includes('рис')) {
        totalCalories += 130;
        totalProtein += 2.7;
        totalFat += 0.3;
        totalCarbs += 28;
      } else if (word.includes('овсянк') || word.includes('каш')) {
        totalCalories += 68;
        totalProtein += 2.4;
        totalFat += 1.4;
        totalCarbs += 12;
      } else if (word.includes('яйц') || word.includes('яичниц')) {
        totalCalories += 70;
        totalProtein += 6;
        totalFat += 5;
        totalCarbs += 1;
      } else if (word.includes('творог')) {
        totalCalories += 121;
        totalProtein += 18;
        totalFat += 5;
        totalCarbs += 3;
      } else if (word.includes('банан')) {
        totalCalories += 89;
        totalProtein += 1.1;
        totalFat += 0.3;
        totalCarbs += 23;
      } else if (word.includes('яблок')) {
        totalCalories += 52;
        totalProtein += 0.3;
        totalFat += 0.2;
        totalCarbs += 14;
      } else if (word.includes('гречк')) {
        totalCalories += 110;
        totalProtein += 4;
        totalFat += 1;
        totalCarbs += 21;
      } else if (word.includes('лосос') || word.includes('рыб')) {
        totalCalories += 208;
        totalProtein += 25;
        totalFat += 12;
        totalCarbs += 0;
      } else if (word.includes('брокколи') || word.includes('овощ')) {
        totalCalories += 34;
        totalProtein += 2.8;
        totalFat += 0.4;
        totalCarbs += 7;
      } else if (word.includes('авокадо')) {
        totalCalories += 160;
        totalProtein += 2;
        totalFat += 15;
        totalCarbs += 9;
      } else if (word.includes('орех')) {
        totalCalories += 654;
        totalProtein += 15;
        totalFat += 65;
        totalCarbs += 14;
      } else {
        // Default for unknown foods
        totalCalories += 100;
        totalProtein += 5;
        totalFat += 3;
        totalCarbs += 15;
      }
    });

    let recommendations = '';
    if (totalCalories < 200) {
      recommendations = 'Это легкий прием пищи. Рекомендую добавить больше белка для насыщения.';
    } else if (totalCalories > 600) {
      recommendations = 'Это довольно калорийный прием пищи. Учитывайте это в общем дневном балансе.';
    } else {
      recommendations = 'Хорошо сбалансированный прием пищи. Продолжайте в том же духе!';
    }

    if (totalProtein < 15) {
      recommendations += ' Рекомендую добавить больше белковых продуктов.';
    }

    return {
      calories: totalCalories,
      protein: totalProtein,
      fat: totalFat,
      carbs: totalCarbs,
      recommendations
    };
  };

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
            <Plus className="w-8 h-8 text-white" style={{ animation: "pulse 2s infinite" }} />
          </div>
          
          {/* Title */}
          <h1 style={{
            fontSize: "1.75rem",
            fontWeight: "bold",
            color: "white",
            marginBottom: "0.5rem",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
          }}>
            Добавить еду
          </h1>
          
          {/* Subtitle */}
          <p style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "1rem",
            lineHeight: "1.5",
            marginBottom: "1.5rem",
            maxWidth: "320px",
            margin: "0 auto 1.5rem"
          }}>
            Опишите что вы съели, и ИИ проанализирует калории и БЖУ
          </p>
          
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
                🧠
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.8)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                ИИ-анализ
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
                📊
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.8)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                БЖУ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Input Section */}
      <section className="card">
        {/* Meal Type Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="meals-title">Выберите прием пищи</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {mealTypes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedMeal(id)}
                className={`btn ${selectedMeal === id ? 'btn-secondary' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: selectedMeal === id ? '2px solid #667eea' : '2px solid #e5e7eb',
                  background: selectedMeal === id ? '#f0f9ff' : 'white',
                  color: selectedMeal === id ? '#667eea' : '#6b7280',
                  transition: 'all 0.2s'
                }}
              >
                <Icon className="w-5 h-5" />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Food Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="meals-title">Опишите что вы съели</h3>
          <textarea
            value={foodDescription}
            onChange={(e) => setFoodDescription(e.target.value)}
            placeholder="Например: куриная грудка 200г, рис 100г, овощной салат с помидорами и огурцами..."
            className="input"
            rows={4}
            style={{ resize: 'none' }}
          />
        </div>

        {/* Portion Estimation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="meals-title">Примерные порции (если знаете)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Вес блюда (г)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="300"
                className="input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Количество порций</label>
              <input
                type="number"
                value={portions}
                onChange={(e) => setPortions(e.target.value)}
                placeholder="1"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* AI Analysis Button */}
        <button
          onClick={analyzeFood}
          disabled={isAnalyzing || !foodDescription.trim()}
          className="btn"
          style={{
            width: '100%',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            opacity: isAnalyzing || !foodDescription.trim() ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
        >
          {isAnalyzing ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Brain className="w-5 h-5 animate-spin" />
              Анализирую...
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Brain className="w-5 h-5" />
              Проанализировать ИИ
            </div>
          )}
        </button>
      </section>

      {/* Analysis Results */}
      {analysisResults && (
        <section className="card">
          <h3 className="meals-title">Результаты анализа</h3>
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
            className="btn"
            style={{
              width: '100%',
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Save className="w-5 h-5" />
              Сохранить прием пищи
            </div>
          </button>
        </section>
      )}

      {/* Quick Add Section */}
      <section className="card">
        <h3 className="meals-title">Быстрое добавление</h3>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Выберите готовый продукт из базы данных</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {quickFoods.slice(0, 8).map((food) => (
            <button
              key={food.name}
              onClick={() => handleQuickAdd(food)}
              className="btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #e5e7eb',
                background: 'white',
                color: '#374151',
                transition: 'all 0.2s',
                fontSize: '0.875rem'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{food.icon}</span>
              <span style={{ fontWeight: '500' }}>{food.name}</span>
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setShowQuickAdd(true)}
          className="btn"
          style={{
            width: '100%',
            marginTop: '1rem',
            background: '#f3f4f6',
            color: '#374151',
            border: '2px dashed #d1d5db',
            padding: '1rem',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Plus className="w-5 h-5" />
            Показать все продукты
          </div>
        </button>
      </section>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>Выберите продукт</h3>
              <button
                onClick={() => setShowQuickAdd(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {quickFoods.map((food) => (
                <button
                  key={food.name}
                  onClick={() => handleQuickAdd(food)}
                  className="btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #e5e7eb',
                    background: 'white',
                    color: '#374151',
                    transition: 'all 0.2s',
                    fontSize: '0.875rem'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{food.icon}</span>
                  <span style={{ fontWeight: '500' }}>{food.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Modal for Selected Food */}
      {selectedQuickFood && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            maxWidth: '400px',
            width: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>Добавить {selectedQuickFood.name}</h3>
              <button
                onClick={() => setSelectedQuickFood(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Вес (г)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="100"
                className="input"
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Количество порций</label>
              <input
                type="number"
                value={portions}
                onChange={(e) => setPortions(e.target.value)}
                placeholder="1"
                className="input"
              />
            </div>
            
            <button
              onClick={saveQuickMeal}
              className="btn"
              style={{
                width: '100%',
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Save className="w-5 h-5" />
                Добавить продукт
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFoodPage;
