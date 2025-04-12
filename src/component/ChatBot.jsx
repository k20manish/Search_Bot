import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import animationData from "../assets/142815-780943566_small.mp4";
import logo from "../assets/image.jpg";
import ReactMarkdown from "react-markdown";
 

const ChatBot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuery = location.state?.query || "";
  const [messages, setMessages] = useState(
    initialQuery
      ? [
          {
            text: initialQuery,
            type: "user",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]
      : []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [language, setLanguage] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

        if (data.recommended_question) {
          const parsedSuggestions = data.recommended_question
            .split("\n")
            .map((q) => q.replace(/^\d+\.\s*/, "").trim())
            .filter(Boolean);
          setSuggestions(parsedSuggestions);
        }
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
      setMessages([
        {
          text: initialQuery,
          type: "user",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
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

  const handleSuggestionClick = (suggestion) => {
    // Add the user's message
    setMessages((prev) => [
      ...prev,
      {
        text: suggestion,
        type: "user",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    // Directly fetch the response for the clicked suggestion
    fetchChatbotResponse(suggestion);

    // Clear the input (optional)
    setInput("");
  };

  const handleLanguage = () => {
    setShow(!show);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-black">
        {/* <Lottie
          animationData={animationData}
          loop
          autoplay
          className="w-full h-full object-cover scale-100"
        /> */}
        <video
          autoPlay
          muted
          loop
          src={animationData}
          className="w-full h-full object-cover scale-100"
        ></video>
      </div>

      <div className="flex flex-col items-center justify-center h-full opacity-100">
        <motion.div
          className="w-full max-w-lg bg-gray-300 backdrop-blur-lg shadow-lg rounded-lg overflow-hidden flex flex-col border border-gray-300"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-gray-200 text-gray-800 flex items-center p-4 border-b border-gray-300">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-700 hover:opacity-80"
            >
              <ArrowLeft className="text-black font-medium" size={24} />
            </button>
            <div className="flex items-center justify-between space-x-56 px-4 h-6">
              <h2 className="text-3xl font-bold font-title bg-gradient-to-r from-gray-500 via-gray-600 to-gray-800 text-transparent bg-clip-text drop-shadow-md">
                e-Udyami
              </h2>
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-12 rounded-full border border-white shadow-sm"
              />
            </div>
          </div>

          {/* Chat Section */}
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
                  <div className="w-8 h- rounded-full bg-gray-300 flex items-center justify-center text-xl">
                    🤖
                  </div>
                )}
                <div
                  className={`p-2 max-w-xs rounded-lg shadow-sm  ${
                    msg.type === "user"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 my-2">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      p: ({ children }) => <p className="mb-2">{children}</p>,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
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

            {/* Loading animation at the top like a bot typing */}
            {loading && (
              <motion.div
                className="flex items-start space-x-2 justify-start"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                  🤖
                </div>
                <div className="p-3 max-w-xs rounded-lg shadow-sm bg-gray-200 text-black">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions in Grid (3 per row) */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                key="suggestions"
                className="w-full px-6 pt-2 pb-5 bg-gray-100 border-t border-gray-300 "
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  💡 Recommended Questions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 h-14">
                  {suggestions.map((s, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="relative group cursor-pointer p-2 min-h-[20px] bg-white border border-gray-300 rounded-2xl shadow-md hover:bg-gray-200 transition-all duration-300"
                      onClick={() => handleSuggestionClick(s)}
                    >
                      <div className="absolute top-2 left-2 text-gray-400 text-sm">
                        💬
                      </div>
                      <div className="pl-7 text-sm text-gray-800 leading-snug tracking-tight line-clamp-2">
                        {s}
                      </div>

                      {/* Tooltip on hover */}
                      <div className="w-24 absolute left-1/2 -top-20 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-pre-line max-w-sm pointer-events-none">
                        {s}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Section */}

          <div className="flex items-center border-t p-3 bg-gray-100 space-x-2">
            {/* Input Field */}
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />

            {/* Send Button just right of input */}
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 flex items-center justify-center"
              onClick={handleSendMessage}
              disabled={loading}
            >
              <Send size={20} />
            </button>

            {/* Language Buttons on the far right */}
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage(false)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                  !language
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800 border border-gray-300"
                } hover:shadow`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage(true)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                  language
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800 border border-gray-300"
                } hover:shadow`}
              >
                HI
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatBot;
