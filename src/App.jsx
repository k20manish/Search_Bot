import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
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
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [fixedAtTop, setFixedAtTop] = useState(false);
  const [responseText, setResponseText] = useState("");
  const inputRef = useRef(null);

  const schemeIcons = {
    "Startup India": <Lightbulb className="mr-2 text-yellow-500" />,
    "Standup India": <Briefcase className="mr-2 text-green-500" />,
    "Mudra Loan": <Banknote className="mr-2 text-blue-500" />,
    "Skill India": <GraduationCap className="mr-2 text-purple-500" />,
    "Digital India": <Globe className="mr-2 text-teal-500" />,
    "Make in India": <Building2 className="mr-2 text-red-500" />,
    "Ayushman Bharat": <Heart className="mr-2 text-pink-500" />,
    PMEGP: <Briefcase className="mr-2 text-indigo-500" />,
    "NIRF Ranking": <GraduationCap className="mr-2 text-orange-500" />,
  };

  const allSchemes = Object.keys(schemeIcons);

  useEffect(() => {
    if (!isFocused) return;
    if (query.trim() === "") {
      setSuggestions(allSchemes);
      setShowSuggestions(true);
    } else {
      const filtered = allSchemes.filter((scheme) =>
        scheme.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    }
  }, [query, isFocused]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("https://website-2n5i.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (data.response) {
        setResponseText(data.response);
      } else {
        setResponseText("No response found.");
      }

      setShowSuggestions(false);
      setFixedAtTop(true); // ✅ Fix input at the top after search
    } catch (error) {
      console.error("Search Error:", error);
      setResponseText("Error fetching response.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-100">
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg transition-all"
        initial={{ top: "50%", width: "600px", padding: "25px" }} // ✅ Bigger width from start
        animate={{
          top: fixedAtTop ? "10%" : isFocused ? "10%" : "50%",
          width: "600px", // ✅ Always big from the start
          padding: "25px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
        }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      >
        <div className="relative w-full" ref={inputRef}>
          <motion.input
            type="text"
            className="w-full p-4 pl-12 pr-12 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-100 transition-all text-lg"
            placeholder="Search for a scheme..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
              setFixedAtTop(true); // ✅ Fix position at top when focused
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            transition={{ duration: 0.1 }}
          />

          <Search
            size={24}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600"
            onClick={handleSearch}
          />

          {query && (
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setQuery("");
                setSuggestions(allSchemes);
                setShowSuggestions(true);
                setResponseText("");
              }}
            >
              <X size={24} />
            </button>
          )}

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                className="absolute left-0 w-full bg-white border border-gray-300 rounded-md mt-2 shadow-md z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 text-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setQuery(suggestion);
                      setShowSuggestions(false);
                      setFixedAtTop(true); // ✅ Stay fixed after selecting
                      handleSearch();
                    }}
                  >
                    {schemeIcons[suggestion]} {/* ✅ Unique Icon */}
                    {suggestion}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {responseText && (
            <motion.div
              className="mt-4 p-4 bg-gray-200 rounded-lg shadow-md text-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <strong>Response:</strong> {responseText}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Search1;
