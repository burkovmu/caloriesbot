# НАСТРОЙКА SUPABASE ДЛЯ TELEGRAM MINI APP

## Шаг 1: Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project"
3. Войдите через GitHub или создайте аккаунт
4. Нажмите "New Project"
5. Заполните форму:
   - **Organization**: выберите или создайте новую
   - **Name**: `tg4-food-tracker`
   - **Database Password**: придумайте надежный пароль
   - **Region**: выберите ближайший к вам регион
6. Нажмите "Create new project"

## Шаг 2: Получение ключей API

После создания проекта:

1. Перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** (например: `https://your-project.supabase.co`)
   - **anon public** ключ

## Шаг 3: Создание таблиц

1. Перейдите в **SQL Editor**
2. Создайте новый запрос
3. Скопируйте и вставьте содержимое файла `supabase-schema.sql`
4. Нажмите "Run" для выполнения

## Шаг 4: Настройка переменных окружения

1. Создайте файл `.env` в корне проекта
2. Добавьте следующие переменные:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## Шаг 5: Тестирование подключения

После настройки можно протестировать подключение, добавив в компонент:

```javascript
import { supabase } from './config/supabase'

// Тест подключения
const testConnection = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('count')
    .limit(1)
  
  if (error) {
    console.error('Ошибка подключения:', error)
  } else {
    console.log('Подключение успешно!')
  }
}
```

## Шаг 6: Настройка аутентификации (опционально)

Если планируете использовать встроенную аутентификацию Supabase:

1. Перейдите в **Authentication** → **Settings**
2. Настройте провайдеры (Google, GitHub и т.д.)
3. Настройте URL для редиректов

## Структура базы данных

### Таблица `users`
- `id` - UUID, первичный ключ
- `telegram_id` - BIGINT, уникальный ID пользователя Telegram
- `username` - TEXT, имя пользователя
- `first_name` - TEXT, имя
- `last_name` - TEXT, фамилия
- `created_at` - TIMESTAMP, дата создания
- `updated_at` - TIMESTAMP, дата обновления

### Таблица `food_entries`
- `id` - UUID, первичный ключ
- `user_id` - UUID, ссылка на пользователя
- `food_name` - TEXT, название еды
- `calories` - INTEGER, калории
- `proteins` - DECIMAL, белки
- `fats` - DECIMAL, жиры
- `carbs` - DECIMAL, углеводы
- `date` - DATE, дата записи
- `created_at` - TIMESTAMP, дата создания

### Таблица `ai_requests`
- `id` - UUID, первичный ключ
- `user_id` - UUID, ссылка на пользователя
- `request_text` - TEXT, текст запроса
- `response_text` - TEXT, ответ AI
- `created_at` - TIMESTAMP, дата создания

## Полезные команды Supabase

### Просмотр данных
```sql
-- Все пользователи
SELECT * FROM users;

-- Записи о еде пользователя
SELECT * FROM food_entries WHERE user_id = 'user-uuid';

-- Статистика по калориям
SELECT 
  date,
  SUM(calories) as total_calories,
  SUM(proteins) as total_proteins
FROM food_entries 
WHERE user_id = 'user-uuid'
GROUP BY date
ORDER BY date DESC;
```

### Очистка данных
```sql
-- Удалить все записи пользователя
DELETE FROM food_entries WHERE user_id = 'user-uuid';
DELETE FROM ai_requests WHERE user_id = 'user-uuid';
DELETE FROM users WHERE id = 'user-uuid';
```

## Следующие шаги

1. ✅ Создать проект в Supabase
2. ✅ Настроить таблицы
3. ✅ Получить API ключи
4. ✅ Настроить переменные окружения
5. 🔄 Интегрировать с React компонентами
6. 🔄 Добавить функциональность ChatGPT API
7. 🔄 Протестировать приложение

## Полезные ссылки

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 