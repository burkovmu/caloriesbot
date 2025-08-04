import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const SupabaseTest = () => {
  const { state, supabaseActions, telegramUser } = useApp();
  const [testResult, setTestResult] = useState('');

  // useEffect(() => {
  //   console.log('SupabaseTest: Обновление данных');
  //   console.log('state.user:', state.user);
  //   console.log('state.supabaseUser:', state.supabaseUser);
  //   console.log('telegramUser:', telegramUser);
  // }, [state.user, state.supabaseUser, telegramUser]);

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

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Тест Supabase</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>Пользователь:</strong> {state.user?.name || 'Не загружен'}</p>
        <p><strong>Telegram ID:</strong> {state.user?.telegramId || 'Не загружен'}</p>
        <p><strong>Supabase User ID:</strong> {state.supabaseUser?.id || 'Не загружен'}</p>
        <p><strong>Telegram User:</strong> {telegramUser ? `${telegramUser.first_name} (${telegramUser.id})` : 'Не загружен'}</p>
        <p><strong>Загрузка:</strong> {state.loading ? 'Да' : 'Нет'}</p>
        {state.error && <p className="text-red-500"><strong>Ошибка:</strong> {state.error}</p>}
      </div>

      <button
        onClick={testConnection}
        disabled={state.loading || !state.supabaseUser}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {state.loading ? 'Тестирование...' : 'Тест подключения'}
      </button>

      {testResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm">{testResult}</p>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest; 