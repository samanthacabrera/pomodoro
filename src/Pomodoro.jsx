import { useEffect, useRef, useState } from "react";
import Drawer from "./Drawer";

export default function Pomodoro() {

  const POMODORO = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [mode, setMode] = useState("pomodoro");
  const [custom, setCustom] = useState(1);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(POMODORO);
  const [running, setRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false)
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(POMODORO);
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [finishedMode, setFinishedMode] = useState(null);

  const menuRef = useRef(null);
  const timeUpRef = useRef(null);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
          if (permission !== "granted") {
            alert("To get timer alerts, please allow notifications in your browser settings.");
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    let frame;
    const update = () => {
      if (!running || !startTime) return;
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(duration - elapsed, 0);
      setSecondsLeft(remaining);
      if (remaining > 0) {
        frame = requestAnimationFrame(update);
      } else {
        setRunning(false);
        setTimeUp(true);
        document.title = "Time's up!";
      }
    };
    if (running) {
      frame = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(frame);
  }, [running, startTime, duration]);

  useEffect(() => {
    if (secondsLeft === 0 && hasStarted) {
      setRunning(false);
      setTimeUp(true);
      setFinishedMode(mode);
      // Change tab title
      document.title = "Time's up!";
      // Browser notification
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Time's up!", {
            body: "Your session has ended",
            icon: "/pomodoro/tomato.png",
            silent: false,
          });
        } else if (Notification.permission === "default") {
          Notification.requestPermission();
        }
      }
    } else if (!timeUp) {
      document.title = "Pomodoro";
    }
  }, [secondsLeft, hasStarted, timeUp]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const toggle = () => {
    if (!running) {
      setHasStarted(true);
      setStartTime(Date.now() - (duration - secondsLeft) * 1000);
    }
    setRunning(r => !r);
  };

  const reset = () => {
    setRunning(false);
    setHasStarted(false);
    setTimeUp(false);

    let newDuration;
    if (mode === "pomodoro") newDuration = POMODORO;
    else if (mode === "short") newDuration = SHORT_BREAK;
    else if (mode === "long") newDuration = LONG_BREAK;
    else newDuration = custom * 60;

    setDuration(newDuration);
    setSecondsLeft(newDuration);
    setStartTime(null);
  };

  const changeMode = (newMode) => {
    setRunning(false);
    setHasStarted(false);
    setTimeUp(false);
    setMode(newMode);

    let newDuration;
    if (newMode === "pomodoro") newDuration = POMODORO;
    else if (newMode === "short") newDuration = SHORT_BREAK;
    else if (newMode === "long") newDuration = LONG_BREAK;
    else newDuration = custom * 60;

    setDuration(newDuration);
    setSecondsLeft(newDuration);
    setStartTime(null);
  };

  useEffect(() => {
    if (mode === "custom") {
      setDuration(custom * 60);
      setSecondsLeft(custom * 60);
    }
  }, [custom, mode]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && showCustomModal) {
      e.preventDefault();
      if (custom === "" || isNaN(custom)) {
        setCustom(1);
      }
      setSecondsLeft((custom || 1) * 60);
      setShowCustomModal(false);
    }
  };

  useEffect(() => {
    const handleShortcut = (e) => {
      if (showCustomModal) return; 
      switch (e.key) {
        case " ": 
          e.preventDefault(); 
          toggle();
          break;
        case "R":
        case "r":
          reset();
          break;
        case "P":
        case "p":
          changeMode("pomodoro");
          break;
        case "S":
        case "s":
          changeMode("short");
          break;
        case "L":
        case "l":
          changeMode("long");
          break;
        case "C":
        case "c":
          changeMode("custom");
          setShowCustomModal(true);
          break;
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [showCustomModal, toggle, reset, changeMode]);

  const totalTime =
    mode === "pomodoro"
    ? POMODORO
    : mode === "short"
    ? SHORT_BREAK
    : mode === "long"
    ? LONG_BREAK
    : custom * 60;

  const progress = secondsLeft / totalTime;

  const getTomatoColor = (progress) => {
  const stages = [
    { progress: 1, color: { r: 21, g: 128, b: 61 } },   // green-700
    { progress: 0.5, color: { r: 234, g: 88, b: 12 } }, // orange-600 
    { progress: 0, color: { r: 185, g: 28, b: 28 } },   // red-700 
  ];

  const interpolateColor = (c1, c2, factor) => {
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    return `rgb(${r},${g},${b})`;
  };

  for (let i = 0; i < stages.length - 1; i++) {
    if (progress >= stages[i + 1].progress) {
      const factor =
        (progress - stages[i + 1].progress) / (stages[i].progress - stages[i + 1].progress);
      return interpolateColor(stages[i + 1].color, stages[i].color, factor);
    }
  }

  return `rgb(185,28,28)`; 
  };
  
  const handleNextOption = (nextMode) => {
    changeMode(nextMode);
    setTimeUp(false);
    setHasStarted(false);
  };
  
  const buttonBase = `px-3 py-2 md:px-6 md:py-3 rounded-2xl font-bold text-xs md:text-base border-2 border-black transition-all duration-300 transform hover:scale-105 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] focus:outline-none`;
  const buttonActive = `bg-red-700 text-white hover:bg-red-600`;
  const buttonInactive = `bg-stone-50 text-red-700 hover:text-red-600`;

  return (
    <>
    <div className="min-h-screen bg-yellow-50 text-red-700">
      <div className="flex flex-col items-center gap-8 p-6">
        <div className="flex flex-col md:flex-row justify-between w-screen px-4">
          <div className="flex-col">
            <h1 className="text-4xl uppercase tracking-widest font-bold">Pomodoro</h1>
            <h6 className="text-xs font-medium w-fit border-b border-transparent hover:border-b hover:border-dotted hover:border-red-700 transition">Made by <a href="https://github.com/samanthacabrera">Sam Cabrera</a></h6>
          </div>
          
            {/* Modes  */}
            <div className="flex gap-4 mt-4 md:mt-0 md:mr-12">
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
                onClick={() => {
                  changeMode("custom");
                  setShowCustomModal(true);}}
                className={`${buttonBase} ${mode === "custom" ? buttonActive : buttonInactive}`}
              >
                Custom
              </button>
               {showCustomModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white rounded px-12 py-6 shadow-xl text-red-700 flex flex-col space-y-6 md:space-y-8 items-center">
                    <h3 className="text-lg font-semibold">Set Custom Time</h3>
                    <div className="flex-row space-x-4">
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={custom}
                        className="border border-red-700 rounded px-3 py-2 w-24 text-center focus:outline-none"
                        onKeyDown={handleKeyDown}
                        onBlur={() => {if (custom === "" || isNaN(custom)) { setCustom(1); }}}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              setCustom("");
                            } else {
                              const num = Math.max(1, Math.min(180, Number(val)));
                              setCustom(num);
                            }
                        }}
                      />
                      <span>minutes</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSecondsLeft(custom * 60);
                          setShowCustomModal(false);
                        }}
                        className={`${buttonBase} ${buttonActive}`}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setShowCustomModal(false)}
                        className={`${buttonBase} ${buttonInactive}`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Drawer menuOpen={menuOpen} setMenuOpen={setMenuOpen} mode={mode} timeUp={timeUp} />
        
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
          className="fixed bottom-0 left-0 h-3 md:h-4 transition-all duration-300"
          style={{
            width: `${(1 - progress) * 100}%`,
            backgroundColor: getTomatoColor(progress),
            height: running ? "20px" : "16px",
            transition: "width 1s linear, background-color 0.1s linear",
          }}
        ></div>

        {/* Controls */}
        <div className="flex gap-4">
          <button
            onClick={toggle}
            className={`${buttonBase} ${buttonInactive} `}>
            {running ? "Pause" : "Start"}
          </button>
          <button
            onClick={reset}
            className={`${buttonBase} ${buttonInactive} `}
          >
            Reset
          </button>
        </div>
      </div>
    </div> 
    
    {hasStarted && !running && (
      <div
        className="fixed inset-0 bg-black/20 pointer-events-none transition-opacity duration-300"
      ></div>
    )}
    
    {timeUp && (() => {
      let options = [];
      if (finishedMode === "pomodoro") {
        options = [
          { label: "Short Break", value: "short" },
          { label: "Long Break", value: "long" },
        ];
      } else if (finishedMode === "short" || finishedMode === "long") {
        options = [{ label: "Pomodoro", value: "pomodoro" }];
      } else { 
        options = [
          { label: "Pomodoro", value: "pomodoro" },
          { label: "Short Break", value: "short" },
          { label: "Long Break", value: "long" },
        ];
      }
      return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div 
            ref={timeUpRef}
            className="bg-white rounded px-12 py-6 shadow-xl text-red-700 flex flex-col space-y-6 md:space-y-8 items-center">
            <h3 className="text-lg font-semibold">Time's Up!</h3>
            <p className="text-center">Choose your next session:</p>
            <div className="flex gap-3">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleNextOption(opt.value)}
                  className={`${buttonBase} ${buttonActive}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    })()}
    </>
  );
}