import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Send, Sparkles, Minimize2 } from 'lucide-react';
import api from '../utils/axios';
import { getFallbackResponse, getGreetingFallback } from '../utils/assistantFallback';
import { useAuth } from '../hooks/useAuth';
import { AssistantOption, AssistantResponse, ChatMessage } from '../types';

const formatMessage = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part.split('\n').map((line, j, arr) => (
      <React.Fragment key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  });
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 rounded-full bg-indigo-400"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      loadGreeting();
    }
  }, [isOpen, hasGreeted, user]);

  const addAssistantMessage = (response: AssistantResponse) => {
    const msg: ChatMessage = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      content: response.message,
      options: response.options,
      action: response.action,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const loadGreeting = async () => {
    setIsTyping(true);
    try {
      const { data } = await api.get('/assistant/greeting');
      addAssistantMessage(data);
      setHasGreeted(true);
    } catch {
      addAssistantMessage(getGreetingFallback(user?.name));
      setHasGreeted(true);
    } finally {
      setIsTyping(false);
    }
  };

  const sendToAssistant = useCallback(
    async (payload: { message?: string; optionId?: string }) => {
      setIsTyping(true);
      try {
        const { data } = await api.post<AssistantResponse>('/assistant/chat', payload);
        await new Promise((r) => setTimeout(r, 400));
        addAssistantMessage(data);
      } catch {
        const fallback = getFallbackResponse(payload.optionId, payload.message);
        if (fallback) {
          addAssistantMessage(fallback);
        } else {
          addAssistantMessage({
            message: "Sorry, I'm having trouble connecting right now. Please try again or contact support@servify.com.",
            options: [{ id: 'contact_support', label: 'Contact support' }],
            action: null,
          });
        }
      } finally {
        setIsTyping(false);
      }
    },
    []
  );

  const handleSend = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', content: trimmed, timestamp: new Date() },
    ]);
    setInput('');
    await sendToAssistant({ message: trimmed });
  };

  const handleOptionClick = async (option: AssistantOption) => {
    if (isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', content: option.label, timestamp: new Date() },
    ]);
    await sendToAssistant({ optionId: option.id });
  };

  const handleAction = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setHasGreeted(false);
    setInput('');
  };

  const lastBotMessage = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9998] flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
            aria-label="Open AI Assistant"
          >
            <span className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping" />
            <Bot className="w-5 h-5 relative" />
            <span className="relative text-sm font-medium hidden sm:inline">Help</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[9998] w-[calc(100vw-2rem)] sm:w-[380px] h-[min(600px,calc(100vh-3rem))] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-[#0f0c29]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Servify Assistant</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors text-xs"
                  title="New chat"
                >
                  New
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setIsOpen(false); resetChat(); }}
                  className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
                        : 'bg-white/5 border border-white/10 text-white/80 rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Options */}
            {lastBotMessage?.options && lastBotMessage.options.length > 0 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {lastBotMessage.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className="text-xs px-3 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400/60 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {/* Action link */}
            {lastBotMessage?.action && !isTyping && (
              <div className="px-4 pb-2">
                <button
                  onClick={() => handleAction(lastBotMessage.action!.path)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  Go to {lastBotMessage.action.path.replace('/', '').replace('provider/', 'provider ')} →
                </button>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question..."
                  disabled={isTyping}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-white/20 text-center mt-2">
                {user ? `Signed in as ${user.name}` : 'Ask anything about Servify services'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
