import Drawer from "./Drawer";

export default function Header({ mode, changeMode, menuOpen, setMenuOpen, openModal }) {
  return (
    <div className="flex flex-col md:flex-row justify-between w-screen px-4">
      <div className="flex-col">
        <h1 className="text-5xl md:text-6xl lowercase tracking-wide font-bold ml-0 md:ml-2 -mb-2">Tomate</h1>
        <a
          href="https://www.pomodorotechnique.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-0 md:ml-2 text-xs md:text-sm font-medium w-fit border-b border-transparent hover:border-b hover:border-dotted hover:border-red-700 transition transform"
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
        <button
          onClick={() => openModal("customTimer")}
          className="button-base button-inactive"
        >
          Custom Timer
        </button>
      </div>

      <Drawer menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </div>
  );
}