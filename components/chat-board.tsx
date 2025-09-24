'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Plus, MessageSquare } from 'lucide-react';

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
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Board */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-full max-w-4xl bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-full">
                {/* Sol Panel - Chat Sessions */}
                <div className="w-80 bg-gray-800/50 backdrop-blur border-r border-gray-700/50 flex flex-col">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-700/50">
                    <h2 className="text-xl font-bold text-white mb-4">AI Asistan</h2>
                    <button
                      onClick={createNewSession}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                    >
                      <Plus className="w-5 h-5" />
                      Yeni Sohbet
                    </button>
                  </div>

                  {/* Sessions List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => setCurrentSession(session)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          currentSession?.id === session.id
                            ? 'bg-blue-500/20 border border-blue-500/50'
                            : 'bg-gray-700/30 hover:bg-gray-700/50'
                        }`}
                      >
                        <h3 className="text-white font-medium truncate">{session.title}</h3>
                        <p className="text-gray-400 text-sm">
                          {session.messages.length} mesaj
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sağ Panel - Chat Area */}
                <div className="flex-1 flex flex-col">
                  {currentSession ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-700/50 bg-gray-800/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">AI Asistan</h3>
                            <p className="text-gray-400 text-sm">Her zaman burada</p>
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {currentSession.messages.map((message) => (
                          <motion.div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {message.role === 'assistant' && (
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                              </div>
                            )}
                            
                            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-gray-700/50 text-gray-100'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              
                              {message.audioUrl && message.role === 'assistant' && (
                                <div className="mt-2 flex gap-2">
                                  <button
                                    onClick={() => isPlaying ? stopAudio() : playAudio(message.audioUrl!)}
                                    className="text-xs bg-gray-600/50 hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1"
                                  >
                                    {isPlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                    {isPlaying ? 'Durdur' : 'Dinle'}
                                  </button>
                                </div>
                              )}
                            </div>

                            {message.role === 'user' && (
                              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
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
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-gray-700/50 text-gray-100 px-4 py-3 rounded-2xl">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input Area */}
                      <div className="p-4 border-t border-gray-700/50 bg-gray-800/30">
                        <form onSubmit={handleSubmit} className="flex gap-3">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              placeholder="Mesajınızı yazın..."
                              className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-blue-500/50 focus:outline-none"
                              disabled={isLoading}
                            />
                          </div>
                          
                          <button
                            type="submit"
                            disabled={!inputMessage.trim() || isLoading}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">AI Asistanınız Hazır</h3>
                        <p className="text-gray-400 mb-6">Yeni bir sohbet başlatın ve sorularınızı sorun</p>
                        <button
                          onClick={createNewSession}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                          Sohbet Başlat
                        </button>
                      </div>
                    </div>
                  )}
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
