import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Legal from "./Legal";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/pomodoro/" element={<Home />} />
        <Route path="/pomodoro/legal" element={<Legal />} />
      </Routes>
    </Router>
  );
}
