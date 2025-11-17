import { useEffect, useRef } from "react";

export default function Timer({ secondsLeft, running, hasStarted, timeUp, toggle, reset, focusTask, setFocusTask, handleNextOption, options }) {
  const timeUpRef = useRef(null);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  useEffect(() => {
    if (!hasStarted) {
      document.title = "Tomate";
    } else if (!running) {
      document.title = `${minutes}:${seconds}`;
    } else {
      document.title = `${minutes}:${seconds}`;
    }
  }, [secondsLeft, hasStarted, running]);

  return (
    <div className="flex flex-col items-center">
      {/* Focus */}
      <div className="w-full max-w-sm flex flex-col items-center gap-2">
        <label className="text-red-700 text-sm font-medium tracking-wide select-none text-center">
          I want to focus on...
        </label>
        <input
          type="text"
          value={focusTask}
          onChange={(e) => setFocusTask(e.target.value)}
          placeholder=""
          className="w-full text-center bg-yellow-50 border-b-2 border-dotted border-red-700 px-2 text-black/90 font-medium text-base placeholder-black/50 focus:outline-none hover:translate-y-0.5 transition-all duration-150 caret-red-700"
        />
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
            <div className="text-4xl md:text-6xl font-medium text-white select-none">
              {minutes}:{seconds}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={toggle}
          className="button-base button-inactive"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="button-base button-inactive"
        >
          Reset
        </button>
      </div>

      {hasStarted && !running && (
        <div
          className="fixed inset-0 bg-black/20 pointer-events-none transition-opacity duration-300"
        ></div>
      )}
  
      {timeUp && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div
            ref={timeUpRef}
            className="bg-yellow-50 border-2 border-red-700 rounded-xl px-16 py-8 shadow-[4px_4px_0_rgba(0,0,0,1)] text-red-700 flex flex-col space-y-6 md:space-y-8 items-center"
          >
            <h3 className="text-lg font-semibold">Time's Up!</h3>
            <p className="text-center">Choose your next session:</p>

            <div className="flex gap-3">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleNextOption(opt.value)}
                  className={`button-base button-active`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
