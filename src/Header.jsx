import { useRef } from "react";
import Drawer from "./Drawer";

export default function Header({
  mode,
  changeMode,
  showCustomModal,
  setShowCustomModal,
  pendingCustom,
  setPendingCustom,
  setCustom,
  setTimerMode,
  menuOpen,
  setMenuOpen,
}) {
  const customRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && showCustomModal) {
      e.preventDefault();
      const finalValue = pendingCustom === "" || isNaN(pendingCustom) ? 1 : pendingCustom;
      setCustom(finalValue);
      setTimerMode("custom", finalValue, false);
      setShowCustomModal(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between w-screen px-4">
      <div className="flex-col">
        <h1 className="text-4xl md:text-6xl uppercase tracking-wide font-bold -mb-2">Tomate</h1>
        <a
          href="https://www.pomodorotechnique.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-0 md:ml-2 text-sm font-medium w-fit border-b border-transparent hover:border-b hover:border-dotted hover:border-red-700 transition transform"
        >
          Inspired by The Pomodoro® Technique
        </a>
      </div>

      {/* Modes */}
      <div className="flex gap-4 mt-4 md:mt-1 md:mr-12">
        <button onClick={() => changeMode("pomodoro")} className={`button-base ${mode === "pomodoro" ? "button-active" : "button-inactive"}`}>
            Focus Session
        </button>
        <button onClick={() => changeMode("short")} className={`button-base ${mode === "short" ? "button-active" : "button-inactive"}`}>
            Short Break
        </button>
        <button onClick={() => changeMode("long")} className={`button-base ${mode === "long" ? "button-active" : "button-inactive"}`}>
            Long Break
        </button>
        <button onClick={() => setShowCustomModal(true)} className={`button-base ${mode === "custom" ? "button-active" : "button-inactive"}`}>
            Custom Timer
        </button>

        {/* Custom Timer Modal */}
        {showCustomModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div
              ref={customRef}
              className="bg-yellow-50 border-2 border-red-700 rounded-xl px-16 py-8 shadow-[4px_4px_0_rgba(0,0,0,1)] text-red-700 flex flex-col space-y-6 md:space-y-8 items-center"
            >
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider">
                Set Custom Timer
              </h3>
              <div className="flex-row space-x-4 items-center">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={pendingCustom}
                  className="border border-red-700 rounded px-3 py-2 w-24 text-center font-bold text-red-700 focus:outline-none"
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    if (pendingCustom === "" || isNaN(pendingCustom)) setPendingCustom(1);
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") setPendingCustom("");
                    else setPendingCustom(Math.max(1, Math.min(180, Number(val))));
                  }}
                />
                <span className="font-bold uppercase text-sm md:text-base">minutes</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const finalValue = pendingCustom === "" || isNaN(pendingCustom) ? 1 : pendingCustom;
                    setCustom(finalValue);
                    setTimerMode("custom", finalValue, false);
                    setShowCustomModal(false);
                  }}
                  className={`button-base button-active`}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className={`button-base button-active`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Drawer menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </div>
  );
}
