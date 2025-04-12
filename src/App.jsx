import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Search1 = lazy(() => import("./component/Search1"));
const ChatBot = lazy(() => import("./component/ChatBot"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Search1 />} />
          <Route path="/ChatBot" element={<ChatBot />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
