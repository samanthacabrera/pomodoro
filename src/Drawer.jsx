import { useEffect, useRef, useState } from "react";
import corkboard from "/corkboard.avif";

export default function Drawer({ menuOpen, setMenuOpen }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMenuOpen]);

  return (
    <div className="absolute top-6 right-4">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-2xl md:text-4xl hover:scale-110 transition duration-300"
      >
        ☰
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-24 -right-4 flex flex-col space-y-4 shadow-lg border-2 border-[#8B4513] text-white p-8 z-50 w-100 h-[75vh] transform transition-all duration-300"
          style={{
            backgroundImage: `url(${corkboard})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-2 right-4 text-2xl"
          >
            ×
          </button>

          {/* To-Do List */}
          <div
            style={{ fontFamily: 'Chalkboard, "Comic Sans MS"' }}
            className="relative w-64 h-64 p-4 bg-yellow-200 shadow-lg transform rotate-2 overflow-y-auto max-h-64 pr-2 scrollbar-thin"
          >
            <h2 className="text-lg text-yellow-500 uppercase tracking-widest font-bold mb-2">
              To-Do List
            </h2>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTask}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTask.trim()) {
                    setTasks([...tasks, newTask.trim()]);
                    setNewTask("");
                  }
                }}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New task..."
                className="flex-1 p-1 rounded-sm focus:outline-none text-stone-500 placeholder-stone-500 bg-transparent border-b border-dashed border-stone-500"
              />
              <button
                onClick={() => {
                  if (!newTask.trim()) return;
                  setTasks([...tasks, newTask.trim()]);
                  setNewTask("");
                }}
                className="text-yellow-500 text-xl font-bold hover:scale-120 transition"
              >
                +
              </button>
            </div>
            <ul className="text-stone-500 space-y-1 max-h-48 overflow-y-auto">
              {tasks.map((task, index) => (
                <div className="flex justify-between w-full" key={index}>
                  <li className="flex p-1 w-full justify-between border-b border-dashed border-black/30 py-1">
                    <span>{task}</span>
                  </li>
                  <button
                    className="pl-2 hover:scale-120 transition"
                    onClick={() =>
                      setTasks(tasks.filter((_, i) => i !== index))
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div
            style={{ fontFamily: 'Chalkboard, "Comic Sans MS"' }}
            className="relative w-64 h-64 p-4 bg-yellow-200 text-sm shadow-lg transform -rotate-1 text-yellow-500 tracking-wide"
          >
            <p>
              The Pomodoro Technique, created by Francesco Cirillo, helps you
              stay focused by breaking work into short sessions. Each Pomodoro
              is 25 minutes of work followed by a 5-minute break. After four
              Pomodoros, take a longer 15-minute break to rest and reset.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
