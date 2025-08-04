-- Добавляем колонку settings в таблицу users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';

-- Добавляем колонку для целей пользователя
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS target_calories INTEGER DEFAULT 2000;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS target_protein INTEGER DEFAULT 150;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS target_fat INTEGER DEFAULT 65;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS target_carbs INTEGER DEFAULT 250;

-- Обновляем существующие записи с дефолтными значениями
UPDATE users 
SET settings = '{}' 
WHERE settings IS NULL;

UPDATE users 
SET target_calories = 2000 
WHERE target_calories IS NULL;

UPDATE users 
SET target_protein = 150 
WHERE target_protein IS NULL;

UPDATE users 
SET target_fat = 65 
WHERE target_fat IS NULL;

UPDATE users 
SET target_carbs = 250 
WHERE target_carbs IS NULL; 