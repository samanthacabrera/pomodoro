import { useEffect, useRef, useState } from "react";

export default function App() {

  const POMODORO = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [mode, setMode] = useState("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(POMODORO);
  const [running, setRunning] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const intervalRef = useRef(null);
  const drawerRef = useRef(null);

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

  useEffect(() => {
  function handleClickOutside(event) {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setDrawerOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const toggle = () => setRunning((r) => !r);

  const reset = () => {
    setRunning(false);
    if (mode === "pomodoro") setSecondsLeft(POMODORO);
    else if (mode === "short") setSecondsLeft(SHORT_BREAK);
    else setSecondsLeft(LONG_BREAK);
  };

  const changeMode = (newMode) => {
    setRunning(false);
    setMode(newMode);
    if (newMode === "pomodoro") setSecondsLeft(POMODORO);
    else if (newMode === "short") setSecondsLeft(SHORT_BREAK);
    else setSecondsLeft(LONG_BREAK);
  };

  const totalTime =
    mode === "pomodoro" ? POMODORO :
    mode === "short" ? SHORT_BREAK : LONG_BREAK;

  const progress = secondsLeft / totalTime;

  const buttonBase = `px-6 py-3 rounded-2xl font-bold text-sm md:text-base border-2 border-black transition-all duration-300 transform hover:scale-105 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] focus:outline-none`;
  const buttonActive = `bg-red-700 text-white hover:bg-red-600`;
  const buttonInactive = `bg-stone-50 text-red-700 hover:text-red-600`;

  return (
    <>
    <div className="min-h-screen bg-yellow-50 text-red-700 flex items-center justify-center overflow-x-hidden">
      <div className="flex flex-col items-center gap-8 p-6">
        <div className="flex flex-col md:flex-row justify-between w-screen px-4">
          <div className="flex-col">
            <h1 className="text-4xl uppercase tracking-widest font-bold">Pomodoro</h1>
            <h6 className="text-xs font-medium hover:text-red-600 transition">Made by <a href="https://github.com/samanthacabrera">Sam Cabrera</a></h6>
          </div>
          
            {/* Modes  */}
            <div className="flex gap-4 mt-4 md:mt-0">
              <button
                onClick={() => changeMode("pomodoro")}
                className={`${buttonBase} ${mode === "pomodoro" ? buttonActive : buttonInactive}`}
              >
                Pomodoro
              </button>
              <button
                onClick={() => changeMode("short")}
                className={`${buttonBase} ${mode === "short" ? buttonActive : buttonInactive}`}
              >
                Short Break
              </button>
              <button
                onClick={() => changeMode("long")}
                className={`${buttonBase} ${mode === "long" ? buttonActive : buttonInactive}`}
              >
                Long Break
              </button>
              <button
                onClick={() => setDrawerOpen(true)}
                className={`${buttonBase} ${buttonInactive}`}
              >
                + To-Do 
              </button>
            </div>
        </div>

        {/* Timer */}
        <div className="relative w-96 h-96 md:w-[45vw] md:h-[55vh] flex items-center justify-center">
          <img
            src="/pomodoro/tomato.png"
            alt="tomato"
            className="absolute inset-0 w-full h-full object-contain"
            draggable="false"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="mt-12 text-center">
              <div className="text-4xl md:text-6xl font-medium text-white">
                {minutes}:{seconds}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className="fixed bottom-0 left-0 h-3 md:h-4 bg-red-700 transition-all duration-300"
          style={{
            width: `${(1 - progress) * 100}%`,
            transition: "width 1s linear, background-color 0.1s linear",
            filter: `hue-rotate(${120 * progress}deg) saturate(105%)`,
            height: running ? "20px" : "16px",
          }}
        >
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <button
            onClick={toggle}
            className={`${buttonBase} ${running ? buttonActive : buttonInactive} `}>
            {running ? "Pause" : "Start"}
          </button>

          <button
            onClick={reset}
            className={`${buttonBase} ${buttonActive} `}
          >
            Reset
          </button>
        </div>

        {/* Info */}
        <div className="px-4 text-center transition-all duration-500">
        <button
          onClick={() => setShowDesc((s) => !s)}
          className="text-sm"
        >
        {showDesc ? "Hide info ▲" : "Show info ▼"}
        </button>
          <p
            className={`text-justify ${
              showDesc ? "opacity-100 visible" : "opacity-0 invisible"
            } transition-opacity duration-500`}
          >
            The Pomodoro Technique is a time management method created by Francesco Cirillo back in the 1980s. The idea is to help you stay focused by splitting your work into short, manageable chunks. A session is 25 minutes of focused work followed by a 5-minute break. Each of these sessions is
            called a Pomodoro (Italian for “tomato”), inspired by the tomato-shaped kitchen timer Cirillo used when he first came up with the system. After you’ve done four Pomodoros, you take a longer break of about 15 minutes to rest and reset.
          </p>
        </div>
      </div>
    </div>
    
    {/* To-Do List  */}
      <div
        ref={drawerRef}
        className={`fixed top-1/2 -translate-y-1/2 right-0 h-auto max-h-full w-80 transform transition-transform duration-300 border border-yellow-100 rounded shadow-lg ${
          drawerOpen ? "translate-x-0 rotate-1" : "translate-x-full"
        } flex flex-col p-4 z-50`}
        style={{
          backgroundColor: "#FFF9C4", 
        }}
      >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-red-700 text-xl uppercase tracking-widest font-bold">
          To-Do List
        </h2>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
          className="flex-1 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-700 rounded-sm"
        />
        <button
          onClick={() => {
            if (newTask.trim() === "") return;
            setTasks([...tasks, newTask.trim()]);
            setNewTask("");
          }}
          className="h-8 w-8 rounded-full bg-red-700 text-white"
        >
          +
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto space-y-2">
        {tasks.map((t, i) => (
          <li
            key={i}
            className="flex justify-between px-2 py-1"
            style={{
              borderBottom: "1px dashed rgba(0,0,0,0.2)",
            }}
          >
            <span>{t}</span>
            <button
              onClick={() => setTasks(tasks.filter((_, index) => index !== i))}
              className="hover:scale-110 transition ml-2"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}