import React, { useState, useEffect, useRef } from "react";
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

const Search1 = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [fixedAtTop, setFixedAtTop] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  const searchBoxRef = useRef(null); // Ref for detecting outside click

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <div className="relative h-screen w-full bg-white">
      <motion.div
        className="flex flex-col items-center justify-start pt-24 h-full w-full relative"
        initial={{ backgroundColor: "transparent" }}
        animate={{ backgroundColor: "white" }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          ref={searchBoxRef}
          className="absolute left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full"
          initial={{ top: "50%", width: "500px", padding: "15px" }}
          animate={{
            top: fixedAtTop ? "10%" : isFocused ? "10%" : "50%",
            width: "500px",
            padding: "15px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
        >
          <div className="relative ">
            <input
              type="text"
              className="w-full py-2 px-4 border  border-gray-300 rounded-full outline-none text-base focus:ring-2 focus:ring-gray-200 transition-all"
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
