import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceInput = ({ onVoiceResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [accumulatedText, setAccumulatedText] = useState('');
  const [isRestarting, setIsRestarting] = useState(false);
  const recognitionRef = useRef(null);

  // Проверяем поддержку распознавания речи
  const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (hasSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ru-RU';
      
      recognitionRef.current.onstart = () => {
        console.log('Распознавание началось');
        setIsRestarting(false);
      };
      
      recognitionRef.current.onresult = (event) => {
        console.log('Получен результат распознавания:', event);
        
        // Получаем последний результат
        const lastResult = event.results[event.results.length - 1];
        const transcript = lastResult[0].transcript;
        const isFinal = lastResult.isFinal;
        
        console.log('Извлеченный текст:', transcript, 'Финальный:', isFinal);
        
        // Обрабатываем только финальные результаты
        if (isFinal) {
          setIsRestarting(false); // Сбрасываем флаг перезапуска
          processTranscript(transcript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Ошибка распознавания:', event.error);
        setIsRecording(false);
        setIsProcessing(false);
      };
      
      recognitionRef.current.onend = () => {
        console.log('Распознавание завершено');
        // При continuous = true onend не должен срабатывать во время записи
        // Если сработал, значит что-то пошло не так
        if (isRecording) {
          console.log('Неожиданное завершение записи, пытаемся перезапустить...');
          try {
            setIsRestarting(true);
            recognitionRef.current.start();
          } catch (error) {
            console.error('Ошибка перезапуска записи:', error);
            setIsRestarting(false);
          }
        }
      };
    }
  }, []);

  const startRecording = () => {
    console.log('Начинаем запись...');
    if (hasSpeechRecognition && recognitionRef.current) {
      try {
        // Очищаем накопленный текст при начале новой записи
        setAccumulatedText('');
        recognitionRef.current.start();
        setIsRecording(true);
        setIsProcessing(true);
        console.log('Запись начата');
      } catch (error) {
        console.error('Ошибка начала записи:', error);
      }
    } else {
      console.log('Распознавание речи не поддерживается');
    }
  };

  const stopRecording = () => {
    console.log('Останавливаем запись...');
    console.log('Накопленный текст перед остановкой:', accumulatedText);
    
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsProcessing(false);
      
      // Передаем накопленный текст только при остановке записи
      if (accumulatedText.trim()) {
        console.log('Передаем накопленный текст:', accumulatedText.trim());
        onVoiceResult({
          description: accumulatedText.trim()
        });
        // Очищаем накопленный текст
        setAccumulatedText('');
      } else {
        console.log('Накопленный текст пустой');
      }
    } else {
      console.log('Запись не активна или распознавание недоступно');
    }
  };

  const processTranscript = (transcript) => {
    console.log('Распознанный текст:', transcript);
    
    // Накопляем текст вместо немедленной передачи
    setAccumulatedText(prev => {
      const newText = prev + ' ' + transcript;
      console.log('Накопленный текст:', newText);
      
      // Ограничиваем длину текста (например, 1000 символов)
      if (newText.length > 1000) {
        console.log('Достигнут лимит текста (1000 символов)');
        return newText.substring(0, 1000) + '...';
      }
      
      return newText;
    });
    
    // Не останавливаем запись, только убираем индикатор обработки
    setIsProcessing(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem'
    }}>
      {/* Большая кнопка микрофона */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1,
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
              transform: isProcessing ? 'scale(0.95)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isProcessing) {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
              }
            }}
            title="Нажмите для голосового ввода"
          >
            <Mic 
              className="w-8 h-8 voice-icon-white" 
            />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
              animation: 'pulse 1.5s infinite'
            }}
            title="Остановить запись"
          >
            <MicOff 
              className="w-8 h-8 voice-icon-white" 
            />
          </button>
        )}
        

      </div>
      
      {/* Индикатор записи */}
      {isRecording && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          background: '#dcfce7',
          borderRadius: '0.5rem',
          border: '1px solid #22c55e'
        }}>
          <div style={{
            width: '0.75rem',
            height: '0.75rem',
            borderRadius: '50%',
            background: isRestarting ? '#fbbf24' : '#ef4444',
            animation: 'pulse 1s infinite'
          }} />
          <span style={{
            fontSize: '0.875rem',
            color: '#166534',
            fontWeight: '500'
          }}>
            {isRestarting ? 'Перезапуск...' : 'Записываю... Говорите!'}
          </span>
          {accumulatedText && (
            <span style={{
              fontSize: '0.75rem',
              color: '#166534',
              marginLeft: 'auto'
            }}>
              {accumulatedText.length} символов
            </span>
          )}
        </div>
      )}


    </div>
  );
};

export default VoiceInput; 