# Инструкция по обновлению базы данных

## Обновление схемы для отображения подробной информации о продуктах

### Что добавлено

1. **Поле `recommendations`** - для хранения рекомендаций от GPT
2. **Поле `analysis_details`** - для хранения деталей анализа в формате JSON
3. **Поле `original_description`** - для хранения оригинального описания пользователя

### Как применить обновления

#### Вариант 1: Через Supabase Dashboard

1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в раздел "SQL Editor"
4. Выполните следующий SQL код:

```sql
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
```

#### Вариант 2: Через файл supabase-update-schema.sql

1. Скопируйте содержимое файла `supabase-update-schema.sql`
2. Вставьте в SQL Editor в Supabase Dashboard
3. Выполните код

### Что изменилось в приложении

1. **Сохранение продуктов**: Теперь каждый продукт сохраняется с дополнительными данными от GPT
2. **Отображение в "Сегодня съели"**: Показываются рекомендации и детали анализа
3. **Отображение в истории**: Также показываются все дополнительные данные
4. **Множественные продукты**: Каждый продукт из множественного анализа сохраняется отдельно

### Проверка обновлений

После применения обновлений:

1. Добавьте новый продукт через приложение
2. Проверьте, что в базе данных появились новые поля
3. Убедитесь, что в интерфейсе отображаются рекомендации от GPT
4. Проверьте отображение в секциях "Сегодня съели" и "История"

### Возможные проблемы

1. **Ошибка "column does not exist"** - убедитесь, что SQL выполнился успешно
2. **Пустые поля** - новые поля будут пустыми для старых записей
3. **Ошибки отображения** - проверьте, что приложение перезапущено

### Откат изменений

Если нужно откатить изменения:

```sql
-- Удаляем новые поля
ALTER TABLE food_entries DROP COLUMN IF EXISTS recommendations;
ALTER TABLE food_entries DROP COLUMN IF EXISTS analysis_details;
ALTER TABLE food_entries DROP COLUMN IF EXISTS original_description;

-- Удаляем индексы
DROP INDEX IF EXISTS idx_food_entries_recommendations;
DROP INDEX IF EXISTS idx_food_entries_analysis_details;
``` 