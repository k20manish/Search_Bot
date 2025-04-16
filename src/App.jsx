import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search1 from "./component/Search1";
import ChatBot from "./component/ChatBot";
 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Search1 />} />
        <Route path="/ChatBot" element={<ChatBot />} />
      </Routes>
    </Router>

    
     
  );
}

export default App;

 