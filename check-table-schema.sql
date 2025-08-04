-- Проверяем структуру таблицы users
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Проверяем данные пользователей
SELECT 
    id,
    telegram_id,
    first_name,
    age,
    height,
    weight,
    target_weight,
    target_calories,
    target_protein,
    target_fat,
    target_carbs,
    settings
FROM users 
LIMIT 5; 