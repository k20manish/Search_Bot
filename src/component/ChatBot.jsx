import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ChatBot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuery = location.state?.query || "";
  const [messages, setMessages] = useState(
    initialQuery ? [{ text: initialQuery, type: "user" }] : []
  );
  const [input, setInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to fetch chatbot response
  const fetchChatbotResponse = useCallback(async (query) => {
    if (!query.trim()) return;

    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("https://website-2n5i.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, type: "bot" }]);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Chatbot Error:", error);
        setMessages((prev) => [...prev, { text: "Error fetching response.", type: "bot" }]);
      }
    }

    setLoading(false);
  }, []);

  // Automatically send initial query if available
  useEffect(() => {
    if (initialQuery) {
      fetchChatbotResponse(initialQuery);
    }
  }, [initialQuery, fetchChatbotResponse]);

  // Function to send user message
  const handleSendMessage = useCallback(() => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, type: "user" }]);
    fetchChatbotResponse(input);
    setInput("");
  }, [input, fetchChatbotResponse]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* Chat Container */}
      <motion.div
        className="w-full max-w-lg bg-gray-50 shadow-lg rounded-lg overflow-hidden flex flex-col border border-gray-300"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="bg-gray-200 text-gray-800 flex items-center p-4 border-b border-gray-300">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:opacity-80">
            <ArrowLeft size={24} />
          </button>
          <h2 className="ml-4 text-xl font-semibold">Chatbot</h2>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-white space-y-3">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`p-3 max-w-xs rounded-lg shadow-sm ${
                msg.type === "user"
                  ? "bg-gray-800 text-white self-end ml-auto"
                  : "bg-gray-200 text-black self-start"
              }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {msg.text}
            </motion.div>
          ))}
          {loading && <p className="text-gray-500 text-center">Typing...</p>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex border-t p-3 bg-gray-100">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="bg-gray-800 text-white px-6 rounded-r-lg hover:bg-gray-900 flex items-center justify-center"
            onClick={handleSendMessage}
            disabled={loading}
          >
            <Send size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatBot;
