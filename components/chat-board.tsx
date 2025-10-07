'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Plus, MessageSquare, Phone, ChevronDown } from 'lucide-react';
import Image from 'next/image';

// Global window type extension
declare global {
  interface Window {
    chatBoardInstance?: boolean;
  }
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface ChatBoardProps {
  isOpen?: boolean;
  onToggle?: () => void;
  isMicrophoneActive?: boolean;
  onMicrophoneToggle?: () => void;
}

export default function ChatBoard({ 
  isOpen: externalIsOpen, 
  onToggle, 
  isMicrophoneActive = false, 
  onMicrophoneToggle 
}: ChatBoardProps = {}) {
  const [isOpen, setIsOpen] = useState(externalIsOpen ?? true); // Sayfa açılınca otomatik aç
  const [mounted, setMounted] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [isSpeechMode, setIsSpeechMode] = useState(false);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // External isOpen prop'unu dinle
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  // Global state kontrolü - sadece bir ChatBoard instance'ı olsun
  useEffect(() => {
    console.log('ChatBoard useEffect çalışıyor - mounted:', mounted);
    if (typeof window !== 'undefined') {
      if (window.chatBoardInstance) {
        console.log('Zaten bir ChatBoard instance var, bu component render edilmeyecek');
        return; // Zaten bir instance var, bu component'i render etme
      }
      window.chatBoardInstance = true;
      console.log('ChatBoard instance oluşturuldu');
    }
    setMounted(true);
  }, []);

  // Speech Recognition initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      try {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'tr-TR';
        recognition.continuous = false; // Tek seferlik tanıma
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        
        recognition.onstart = () => {
          setIsRecording(true);
          console.log('Speech recognition started');
        };
        
        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            setInputMessage(finalTranscript);
            // Otomatik olarak mesajı gönder
            sendMessage(finalTranscript);
          } else {
            setInputMessage(interimTranscript);
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setIsSpeechMode(false);
          
          // Kullanıcıya hata mesajı göster
          if (event.error === 'not-allowed') {
            alert('Mikrofon erişimi reddedildi. Lütfen tarayıcı ayarlarından mikrofon iznini verin.');
          } else if (event.error === 'no-speech') {
            console.log('Konuşma algılanamadı');
          } else if (event.error === 'audio-capture') {
            alert('Mikrofon bulunamadı. Lütfen mikrofonunuzun bağlı olduğundan emin olun.');
          }
        };
        
        recognition.onend = () => {
          setIsRecording(false);
          setIsSpeechMode(false);
          console.log('Speech recognition ended');
        };
        
        setSpeechRecognition(recognition);
      } catch (error) {
        console.error('Speech recognition initialization error:', error);
      }
    } else {
      console.log('Speech recognition not supported in this browser');
    }
  }, []);

  // WebSocket connection for real-time audio - Disabled for now
  useEffect(() => {
    // WebSocket bağlantısı şimdilik devre dışı
    // Production'da WebSocket server gerekli
    console.log('WebSocket connection disabled for production compatibility');
  }, [currentSession]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Yeni Sohbet',
      messages: [],
      createdAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    };

    // Update current session
    const updatedSession = {
      ...currentSession!,
      messages: [...currentSession!.messages, userMessage]
    };
    setCurrentSession(updatedSession);
    setSessions(prev => 
      prev.map(s => s.id === currentSession!.id ? updatedSession : s)
    );

    setInputMessage('');
    setIsLoading(true);

    try {
      // Call Gemini API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API hatası: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        audioUrl: data.audioUrl
      };

      // TTS özelliği şimdilik devre dışı - gerçek TTS implementasyonu gerekli
      // if (!data.audioUrl && data.response) {
      //   try {
      //     const ttsResponse = await fetch('/api/tts', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify({ text: data.response })
      //     });
      //     
      //     if (ttsResponse.ok) {
      //       const ttsData = await ttsResponse.json();
      //       assistantMessage.audioUrl = ttsData.audioUrl;
      //     }
      //   } catch (ttsError) {
      //     console.error('TTS error:', ttsError);
      //   }
      // }

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage]
      };
      
      setCurrentSession(finalSession);
      setSessions(prev => 
        prev.map(s => s.id === currentSession!.id ? finalSession : s)
      );

    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      const errorSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, errorMessage]
      };
      
      setCurrentSession(errorSession);
      setSessions(prev => 
        prev.map(s => s.id === currentSession!.id ? errorSession : s)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current && audioUrl) {
      try {
        audioRef.current.src = audioUrl;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            console.log('Audio playback started');
          })
          .catch((error) => {
            console.error('Audio playback error:', error);
            alert('Ses çalarken bir hata oluştu.');
          });
      } catch (error) {
        console.error('Audio setup error:', error);
        alert('Ses dosyası yüklenirken bir hata oluştu.');
      }
    } else {
      console.log('Audio URL not available or audio element not found');
      alert('Ses dosyası bulunamadı.');
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        console.log('Audio playback stopped');
      } catch (error) {
        console.error('Audio stop error:', error);
      }
    }
  };

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.();
  };

  const toggleSpeechMode = () => {
    if (!speechRecognition) {
      console.log('Speech recognition not available');
      alert('Bu tarayıcıda sesli konuşma özelliği desteklenmiyor.');
      return;
    }

    try {
      if (isRecording) {
        speechRecognition.stop();
        setIsSpeechMode(false);
        console.log('Speech recognition stopped');
      } else {
        speechRecognition.start();
        setIsSpeechMode(true);
        console.log('Speech recognition started');
      }
    } catch (error) {
      console.error('Speech recognition toggle error:', error);
      alert('Sesli konuşma başlatılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const sendAudioToWebSocket = async (audioBlob: Blob) => {
    // WebSocket özelliği şimdilik devre dışı
    console.log('WebSocket audio sending disabled for production compatibility');
    
    // Gelecekte gerçek WebSocket implementasyonu için:
    // if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    //   console.log('WebSocket not connected');
    //   return;
    // }
    // 
    // try {
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     const audioData = reader.result as string;
    //     const sessionId = currentSession?.id || 'default';
    //     
    //     websocket.send(JSON.stringify({
    //       audioData: audioData,
    //       sessionId: sessionId
    //     }));
    //   };
    //   reader.readAsDataURL(audioBlob);
    // } catch (error) {
    //   console.error('Audio send error:', error);
    // }
  };

  // Mount kontrolü - tüm hook'lar çağrıldıktan sonra
  if (!mounted) return null;

  return (
    <div id="chat-board-container">
      {/* Chat Board */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="absolute right-8 bottom-4 h-[680px] w-[340px] bg-white shadow-2xl rounded-t-3xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Büyük Resim - Kapatma butonu ile - Sabit boyut */}
                <div className="w-full h-68 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                  <Image
                    src="/chat.jpg"
                    alt="AI Asistan"
                    width={376}
                    height={376}
                    className="w-[95%] h-[95%] object-cover rounded-lg"
                  />
                  {/* Kapatma butonu - Resmin üst sağ köşesinde */}
                  <button
                    onClick={handleToggle}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-300 backdrop-blur-sm"
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Chat Content */}
                <div className="flex-1 flex flex-col min-h-0">
                  {currentSession ? (
                    <>
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
                        {currentSession.messages.map((message) => (
                          <motion.div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {message.role === 'assistant' && (
                              <div className="w-10 h-10 overflow-hidden rounded-lg flex-shrink-0">
                                <Image
                                  src="/chat.jpg"
                                  alt="AI Asistan"
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            
                            <div className={`max-w-xs px-3 py-2 rounded-xl text-xs ${
                              message.role === 'user'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-xs leading-relaxed">{message.content}</p>
                              
                              {message.audioUrl && message.role === 'assistant' && (
                                <div className="mt-2 flex gap-2">
                                  <button
                                    onClick={() => isPlaying ? stopAudio() : playAudio(message.audioUrl!)}
                                    className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded flex items-center gap-1"
                                  >
                                    {isPlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                    {isPlaying ? 'Durdur' : 'Dinle'}
                                  </button>
                                </div>
                              )}
                            </div>

                            {message.role === 'user' && (
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-gray-600" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                        
                        {isLoading && (
                          <motion.div
                            className="flex gap-3 justify-start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="w-10 h-10 overflow-hidden rounded-lg">
                              <Image
                                src="/chat.jpg"
                                alt="AI Asistan"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-xl">
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input Area - Sabit boyut */}
                      <div className="p-2 border-t border-gray-200 bg-white flex-shrink-0">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              placeholder={isRecording ? "Dinliyorum..." : "Sesli veya yazılı görüşme başlatın..."}
                              className="w-full bg-gray-100 text-gray-900 px-3 py-2 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500 text-xs"
                              disabled={isLoading}
                            />
                            {isRecording && (
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              </div>
                            )}
                          </div>
                          
                          <button
                            type="button"
                            onClick={toggleSpeechMode}
                            className={`p-2 rounded-xl transition-all duration-300 ${
                              isRecording 
                                ? 'bg-red-500 text-white hover:bg-red-600' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                            title={isRecording ? 'Sesli konuşmayı durdur' : 'Sesli konuşma başlat'}
                          >
                            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </button>
                          
                          <button
                            type="submit"
                            disabled={!inputMessage.trim() || isLoading}
                            className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Asistanınız Hazır</h3>
                      <p className="text-gray-500 mb-6 text-center text-sm">Merhaba, ben AI asistanınız. Size nasıl yardımcı olabilirim?</p>
                      <button
                        onClick={createNewSession}
                        className="bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center gap-2 text-sm"
                      >
                        <Phone className="w-5 h-5" />
                        Başlat
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer - Sabit boyut */}
                <div className="p-2 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                  <p className="text-xs text-gray-500 text-center">🚀 Powered by MesTech Sync - AI Revolution</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Audio element error:', e);
          setIsPlaying(false);
        }}
        onLoadStart={() => console.log('Audio loading started')}
        onCanPlay={() => console.log('Audio can play')}
        className="hidden"
        preload="none"
      />
    </div>
  );
}