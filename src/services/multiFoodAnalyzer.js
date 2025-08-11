import { analyzeFoodWithOpenAI } from './openaiService';
import { AI_SETTINGS } from '../config/aiSettings';

// Функция для анализа нескольких продуктов в одном сообщении
export const analyzeMultipleFoods = async (foodDescription) => {
  try {
    console.log('🔍 Анализируем несколько продуктов:', foodDescription);
    
    // Разбиваем описание на отдельные продукты
    const products = splitFoodDescription(foodDescription);
    console.log('📝 Разделено на продукты:', products);
    
    if (products.length === 1) {
      // Если только один продукт, используем обычный анализ
      console.log('✅ Один продукт, используем обычный анализ');
      return await analyzeFoodWithOpenAI(foodDescription);
    }
    
    // Анализируем каждый продукт отдельно с улучшенными названиями
    console.log('🔄 Анализируем каждый продукт отдельно...');
    const productAnalyses = [];
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i].trim();
      if (product) {
        try {
          console.log(`📊 Анализируем продукт ${i + 1}: ${product}`);
          const analysis = await analyzeFoodWithOpenAI(product);
          
          // Получаем улучшенное название от GPT
          const improvedName = await getImprovedProductName(product, analysis);
          
          productAnalyses.push({
            originalProduct: product, // Оригинальное название пользователя
            product: improvedName,    // Улучшенное название от GPT
            analysis: analysis
          });
        } catch (error) {
          console.error(`❌ Ошибка анализа продукта "${product}":`, error);
          // Добавляем базовую оценку для проблемного продукта
          productAnalyses.push({
            originalProduct: product,
            product: formatProductName(product), // Используем базовое форматирование
            analysis: {
              calories: 100,
              protein: 5,
              fat: 3,
              carbs: 15,
              recommendations: 'Не удалось проанализировать продукт'
            },
            error: true
          });
        }
      }
    }
    
    // Вычисляем общую сумму
    const totalAnalysis = calculateTotalNutrition(productAnalyses);
    
    // Формируем итоговый результат
    const result = {
      products: productAnalyses,
      total: totalAnalysis,
      recommendations: generateOverallRecommendations(totalAnalysis, productAnalyses.length)
    };
    
    console.log('✅ Анализ нескольких продуктов завершен:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Ошибка анализа нескольких продуктов:', error);
    throw error;
  }
};

// Функция для разделения описания еды на отдельные продукты
const splitFoodDescription = (description) => {
  // Разделяем по запятым, точкам с запятой, "и", "с", "плюс"
  const separators = /[,;]|\s+и\s+|\s+с\s+|\s+плюс\s+/i;
  
  if (!separators.test(description)) {
    // Если нет разделителей, считаем одним продуктом
    return [description];
  }
  
  // Разделяем по всем возможным разделителям
  let products = description.split(separators);
  
  // Очищаем от пустых строк и лишних пробелов
  products = products
    .map(product => product.trim())
    .filter(product => product.length > 0);
  
  // Если получилось только один продукт, возможно разделитель был частью названия
  if (products.length === 1) {
    // Пробуем разделить по "и" более точно
    const andSplit = description.split(/\s+и\s+/i);
    if (andSplit.length > 1) {
      products = andSplit
        .map(product => product.trim())
        .filter(product => product.length > 0);
    }
  }
  
  return products;
};

// Функция для вычисления общей питательной ценности
const calculateTotalNutrition = (productAnalyses) => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;
  
  productAnalyses.forEach(({ analysis }) => {
    totalCalories += analysis.calories || 0;
    totalProtein += analysis.protein || 0;
    totalFat += analysis.fat || 0;
    totalCarbs += analysis.carbs || 0;
  });
  
  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10, // Округляем до 1 знака после запятой
    fat: Math.round(totalFat * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10
  };
};

// Функция для генерации общих рекомендаций
const generateOverallRecommendations = (totalNutrition, productCount) => {
  let recommendations = '';
  
  if (productCount === 1) {
    recommendations = 'Один продукт проанализирован.';
  } else {
    recommendations = `${productCount} продуктов проанализировано. `;
  }
  
  // Анализируем общую питательную ценность
  if (totalNutrition.calories < 200) {
    recommendations += 'Это легкий прием пищи. Рекомендую добавить больше белка для насыщения.';
  } else if (totalNutrition.calories > 600) {
    recommendations += 'Это довольно калорийный прием пищи. Учитывайте это в общем дневном балансе.';
  } else {
    recommendations += 'Хорошо сбалансированный прием пищи. Продолжайте в том же духе!';
  }
  
  if (totalNutrition.protein < 15) {
    recommendations += ' Рекомендую добавить больше белковых продуктов.';
  }
  
  return recommendations;
};

// Функция для получения улучшенного названия продукта от GPT
const getImprovedProductName = async (originalName, nutritionData) => {
  try {
    // Если у нас есть данные о питательной ценности, используем их для лучшего определения
    const prompt = `Определи точное название продукта на основе описания пользователя.

ОПИСАНИЕ ПОЛЬЗОВАТЕЛЯ: "${originalName}"

ПРАВИЛА:
1. Верни ТОЛЬКО название продукта, никаких пояснений
2. Используй стандартные названия продуктов
3. Укажи размер порции, если он важен
4. Будь конкретным и понятным

ПРИМЕРЫ:
"куриная грудка 200г" → "Куриная грудка (200г)"
"яблоко среднее" → "Яблоко среднее"
"рис белый вареный" → "Рис белый вареный"
"салат овощной с помидорами" → "Салат овощной с помидорами"
"какая-то еда" → "Неопределенный продукт"

ВАЖНО: Отвечай ТОЛЬКО названием продукта, никакого другого текста!`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_SETTINGS.OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'Ты - эксперт по названиям продуктов питания. Твоя задача - давать точные и понятные названия продуктов.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1, // Низкая температура для более предсказуемых ответов
        max_tokens: 50    // Минимум токенов для названия
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const improvedName = data.choices[0].message.content.trim();
    
    console.log(`🔄 Улучшено название: "${originalName}" → "${improvedName}"`);
    return improvedName;
    
  } catch (error) {
    console.error('❌ Ошибка получения улучшенного названия:', error);
    // Возвращаем базовое форматирование в случае ошибки
    return formatProductName(originalName);
  }
};

// Функция для форматирования названия продукта
export const formatProductName = (product) => {
  // Убираем лишние пробелы и приводим к читаемому виду
  return product
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^\w/, c => c.toUpperCase()); // Первая буква заглавная
}; 