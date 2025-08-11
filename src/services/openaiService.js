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
            content: `Ты - эксперт по питанию. Анализируй описание еды и возвращай точные данные о питательной ценности в формате JSON:
            {
              "calories": число,
              "protein": число,
              "fat": число,
              "carbs": число,
              "recommendations": "текст рекомендаций"
            }
            
            Будь максимально точным в расчетах. Учитывай размер порции, способ приготовления.`
          },
          {
            role: 'user',
            content: `Проанализируй эту еду: ${foodDescription}`
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
    
    // Обновляем счетчики использования
    const estimatedCost = 0.02; // Примерная стоимость одного анализа
    updateAIUsage(data.usage?.total_tokens || 500, estimatedCost);
    
    // Парсим JSON ответ
    const nutritionData = JSON.parse(content);
    
    return nutritionData;
  } catch (error) {
    console.error('Ошибка OpenAI API:', error);
    throw error;
  }
}; 