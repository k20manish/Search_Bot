import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Lightbulb,
  Briefcase,
  Banknote,
  GraduationCap,
  Heart,
  Globe,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 🔮 Animated Background Component
const AnimatedBackground = () => {
  const orbs = Array.from({ length: 6 });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {orbs.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-60 h-60 bg-gradient-to-br from-purple-500 to-blue-500 opacity-30 rounded-full blur-3xl"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0.8 + Math.random() * 0.4,
          }}
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 20 + Math.random() * 10,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const Search1 = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [fixedAtTop, setFixedAtTop] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  const schemeIcons = {
    "What is Udyami Yojna?": <Lightbulb className="mr-2 text-yellow-500" />,
    "Who is eligible for Udyami Yojna?": <Briefcase className="mr-2 text-green-500" />,
    "उद्यामी योजना के लिए आवेदन कैसे करें?": <Banknote className="mr-2 text-blue-500" />,
    "उद्यामी योजना से क्या लाभ प्राप्त होते हैं?": <GraduationCap className="mr-2 text-purple-500" />,
    "उद्यामी योजना के बारे में अधिक जानकारी कहाँ प्राप्त करें?": <Globe className="mr-2 text-teal-500" />,
    "उद्यामी योजना में पीएमईजीपी की भूमिका क्या है?": <Building2 className="mr-2 text-red-500" />,
    "How does Udyami Yojna support digital initiatives?": <Heart className="mr-2 text-pink-500" />,
    "What training and mentorship opportunities does Udyami Yojna offer?": <Briefcase className="mr-2 text-indigo-500" />,
    "How is Udyami Yojna evaluated and ranked?": <GraduationCap className="mr-2 text-orange-500" />,
  };

  const allSchemes = Object.keys(schemeIcons);

  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions(allSchemes);
    } else {
      const filtered = allSchemes.filter((scheme) =>
        scheme.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    }
  }, [query]);

  const handleSuggestionClick = (suggestion) => {
    const index = suggestions.indexOf(suggestion);
    setSelectedIndex(index);
    setTimeout(() => {
      setQuery(suggestion);
      setFixedAtTop(true);
      setIsFocused(false);
      navigate("/chatbot", { state: { query: suggestion } });
    }, 400);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate("/chatbot", { state: { query } });
    }
  };

  const showFancyBackground = isFocused || fixedAtTop;

  return (
    <div
      className={`relative h-screen w-full overflow-hidden transition-colors duration-700 ease-in-out ${
        showFancyBackground
          ? "bg-gradient-to-br from-[#f8fafc] via-[#e0f2fe] to-[#f0fdfa]"
          : "bg-black"
      }`}
    >
      {!showFancyBackground && <AnimatedBackground />}

      {showFancyBackground && (
        <>
          <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-200 rounded-full filter blur-3xl opacity-40 z-0"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-green-200 rounded-full filter blur-3xl opacity-40 z-0"></div>
        </>
      )}

      <motion.div
        className="flex flex-col items-center justify-start pt-24 h-full w-full z-10 relative transition-colors"
        initial={{ backgroundColor: "transparent" }}
        animate={{ backgroundColor: showFancyBackground ? "white" : "transparent" }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full transition-all"
          initial={{ top: "50%", width: "500px", padding: "15px" }}
          animate={{
            top: fixedAtTop ? "10%" : isFocused ? "10%" : "50%",
            width: "500px",
            padding: "15px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
          }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
        >
          <div className="relative">
            <input
              type="text"
              className="w-full py-2 px-4 border border-gray-300 rounded-full outline-none text-base focus:ring-2 focus:ring-gray-200 transition-all"
              placeholder="Search for a scheme..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setSelectedIndex(null);
              }}
              onKeyDown={handleKeyPress}
            />
            {query && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setQuery("");
                  setIsFocused(true);
                  setFixedAtTop(false);
                  setSelectedIndex(null);
                }}
              >
                <X size={20} />
              </button>
            )}
            <AnimatePresence>
              {isFocused && suggestions.length > 0 && (
                <motion.div
                  className="absolute w-full bg-white border border-gray-300 rounded-md mt-2 shadow-md z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center p-3 text-base hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                      initial={{ opacity: 1, scale: 1 }}
                      animate={
                        selectedIndex === index
                          ? { opacity: 0, scale: 1.1, x: 20 }
                          : { opacity: 1, scale: 1, x: 0 }
                      }
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      {schemeIcons[suggestion]}
                      {suggestion}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Search1;
