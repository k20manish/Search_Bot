export default function Search1() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setChat([...chat, { text: message, sender: "user" }]);
    setMessage("");
  
    try {
      const response = await fetch("https://website-2n5i.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });
  
      const data = await response.json();
  
      setChat((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setChat((prev) => [...prev, { text: "Error getting response.", sender: "bot" }]);
    }
  };
}