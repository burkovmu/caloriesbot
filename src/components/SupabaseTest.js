import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const SupabaseTest = () => {
  const { state, supabaseActions, telegramUser } = useApp();
  const [testResult, setTestResult] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log('SupabaseTest: Обновление данных');
    console.log('state.user:', state.user);
    console.log('state.supabaseUser:', state.supabaseUser);
    console.log('telegramUser:', telegramUser);
    
    // Проверяем, является ли это реальным пользователем Telegram
    if (telegramUser && telegramUser.id !== 123456789) {
      console.log('✅ Это реальный пользователь Telegram:', telegramUser);
    } else {
      console.log('❌ Это тестовый пользователь');
    }
  }, [state.user, state.supabaseUser, telegramUser]);

  const testConnection = async () => {
    try {
      setTestResult('Тестирование подключения...');
      
      if (!state.supabaseUser) {
        setTestResult('Ошибка: Пользователь не инициализирован');
        return;
      }

      // Тест добавления записи о еде
      const testFood = {
        name: 'Тестовая еда',
        calories: 100,
        proteins: 10,
        fats: 5,
        carbs: 15
      };

      const { data, error } = await supabaseActions.addFoodEntry(state.supabaseUser.id, testFood);
      
      if (error) {
        setTestResult(`Ошибка: ${error.message}`);
        return;
      }

      setTestResult(`✅ Успешно! Добавлена запись: ${data.food_name}`);
      
      // Удаляем тестовую запись
      setTimeout(async () => {
        await supabaseActions.deleteFoodEntry(data.id);
        setTestResult('✅ Тест завершен. Тестовая запись удалена.');
      }, 2000);

    } catch (err) {
      setTestResult(`Ошибка: ${err.message}`);
    }
  };

  const checkUserData = async () => {
    if (!state.supabaseUser) {
      setTestResult('Ошибка: Пользователь не инициализирован');
      return;
    }

    try {
      setTestResult('Проверка данных пользователя...');
      
      // Получаем все записи пользователя
      const { data, error } = await supabaseActions.getFoodEntries(state.supabaseUser.id);
      
      if (error) {
        setTestResult(`Ошибка получения данных: ${error.message}`);
        return;
      }

      setUserData(data);
      setTestResult(`✅ Найдено записей: ${data?.length || 0}`);
      
      console.log('Данные пользователя из Supabase:', data);
    } catch (err) {
      setTestResult(`Ошибка: ${err.message}`);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Тест Supabase</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>Пользователь:</strong> {state.user?.name || 'Не загружен'}</p>
        <p><strong>Telegram ID:</strong> {state.user?.telegramId || 'Не загружен'}</p>
        <p><strong>Supabase User ID:</strong> {state.supabaseUser?.id || 'Не загружен'}</p>
        <p><strong>Telegram User:</strong> {telegramUser ? `${telegramUser.first_name} (${telegramUser.id})` : 'Не загружен'}</p>
        <p><strong>Реальный пользователь:</strong> {telegramUser && telegramUser.id !== 123456789 ? '✅ Да' : '❌ Нет (тестовый)'}</p>
        <p><strong>Загрузка:</strong> {state.loading ? 'Да' : 'Нет'}</p>
        {state.error && <p className="text-red-500"><strong>Ошибка:</strong> {state.error}</p>}
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={testConnection}
          disabled={state.loading || !state.supabaseUser}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mr-2"
        >
          {state.loading ? 'Тестирование...' : 'Тест подключения'}
        </button>
        
        <button
          onClick={checkUserData}
          disabled={state.loading || !state.supabaseUser}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Проверить данные
        </button>
      </div>

      {testResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm">{testResult}</p>
        </div>
      )}

      {userData && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <h4 className="font-semibold mb-2">Данные пользователя:</h4>
          <div className="text-sm space-y-1">
            {userData.map((item, index) => (
              <div key={index} className="border-b pb-1">
                <strong>{item.food_name}</strong> - {item.calories} ккал
                <br />
                <span className="text-gray-600">
                  Белки: {item.proteins}g, Жиры: {item.fats}g, Углеводы: {item.carbs}g
                </span>
                <br />
                <span className="text-xs text-gray-500">
                  Дата: {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest; 