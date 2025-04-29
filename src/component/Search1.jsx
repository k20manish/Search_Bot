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
import nitishMishra from "../assets/Nitish_Mishra1.png";
import Footer from "./Footer";
import Header from "./Header";

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
      {/* header section */}
      <Header />
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
                Udyami Scheme
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
            src={nitishMishra}
            alt="Nitish Mishra"
            className="rounded-2xl shadow-2xl max-h-[35%] object-cover"
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
            The <span className="font-semibold">Udyami Yojana</span>, also known
            as the{" "}
            <span className="font-semibold">
              Prime Minister’s Employment Generation Programme (PMEGP)
            </span>{" "}
            or sometimes referred to under various state-level "Mukhyamantri
            Udyami Yojana", is a government initiative aimed at promoting
            entrepreneurship, especially among youth and marginalized sections
            of society. The specifics can vary depending on whether you're
            referring to the{" "}
            <span className="font-semibold">central scheme</span> or a{" "}
            <span className="font-semibold">state-specific version</span>.
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
            मुख्यमंत्री उद्यमी एवंलघुउद्यमी योजनाए
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            <p className="text-gray-500">
              <span className="font-semibold text-gray-800">1. परिचय</span>: यह दस्तावेज़
              विभिन्न मुख्यमंत्री उद्यमी योजनाओं एवंबिहार लघुउद्यमी योजना
              सेसम्बंधित नीतियों, उद्देश्यों, कार्यप्रणाली, और प्रशिक्षण
              प्रक्रियाओं की जानकारी को सुव्यवस्थित रूप मेंप्रस्तुत करता है।
              इसका उद्देश्य नीति निर्धारकों, कार्यान्वयन अधिकारियों
              एवंप्रशिक्षणार्थियों केलिए एक स्पष्ट संदर्भसामग्री उपलब्ध कराना
              है।
            </p>
            <p className="text-gray-600 mt-1">
              <span className="font-semibold text-gray-800">
                2. योजना के उद्देश्य एवंआवश्यकता
              </span>{" "}
              <p className="font-semibold text-gray-700">2.1. उद्देश्य :</p>{" "}
              <ul>
                <li>• राज्य मेंसूक्ष्म एवंलघुउद्योगों को बढ़ावा देना</li>
                <li>• उद्योग स्थापनाओं मेंअर्हता पैदा करना</li>
                <li>• स्व-रोजगार का सृजन करना</li>
              </ul>
            </p>
            <p className="mt-1 text-gray-600">
              <span className="font-semibold ">2.2. योजना की आवश्यकता</span>:{" "}
              <ul>
                <li className="ml-2">• बैंक द्वारा ऋण उपलब्ध करानेके बदलेप्रितभूत एवंमाजिरन मनी की मांग को पूरा करना
                </li>
                <li className="ml-2">
                • उद्यमियों को वित्तीय सहायता एवंप्रशिक्षण प्रदान कर उद्यमशीलता की क्षमता को बढ़ाना.
                </li>
                
              </ul>
            </p>
            <p className="mt-1 text-gray-600">
              <span className="font-semibold text-gray-800">3. मुख्य योजना अवयव एवंवित्तीय सहायता</span>:  <p>मुख्यमंत्री उद्यमी योजनाएँकु ल पाँच अवयवों मेंविभाजित हैं:</p>
              <ul>
                <li>1. अनुसूचित जात एवंअनुसूचित जनजात उद्यमी योजना</li>
                <li>2. अति पिछड़ा उद्यमी योजना</li>
                <li>3. युवा उद्यमी योजना</li>
                <li>5. अल्पसंख्यक उद्यमी योजना</li>
              </ul>
            </p>
 
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
