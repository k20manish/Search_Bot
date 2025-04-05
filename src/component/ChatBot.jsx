import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "../assets/animation2.json";
import logo from "../assets/image.jpg";

const ChatBot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuery = location.state?.query || "";
  const [messages, setMessages] = useState(
    initialQuery
      ? [{ text: initialQuery, type: "user", timestamp: new Date().toLocaleTimeString() }]
      : []
  );
  const [input, setInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || "");

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatbotResponse = useCallback(
    async (query) => {
      if (!query.trim()) return;
      setLoading(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(
          "https://chatbot-final-hvuc.onrender.com/chat",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: query, user_id: userId }),
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (!userId) {
          setUserId(data.user_id);
          localStorage.setItem("user_id", data.user_id);
        }

        setMessages((prev) => [
          ...prev,
          {
            text: data.response,
            type: "bot",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Chatbot Error:", error);
          setMessages((prev) => [
            ...prev,
            {
              text: "Error fetching response.",
              type: "bot",
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      }

      setLoading(false);
    },
    [userId]
  );

  useEffect(() => {
    if (initialQuery) {
      fetchChatbotResponse(initialQuery);
    }
  }, [initialQuery, fetchChatbotResponse]);

  const handleSendMessage = useCallback(() => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { text: input, type: "user", timestamp: new Date().toLocaleTimeString() },
    ]);
    fetchChatbotResponse(input);
    setInput("");
  }, [input, fetchChatbotResponse]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* 🌌 Background Animation */}
      <div className="fixed inset-0 -z-10 bg-black ">
        <Lottie
          animationData={animationData}
          loop
          autoplay
          className="w-full h-full object-cover scale-100"
        />
      </div>

      {/* Chat UI */}
      <div className="flex flex-col items-center justify-center h-full opacity-100">
        <motion.div
          className="w-full max-w-lg bg-white/80 backdrop-blur-lg shadow-lg rounded-lg overflow-hidden flex flex-col border border-gray-300"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="bg-gray-200 text-gray-800 flex items-center p-4 border-b border-gray-300">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-700 hover:opacity-80"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center justify-between space-x-56 px-4">
              <h2 className="text-3xl font-bold font-title bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text drop-shadow-md">
                e-Udyami
              </h2>
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-12 rounded-full border border-white shadow-sm"
              />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`flex items-start space-x-2 ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {msg.type === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                    🤖
                  </div>
                )}
                <div
                  className={`p-3 max-w-xs rounded-lg shadow-sm ${
                    msg.type === "user"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-400 text-right mt-1">
                    {msg.timestamp}
                  </p>
                </div>
                {msg.type === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl">
                    🙋‍♂️
                  </div>
                )}
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
    </div>
  );
};

export default ChatBot;
