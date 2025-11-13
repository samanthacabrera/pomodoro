import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Pomodoro from "./Pomodoro";
import Legal from "./Legal";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/pomodoro/" element={<Pomodoro />} />
        <Route path="/pomodoro/legal" element={<Legal />} />
      </Routes>
    </Router>
  );
}
