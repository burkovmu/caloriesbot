import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

const VoiceInput = ({ onVoiceResult }) => {
  const { showAlert } = useTelegram();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  // Проверяем поддержку распознавания речи
  const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (hasSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ru-RU';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        processTranscript(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Ошибка распознавания:', event.error);
        showAlert('Ошибка распознавания речи. Попробуйте текстовый ввод.');
        setIsRecording(false);
        setIsProcessing(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const startRecording = () => {
    if (hasSpeechRecognition && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setIsProcessing(true);
        showAlert('🎤 Говорите...');
      } catch (error) {
        console.error('Ошибка начала записи:', error);
        showAlert('Ошибка начала записи');
      }
    } else {
      showAlert('Распознавание речи не поддерживается в вашем браузере.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const processTranscript = (transcript) => {
    console.log('Распознанный текст:', transcript);
    
    // Просто передаем распознанный текст в текстовое поле
    onVoiceResult({
      description: transcript
    });
    
    setIsProcessing(false);
    showAlert('✅ Голосовое сообщение распознано!');
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
        
        {/* Индикатор обработки */}
        {isProcessing && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: '#fef3c7',
            borderRadius: '0.5rem',
            border: '1px solid #fbbf24'
          }}>
            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
            <span style={{
              fontSize: '0.875rem',
              color: '#92400e',
              fontWeight: '500'
            }}>
              Распознаю голосовое сообщение...
            </span>
          </div>
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
            background: '#ef4444',
            animation: 'pulse 1s infinite'
          }} />
          <span style={{
            fontSize: '0.875rem',
            color: '#166534',
            fontWeight: '500'
          }}>
            Записываю... Говорите!
          </span>
        </div>
      )}


    </div>
  );
};

export default VoiceInput; 