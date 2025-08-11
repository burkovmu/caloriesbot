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

-- Добавляем колонку для отображаемого имени
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Пользователь';

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

-- Обновление схемы базы данных для добавления поля recommendations
-- Добавляем поле recommendations в таблицу food_entries

ALTER TABLE food_entries 
ADD COLUMN IF NOT EXISTS recommendations TEXT;

-- Добавляем поле для хранения дополнительных деталей анализа
ALTER TABLE food_entries 
ADD COLUMN IF NOT EXISTS analysis_details JSONB;

-- Добавляем поле для хранения оригинального описания пользователя
ALTER TABLE food_entries 
ADD COLUMN IF NOT EXISTS original_description TEXT;

-- Создаем индекс для поиска по рекомендациям
CREATE INDEX IF NOT EXISTS idx_food_entries_recommendations ON food_entries USING GIN (recommendations);

-- Создаем индекс для поиска по деталям анализа
CREATE INDEX IF NOT EXISTS idx_food_entries_analysis_details ON food_entries USING GIN (analysis_details);

-- Обновляем существующие записи, устанавливая пустые значения для новых полей
UPDATE food_entries 
SET recommendations = '', 
    analysis_details = '{}', 
    original_description = food_name 
WHERE recommendations IS NULL;

-- Комментарии к новым полям
COMMENT ON COLUMN food_entries.recommendations IS 'Рекомендации от GPT по питанию';
COMMENT ON COLUMN food_entries.analysis_details IS 'Дополнительные детали анализа в формате JSON';
COMMENT ON COLUMN food_entries.original_description IS 'Оригинальное описание продукта от пользователя'; 