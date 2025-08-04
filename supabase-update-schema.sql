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

-- Добавляем колонки для личных данных пользователя
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS age INTEGER DEFAULT 0;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS height INTEGER DEFAULT 0;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2) DEFAULT 0;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS target_weight DECIMAL(5,2) DEFAULT 0;

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

UPDATE users 
SET age = 0 
WHERE age IS NULL;

UPDATE users 
SET height = 0 
WHERE height IS NULL;

UPDATE users 
SET weight = 0 
WHERE weight IS NULL;

UPDATE users 
SET target_weight = 0 
WHERE target_weight IS NULL; 