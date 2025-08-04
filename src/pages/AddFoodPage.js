import React, { useState } from 'react';
import { Brain, Save, Edit, Sun, CloudSun, Moon, Cookie, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTelegram } from '../hooks/useTelegram';

const AddFoodPage = () => {
  const { actions } = useApp();
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
    { name: 'Яйцо вареное', calories: 70, protein: 6, fat: 5, carbs: 1, icon: '🥚' },
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

  const saveMeal = () => {
    if (!analysisResults) return;

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
    showAlert('Прием пищи сохранен!');
    
    // Reset form
    setFoodDescription('');
    setWeight('');
    setPortions(1);
    setAnalysisResults(null);
  };

  const handleQuickAdd = (food) => {
    setSelectedQuickFood(food);
    setShowQuickAdd(true);
  };

  const saveQuickMeal = () => {
    if (!selectedQuickFood) return;

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
    showAlert(`${selectedQuickFood.name} добавлен!`);
    
    // Reset form
    setWeight('');
    setPortions(1);
    setSelectedQuickFood(null);
    setShowQuickAdd(false);
  };

  const analyzeFoodWithAI = (description, mealType) => {
    const foods = description.toLowerCase().split(',');
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    foods.forEach(food => {
      const foodItem = food.trim();
      if (foodItem.includes('куриц') || foodItem.includes('грудк')) {
        totalCalories += 165;
        totalProtein += 31;
        totalFat += 3.6;
        totalCarbs += 0;
      } else if (foodItem.includes('рис')) {
        totalCalories += 130;
        totalProtein += 2.7;
        totalFat += 0.3;
        totalCarbs += 28;
      } else if (foodItem.includes('овощ') || foodItem.includes('салат')) {
        totalCalories += 25;
        totalProtein += 1.2;
        totalFat += 0.2;
        totalCarbs += 5;
      } else if (foodItem.includes('яйц')) {
        totalCalories += 70;
        totalProtein += 6;
        totalFat += 5;
        totalCarbs += 1;
      } else if (foodItem.includes('молок') || foodItem.includes('йогурт')) {
        totalCalories += 60;
        totalProtein += 3.2;
        totalFat += 3.3;
        totalCarbs += 4.8;
      } else {
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
      {/* Header */}
      <section className="card">
        <h2 className="meals-title">Добавить прием пищи</h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Опишите что вы съели, и ИИ проанализирует калории и БЖУ</p>
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
                min="1"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button
            onClick={analyzeFood}
            disabled={isAnalyzing}
            className="btn"
            style={{ opacity: isAnalyzing ? 0.5 : 1 }}
          >
            {isAnalyzing ? (
              <>
                <div style={{ width: '1.25rem', height: '1.25rem', border: '2px solid white', borderTop: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '0.5rem' }} />
                Анализирую...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" style={{ marginRight: '0.5rem' }} />
                Анализировать с ИИ
              </>
            )}
          </button>

          <button
            onClick={() => setShowQuickAdd(true)}
            className="btn btn-secondary"
          >
            <Plus className="w-5 h-5" style={{ marginRight: '0.5rem' }} />
            Быстрое добавление
          </button>
        </div>
      </section>

      {/* Analysis Results */}
      {analysisResults && (
        <section className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="meals-title">Результаты анализа</h3>
            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Brain className="w-4 h-4" />
              ИИ анализ
            </div>
          </div>

          {/* Nutrition Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Калории', value: analysisResults.calories, unit: 'ккал', icon: '🔥' },
              { label: 'Белки', value: analysisResults.protein, unit: 'г', icon: '💪' },
              { label: 'Жиры', value: analysisResults.fat, unit: 'г', icon: '🫗' },
              { label: 'Углеводы', value: analysisResults.carbs, unit: 'г', icon: '🍞' }
            ].map((item) => (
              <div key={item.label} style={{ background: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>{item.label}</h4>
                  <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937' }}>{item.value} {item.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommendations */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 className="meals-title">Рекомендации ИИ</h4>
            <div style={{ background: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', borderLeft: '4px solid #667eea' }}>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>{analysisResults.recommendations}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button
              onClick={saveMeal}
              className="btn"
            >
              <Save className="w-5 h-5" style={{ marginRight: '0.5rem' }} />
              Сохранить прием пищи
            </button>

            <button
              onClick={() => setAnalysisResults(null)}
              className="btn btn-secondary"
            >
              <Edit className="w-5 h-5" style={{ marginRight: '0.5rem' }} />
              Редактировать
            </button>
          </div>
        </section>
      )}

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 50
          }}
          onClick={() => setShowQuickAdd(false)}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '28rem',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="meals-title">Быстрое добавление</h3>
              <button
                onClick={() => setShowQuickAdd(false)}
                style={{
                  width: '2rem',
                  height: '2rem',
                  background: '#f3f4f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedQuickFood ? (
              <div>
                <div style={{ background: '#f9fafb', borderRadius: '0.5rem', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '2rem' }}>{selectedQuickFood.icon}</div>
                    <div>
                      <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{selectedQuickFood.name}</h4>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{selectedQuickFood.calories} ккал на 100г</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#3b82f6' }}>{selectedQuickFood.protein}г</div>
                      <div style={{ color: '#6b7280' }}>Белки</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#f59e0b' }}>{selectedQuickFood.fat}г</div>
                      <div style={{ color: '#6b7280' }}>Жиры</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#10b981' }}>{selectedQuickFood.carbs}г</div>
                      <div style={{ color: '#6b7280' }}>Углеводы</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Вес (г)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="input"
                      placeholder="100"
                    />
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Количество порций</label>
                    <input
                      type="number"
                      value={portions}
                      onChange={(e) => setPortions(e.target.value)}
                      className="input"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setSelectedQuickFood(null)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Назад
                  </button>
                  <button
                    onClick={saveQuickMeal}
                    className="btn"
                    style={{ flex: 1 }}
                  >
                    Добавить
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Выберите продукт для быстрого добавления:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {quickFoods.map((food) => (
                    <button
                      key={food.name}
                      onClick={() => handleQuickAdd(food)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        background: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem' }}>{food.icon}</div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>{food.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{food.calories} ккал</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFoodPage; 