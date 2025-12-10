import { useEffect, useRef, useState, useCallback } from "react";
import Header from "./Header";
import Drawer from "./Drawer";
import Timer from "./Timer";
import Modal from "./Modal";
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
  const [finishedMode, setFinishedMode] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); 
  const [focusTask, setFocusTask] = useState(() => {
    return localStorage.getItem("focusTask") || "";
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem("soundEnabled");
    return saved ? JSON.parse(saved) : true; 
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem("notificationsEnabled");
    return saved ? JSON.parse(saved) : true; 
  });
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false; 
  });

  const startTimeRef = useRef(null);
  const menuRef = useRef(null);
  const audioRef = useRef(null);

  const progress = secondsLeft / duration;

  const requestNotificationPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setNotificationPermission(result);
      if (result === "granted") {
        setNotificationsEnabled(true);
        localStorage.setItem("notificationsEnabled", true);
      } else {
        setNotificationsEnabled(false);
        localStorage.setItem("notificationsEnabled", false);
      }
    } catch (err) {
      console.error("Permission request failed:", err);
    }
  };

  useEffect(() => {
    const firstVisit = localStorage.getItem("askedNotificationPermission");

    if (!firstVisit && notificationsEnabled) {
      localStorage.setItem("askedNotificationPermission", "true");
      requestNotificationPermission();
    }
  }, []);

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
        if (audioRef.current && soundEnabled) {
          setTimeout(() => {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => console.log("Audio play failed:", err));
          }, 0);
        }
        if (notificationsEnabled && Notification.permission === "granted") {
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
      document.title = "tomate";
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
    if (running) {
      setRunning(false);
      startTimeRef.current = null;
      return;
    }
    setHasStarted(true);
    startTimeRef.current = Date.now() - (duration - secondsLeft) * 1000;
    setRunning(true);
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
      const newDuration = MODES[newMode];
      setMode(newMode);
      setDuration(newDuration);
      setSecondsLeft(newDuration);
      setRunning(false);
      setHasStarted(false);
      setTimeUp(false);
      startTimeRef.current = null;
    },
    []
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
          openModal("customTimer");
          break;
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen, toggle, reset, changeMode]);

  useEffect(() => {
    localStorage.setItem("focusTask", focusTask);
  }, [focusTask]);

  useEffect(() => {
    localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

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

  //  Custom Timer Modal 
  const CustomTimerModal = () => {
    const [minutes, setMinutes] = useState("1");

    const handleSubmit = (e) => {
      e.preventDefault();
      let mins = Number(minutes);
        if (isNaN(mins) || mins < 1) mins = 1;
        if (mins > 60) mins = 60;
      const secs = Math.max(1, minutes) * 60;
      setDuration(secs);
      setSecondsLeft(secs);
      setMode("custom"); 
      setRunning(false);
      setHasStarted(false);
      setTimeUp(false);
      startTimeRef.current = null;
      closeModal();
    };

    return (
      <Modal
        isOpen={activeModal === "customTimer"}
        onClose={closeModal}
        title="Custom Timer"
      >
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <label className="text-sm font-medium">
            Minutes:
              <input
                type="number"
                min="1"
                max="60"
                step="1"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="no-spinner border border-red-700 rounded px-2 py-1 ml-2 w-20 text-center"
              />
          </label>

          <button type="submit" className="button-base button-active w-full">
            Set Timer
          </button>
        </form>
      </Modal>
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden text-red-700">
      <audio ref={audioRef} src="/pomodoro/kitchen-timer.mp3" preload="auto" />
      <div className="flex flex-col items-center gap-8 p-6">
        <Header mode={mode} changeMode={changeMode} activeModal={activeModal} openModal={openModal} closeModal={closeModal} setDuration={setDuration} />
        <CustomTimerModal />
        <Drawer menuOpen={menuOpen} setMenuOpen={setMenuOpen} running={running} timeUp={timeUp} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled} notificationPermission={notificationPermission} requestNotificationPermission={requestNotificationPermission} darkMode={darkMode} setDarkMode={setDarkMode}/>
        <Timer secondsLeft={secondsLeft} running={running} hasStarted={hasStarted} timeUp={timeUp} toggle={toggle} reset={reset} focusTask={focusTask} setFocusTask={setFocusTask} handleNextOption={handleNextOption} options={options} />
        <ProgressBar progress={progress} running={running} />
      </div>
    </div>
  );
}
