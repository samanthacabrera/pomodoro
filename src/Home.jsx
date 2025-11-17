import { useEffect, useRef, useState, useCallback } from "react";
import Header from "./Header";
import Drawer from "./Drawer";
import Timer from "./Timer";
import ProgressBar from "./Progress";

export const POMODORO = 25 * 60;
export const SHORT_BREAK = 5 * 60;
export const LONG_BREAK = 15 * 60;

export const MODES = {
  pomodoro: POMODORO,
  short: SHORT_BREAK,
  long: LONG_BREAK,
};

export default function Home() {
  const [mode, setMode] = useState("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(POMODORO);
  const [duration, setDuration] = useState(POMODORO);
  const [running, setRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [focusTask, setFocusTask] = useState("");
  const [finishedMode, setFinishedMode] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [custom, setCustom] = useState(1);
  const [pendingCustom, setPendingCustom] = useState(custom);
  const [activeModal, setActiveModal] = useState(null); 

  const startTimeRef = useRef(null);
  const menuRef = useRef(null);

  const progress = secondsLeft / duration;

  useEffect(() => {
    if (!running) return;

    if (!startTimeRef.current) startTimeRef.current = Date.now() - (duration - secondsLeft) * 1000;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(duration - elapsed, 0);
      setSecondsLeft(remaining);

      if (remaining === 0) {
        setRunning(false);
        setTimeUp(true);
        setFinishedMode(mode);
        startTimeRef.current = null;

        if (Notification.permission === "granted") {
          new Notification("Time's up!", {
            icon: "/pomodoro/tomato.png",
            body: "Take a break or start your next session.",
            requireInteraction: true,
          });
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [running, duration, mode]);

  useEffect(() => {
    if (!hasStarted) {
      document.title = "Tomate";
    } else if (timeUp) {
      document.title = "Time's up!";
    } else {
      const m = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
      const s = String(secondsLeft % 60).padStart(2, "0");
      document.title = `${m}:${s}`;
    }
  }, [secondsLeft, hasStarted, timeUp]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
  };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcuts
  const toggle = useCallback(() => {
    if (!running) setHasStarted(true);
    if (!startTimeRef.current) startTimeRef.current = Date.now() - (duration - secondsLeft) * 1000;
    setRunning((r) => !r);
  }, [running, duration, secondsLeft]);

  const reset = useCallback(() => {
    setRunning(false);
    setTimeUp(false);
    startTimeRef.current = null;
    setSecondsLeft(duration);
    setHasStarted(false);
  }, [duration]);

  const changeMode = useCallback(
    (newMode) => {
      const newDuration = MODES[newMode] ?? custom * 60;
      setMode(newMode);
      setDuration(newDuration);
      setSecondsLeft(newDuration);
      setRunning(false);
      setHasStarted(false);
      setTimeUp(false);
      startTimeRef.current = null;
    },
    [custom]
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (menuOpen) return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          toggle();
          break;
        case "r":
          reset();
          break;
        case "f":
          changeMode("pomodoro");
          break;
        case "s":
          changeMode("short");
          break;
        case "l":
          changeMode("long");
          break;
        case "c":
          changeMode("custom");
          openModal("custom");
          break;
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen, toggle, reset, changeMode]);

  // Next option after timeUp
  const handleNextOption = (nextMode) => {
    changeMode(nextMode);
    setTimeUp(false);
  };

  let options = [];
  if (finishedMode === "pomodoro") options = [{ label: "Short Break", value: "short" }, { label: "Long Break", value: "long" }];
  else if (finishedMode === "short" || finishedMode === "long") options = [{ label: "Pomodoro", value: "pomodoro" }];
  else options = [{ label: "Pomodoro", value: "pomodoro" }, { label: "Short Break", value: "short" }, { label: "Long Break", value: "long" }];

  // Modal helper funcs
  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="h-screen w-screen overflow-hidden bg-yellow-50 text-red-700">
      <div className="flex flex-col items-center gap-8 p-6">
        <Header mode={mode} changeMode={changeMode} activeModal={activeModal} openModal={openModal} closeModal={closeModal} pendingCustom={pendingCustom} setPendingCustom={setPendingCustom} setCustom={setCustom} setDuration={setDuration} />
        <Drawer menuOpen={menuOpen} setMenuOpen={setMenuOpen} running={running} custom={custom} timeUp={timeUp} />
        <Timer secondsLeft={secondsLeft} running={running} hasStarted={hasStarted} timeUp={timeUp} toggle={toggle} reset={reset} focusTask={focusTask} setFocusTask={setFocusTask} handleNextOption={handleNextOption} options={options} />
        <ProgressBar progress={progress} running={running} />
      </div>
    </div>
  );
}
