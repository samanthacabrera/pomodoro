import { useEffect, useRef, useState } from "react";

export default function App() {
  const POMODORO = 25 * 60;
  const [secondsLeft, setSecondsLeft] = useState(POMODORO);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }

    if (!running && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const toggle = () => setRunning((r) => !r);
  const reset = () => {
    setRunning(false);
    setSecondsLeft(POMODORO);
  };

  return (
    <div className="min-h-screen bg-orange-950 text-orange-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8 p-6">
        <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-orange-800 flex items-center justify-center shadow-2xl">
          <div className="text-center">
            <div className="text-6xl md:text-8xl font-extrabold tabular-nums text-orange-50">{minutes}:{seconds}</div>
            <div className="mt-2 text-sm uppercase tracking-widest text-orange-300">Pomodoro</div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={toggle}
            className="px-6 py-3 rounded-md bg-orange-400 text-orange-950 font-semibold shadow hover:scale-105 transition-transform">
            {running ? "Pause" : "Start"}
          </button>

          <button
            onClick={reset}
            className="px-6 py-3 rounded-md bg-transparent border border-orange-600 text-sm text-orange-300 hover:bg-orange-900 transition">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}