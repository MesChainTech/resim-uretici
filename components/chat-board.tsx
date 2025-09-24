'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Plus, MessageSquare, Phone, ChevronDown } from 'lucide-react';
import Image from 'next/image';

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

export default function ChatBoard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

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
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Sadece kapalıyken göster */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

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
              className="absolute right-8 bottom-20 h-[668px] w-[380px] bg-white shadow-2xl rounded-t-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Büyük Resim - Header'ın üstünde - Sabit boyut */}
                <div className="w-full h-84 overflow-hidden flex-shrink-0">
                  <Image
                    src="/chat.jpg"
                    alt="AI Asistan"
                    width={512}
                    height={512}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Header - Sabit boyut */}
                <div className="flex items-center justify-between p-2 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 overflow-hidden rounded-lg">
                      <Image
                        src="/chat.jpg"
                        alt="AI Asistan"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-xs">AI Asistan</h3>
                      <p className="text-xs text-gray-500">Her zaman burada</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-600" />
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
                              placeholder="Sesli veya yazılı görüşme başlatın..."
                              className="w-full bg-gray-100 text-gray-900 px-3 py-2 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500 text-xs"
                              disabled={isLoading}
                            />
                          </div>
                          
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
                  <p className="text-xs text-gray-500 text-center">Powered by Axe Resim Üretici</p>
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
        className="hidden"
      />
    </>
  );
}