import { useEffect, useState } from "react";
import Modal from "./Modal";

export default function Timer({
  secondsLeft,
  running,
  hasStarted,
  timeUp,
  toggle,
  reset,
  focusTask,
  setFocusTask,
  handleNextOption,
  options,
}) {
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  useEffect(() => {
    if (timeUp) setShowTimeUpModal(true);
  }, [timeUp]);

  const handleCloseModal = () => {
    setShowTimeUpModal(false);
  };

  useEffect(() => {
    if (!hasStarted) {
      document.title = "Tomate";
    } else {
      document.title = `${minutes}:${seconds}`;
    }
  }, [secondsLeft, hasStarted, running]);

  return (
    <div className="flex flex-col items-center">
      {/* Focus */}
      <div className="w-full max-w-sm flex flex-col items-center gap-2">
        <label className="focus-task-label text-red-700 text-sm font-medium tracking-wide select-none text-center">
          I want to focus on...
        </label>
        <input
          type="text"
          value={focusTask}
          onChange={(e) => setFocusTask(e.target.value)}
          placeholder=""
          className="focus-task-input w-full text-center bg-yellow-50 border-b-2 border-dotted border-red-700 px-2 text-black/80 font-medium text-base placeholder-black/50 focus:outline-none transition-all duration-150 caret-red-700"
        />
      </div>

      {/* Timer Display */}
      <div className="relative w-96 h-96 md:w-[45vw] md:h-[55vh] flex items-center justify-center mt-6">
        <img
          src="/pomodoro/tomato.png"
          alt="tomato"
          className="tomato-img absolute inset-0 w-full h-full object-contain"
          draggable="false"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl md:text-6xl font-bold text-white select-none mt-12">
            {minutes}:{seconds}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-6">
        <button onClick={toggle} className="button-base button-inactive">
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={reset} className="button-base button-inactive">
          Reset
        </button>
      </div>

      {/* Time's Up Modal */}
      <Modal isOpen={showTimeUpModal} onClose={handleCloseModal} title="Time's Up!">
        <p className="text-center">Choose your next session:</p>
        <div className="flex gap-3 mt-4">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                handleNextOption(opt.value);
                handleCloseModal();
              }}
              className="button-base button-active"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Modal>

      {/* Overlay when paused */}
      {hasStarted && !running && (
        <div className="fixed inset-0 bg-black/20 pointer-events-none transition-opacity duration-300 z-50"></div>
      )}
    </div>
  );
}
