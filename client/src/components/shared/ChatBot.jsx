import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import chatService from '../../services/chatService';

function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Namaste! I'm Herbie. Ask me anything about our medicinal plants!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setInput('');
        setLoading(true);

        try {
            const response = await chatService.sendMessage(userMessage);
            setMessages(prev => [...prev, { text: response.data.reply, sender: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I couldn't reach the server.", sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
                    isOpen 
                    ? 'bg-red-500 rotate-90' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 animate-bounce-slow'
                } text-white`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 animate-slide-up h-[500px]">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-white">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">HillHerbs Assistant</h3>
                                <div className="flex items-center text-emerald-100 text-xs">
                                    {/* <Sparkles className="h-3 w-3 mr-1" /> */}
                                    {/* <span>AI Powered</span> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                        msg.sender === 'user'
                                            ? 'bg-emerald-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                                    <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about plants..."
                                className="flex-1 p-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default ChatBot;