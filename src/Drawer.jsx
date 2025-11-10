import { useEffect, useRef, useState } from "react";

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
    <>
        <div className="fixed top-6 right-4">
        <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl md:text-4xl hover:scale-110 hover:text-red-600 transition-all duration-300 font-bold tracking-widest"
            style={{ fontFamily: '"Courier New", monospace' }}
        >
            ☰
        </button>
        </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed top-24 right-4 z-40 flex flex-col space-y-6 border-2 border-stone-800 shadow-[6px_6px_0_0_#00000050] text-stone-800 p-8 z-50 w-[22rem] h-[80vh] transform transition-all duration-500 bg-gradient-to-b from-[#f5e6d3] to-[#e3d5b8] rounded-md overflow-hidden"
          style={{ fontFamily: '"IBM Plex Mono", "Courier New", monospace' }}
        >
            <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 text-2xl text-stone-500 hover:text-stone-600 transition"
            >
                ×
            </button>
            <img
                src="/pomodoro/tomato.png"
                alt="tomato"
                className="absolute -top-8 -left-4 w-40 h-40 opacity-80 -rotate-12 z-0 pointer-events-none"
            />
            <img
                src="/pomodoro/tomato.png"
                alt="tomato"
                className="absolute -bottom-8 -right-8 w-40 h-40 opacity-80 z-0 rotate-12 pointer-events-none"
            />

          {/* To-Do List */}
          <div className="relative flex flex-col h-64 z-10 rotate-2 bg-[#fdfaf2] border-2 border-stone-700 rounded-md p-4 shadow-[4px_4px_0_0_#00000030]">
            <h2 className="text-stone-800 text-base font-bold uppercase tracking-widest mb-2">
              To-Do List
            </h2>

            <div className="flex gap-2 mb-3">
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
                placeholder="Type task..."
                className="flex-1 bg-transparent border-b border-stone-500 text-stone-700 placeholder-stone-400 focus:outline-none focus:border-stone-400 transition-all text-sm"
              />
              <button
                onClick={() => {
                  if (!newTask.trim()) return;
                  setTasks([...tasks, newTask.trim()]);
                  setNewTask("");
                }}
                className="text-stone-700 text-lg font-bold hover:text-lime-600 transition"
              >
                ＋
              </button>
            </div>

            <ul className="overflow-y-auto space-y-1 text-sm">
              {tasks.map((task, index) => (
                <li
                    key={index}
                    className="flex justify-between items-center py-1 text-stone-700"
                    >  
                    <span className="w-full mr-4 border-b border-dashed border-stone-400">{task}</span>
                    <button
                        className="text-lg text-red-700 hover:text-red-800"
                        onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                    >
                        ✕
                    </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Card */}
          <div className="bg-[#fdfaf2] z-10 h-64 -rotate-1 border-2 border-stone-700 rounded-md p-4 shadow-[4px_4px_0_0_#00000030] text-stone-700 text-xs leading-relaxed tracking-wide">
            <h3 className="text-stone-800 text-base font-bold uppercase tracking-widest mb-2">
              How to Use
            </h3>
            <p>
              The Pomodoro Technique (by Francesco Cirillo) helps you focus by
              splitting work into 25-minute sessions with short 5-minute breaks. After
              four sessions, take a longer break to reset.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
