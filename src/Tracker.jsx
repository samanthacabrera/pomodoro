import { useState, useEffect } from "react";

export default function Tracker({ currentMode, onNextMode, timeUp }) {
  const FLOW = [
    "pomodoro",
    "short",
    "pomodoro",
    "short",
    "pomodoro",
    "short",
    "pomodoro",
    "long",
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [counts, setCounts] = useState({
    pomodoro: 0,
    short: 0,
    long: 0,
  });

  useEffect(() => {
    if (timeUp) {
      setCounts((prev) => ({
        ...prev,
        [currentMode]: (prev[currentMode] || 0) + 1,
      }));
      const nextStep = (stepIndex + 1) % FLOW.length;
      setStepIndex(nextStep);
      const nextMode = FLOW[nextStep];
      onNextMode(nextMode);
    }
  }, [timeUp]);

  useEffect(() => {
    const idx = FLOW.indexOf(currentMode);
    if (idx !== -1) setStepIndex(idx);
  }, [currentMode]);

  const currentStep = FLOW[stepIndex];
  const nextStep = FLOW[(stepIndex + 1) % FLOW.length];

  const handleResetTracker = () => {
    setCounts({ pomodoro: 0, short: 0, long: 0 });
    setStepIndex(0);
  };

  return (
    <div>
      <h2>Session Tracker</h2>

      <div className="flex space-x-4">
        <div>
          <p>Pomodoros</p>
          <p>{counts.pomodoro}</p>
        </div>
        <div>
          <p>Short Breaks</p>
          <p>{counts.short}</p>
        </div>
        <div>
          <p>Long Breaks</p>
          <p>{counts.long}</p>
        </div>
      </div>

      <div>
        <p>
          Current Session: <span>{currentStep}</span>
        </p>
        <p>
          Next Session: <span>{nextStep}</span>
        </p>
      </div>

          <button
              onClick={handleResetTracker}
              className="border border-red-700 rounded p-1 hover:bg-red-700 hover:text-yellow-50 transiton-all"
          >Reset Tracker</button>
    </div>
  );
}
