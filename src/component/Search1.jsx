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
import backgroundImage from "../assets/udyami_image.jpg";
import nitishKumarImage from "../assets/cm1.png";
import Footer from "./Footer";

const Search1 = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();
  const searchBoxRef = useRef(null);

  const schemeIcons = {
    "What is Udyami Yojna?": <Lightbulb className="mr-2 text-yellow-400" />,
    "Who is eligible for Udyami Yojna?": (
      <Briefcase className="mr-2 text-green-400" />
    ),
    "उद्यामी योजना के लिए आवेदन कैसे करें?": (
      <Banknote className="mr-2 text-blue-400" />
    ),
    "उद्यामी योजना से क्या लाभ प्राप्त होते हैं?": (
      <GraduationCap className="mr-2 text-purple-400" />
    ),
    "उद्यामी योजना के बारे में अधिक जानकारी कहाँ प्राप्त करें?": (
      <Globe className="mr-2 text-teal-400" />
    ),
    "उद्यामी योजना में पीएमईजीपी की भूमिका क्या है?": (
      <Building2 className="mr-2 text-red-400" />
    ),
    "How does Udyami Yojna support digital initiatives?": (
      <Heart className="mr-2 text-pink-400" />
    ),
    "What training and mentorship opportunities does Udyami Yojna offer?": (
      <Briefcase className="mr-2 text-indigo-400" />
    ),
    "How is Udyami Yojna evaluated and ranked?": (
      <GraduationCap className="mr-2 text-orange-400" />
    ),
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
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    const index = suggestions.indexOf(suggestion);
    setSelectedIndex(index);
    setTimeout(() => {
      setQuery(suggestion);
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
    <div className="relative  w-full flex flex-col">
      <div
        className="flex h-screen w-full bg-cover "
        style={{
          backgroundImage: `linear-gradient(rgba(20,20,20,0.75), rgba(20,20,20,0.75)), url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Left Image */}
        <div className="hidden md:flex w-1/3 items-center justify-center">
          <img
            src={nitishKumarImage}
            alt="Nitish Kumar"
            className="rounded-2xl shadow-2xl max-h-[80%] object-cover"
          />
        </div>

        {/* Search Section */}
        <div className="relative flex-1">
          <motion.div
            ref={searchBoxRef}
            className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-xl"
            initial={{ top: "30%" }}
            animate={{
              top: isFocused || selectedIndex !== null ? "8%" : "40%",
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="relative w-full">
              {/* Title Text aligned left */}
              <h2 className="text-xl font-semibold text-white mb-2 ml-4">
                Search Scheme
              </h2>
              {/* input field */}
              <input
                type="text"
                className="w-full py-4 px-6 bg-white/20 text-white placeholder:text-gray-300 border border-white/30 rounded-full outline-none text-lg focus:ring-0 backdrop-blur-md transition-all"
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  onClick={() => {
                    setQuery("");
                    setIsFocused(true);
                    setSelectedIndex(null);
                  }}
                >
                  <X size={20} />
                </button>
              )}
              <AnimatePresence>
                {isFocused && suggestions.length > 0 && (
                  <motion.div
                    className="absolute w-full bg-white/90 backdrop-blur border border-gray-300 rounded-xl mt-3 shadow-xl z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-2 p-3 rounded-xl text-gray-800 bg-white hover:bg-gray-200 transition-transform hover:scale-[1.02] cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={
                          selectedIndex === index
                            ? { opacity: 0, scale: 1.1, x: 20 }
                            : { opacity: 1, scale: 1, x: 0 }
                        }
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <div className="transition-transform duration-200 hover:scale-110">
                          {schemeIcons[suggestion]}
                        </div>
                        <span>{suggestion}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Right Image */}
        <div className="hidden md:flex w-1/3 items-center justify-center">
          <img
            src={nitishKumarImage}
            alt="Nitish Kumar"
            className="rounded-2xl shadow-2xl max-h-[80%] object-cover"
          />
        </div>
      </div>

      {/* Info Section before Footer */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full px-6 py-12 bg-white">
        {/* Left Side: Question and Answer */}
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            What is Udyami Yojna?
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Udyami Yojna is a government initiative aimed at empowering aspiring
            entrepreneurs by providing financial support, mentorship, and
            training. It helps individuals start and grow their businesses,
            contributing to economic development and employment generation.
          </p>
        </div>

        {/* Right Side: Animated Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="\src\assets\Undraw_image.svg" // Example: replace with your animated GIF or Lottie
            alt="Animated Business Growth"
            className="w-80 h-80 object-contain"
          />
        </div>
      </div>

      {/* Info Section 2 */}
<div className="flex flex-col md:flex-row items-center justify-center w-full px-6 py-12 bg-gray-100">
  {/* Left: Image */}
  <div className="md:w-1/2 flex justify-center">
    <img
      src="\src\assets\Undraw_image1.svg"
      alt="Training and Mentorship"
      className="w-80 h-80 object-contain"
    />
  </div>
  {/* Right: Text */}
  <div className="md:w-1/2 mb-8 md:mb-0 md:pl-10">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">
      Training and Mentorship
    </h2>
    <p className="text-gray-600 text-lg leading-relaxed">
      The scheme also offers professional training and mentorship programs to guide entrepreneurs at every step of their journey.
    </p>
  </div>
</div>

      {/* footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Search1;
