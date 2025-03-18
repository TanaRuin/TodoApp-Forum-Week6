import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import TodoPage from "./pages/TodoPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-16">
  <Routes>
    <Route path="/" element={<AuthPage />} />
    <Route path="/todo" element={<TodoPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Routes>
</div>

    </Router>
  );
};

export default App;


