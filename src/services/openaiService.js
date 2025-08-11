import { AI_SETTINGS, updateAIUsage } from '../config/aiSettings';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const analyzeFoodWithOpenAI = async (foodDescription) => {
  try {
    const response = await fetch(OPENAI_API_URL, {
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
            content: `Ты - эксперт по питанию. Твоя задача - анализировать еду и возвращать ТОЛЬКО JSON без дополнительного текста.

ПРАВИЛА:
1. Отвечай ТОЛЬКО в формате JSON
2. НЕ добавляй никаких пояснений на русском языке
3. НЕ используй markdown или другие форматы
4. Всегда начинай ответ с { и заканчивай }

ФОРМАТ ОТВЕТА (строго):
{
  "calories": число,
  "protein": число,
  "fat": число,
  "carbs": число,
  "recommendations": "текст рекомендаций на русском языке"
}

ПРИМЕРЫ:
Ввод: "куриная грудка 200г"
Ответ: {"calories": 330, "protein": 62, "fat": 7.2, "carbs": 0, "recommendations": "Отличный источник белка! Рекомендую добавить овощи для клетчатки."}

Ввод: "яблоко среднее"
Ответ: {"calories": 95, "protein": 0.5, "fat": 0.3, "carbs": 25, "recommendations": "Хороший перекус! Содержит пектин и витамины."}

ВАЖНО: Отвечай ТОЛЬКО JSON, никакого другого текста!

НЕПРАВИЛЬНО:
"Данная еда содержит много белка. Вот анализ: {"calories": 300}"

ПРАВИЛЬНО:
{"calories": 300, "protein": 50, "fat": 10, "carbs": 20, "recommendations": "Хороший источник белка!"}`
          },
          {
            role: 'user',
            content: `Проанализируй эту еду: ${foodDescription}

ВАЖНО: Отвечай ТОЛЬКО в формате JSON, никакого другого текста!`
          }
        ],
        temperature: AI_SETTINGS.TEMPERATURE,
        max_tokens: AI_SETTINGS.MAX_TOKENS
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('🔍 Ответ от GPT:', content);
    
    // Обновляем счетчики использования
    const estimatedCost = 0.02; // Примерная стоимость одного анализа
    updateAIUsage(data.usage?.total_tokens || 500, estimatedCost);
    
    // Парсим JSON ответ
    try {
      const nutritionData = JSON.parse(content);
      console.log('✅ JSON успешно распарсен:', nutritionData);
      return nutritionData;
    } catch (parseError) {
      console.error('❌ Ошибка парсинга JSON:', parseError);
      console.error('❌ Полученный контент:', content);
      
      // Попробуем очистить контент от лишних символов
      const cleanedContent = content.trim();
      if (cleanedContent.startsWith('{') && cleanedContent.endsWith('}')) {
        try {
          const nutritionData = JSON.parse(cleanedContent);
          console.log('✅ JSON успешно распарсен после очистки:', nutritionData);
          return nutritionData;
        } catch (secondError) {
          throw new Error(`GPT вернул невалидный JSON: ${content}`);
        }
      } else {
        throw new Error(`GPT вернул не JSON формат: ${content}`);
      }
    }
  } catch (error) {
    console.error('Ошибка OpenAI API:', error);
    throw error;
  }
}; 