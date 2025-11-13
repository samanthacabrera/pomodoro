import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function TodoList({ tasks, setTasks, newTask, setNewTask }) {
  return (
    <>
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
          className="flex-1 bg-transparent border-b border-stone-500 text-stone-700 placeholder-stone-400 rounded-none focus:outline-none focus:border-stone-400 transition-all text-sm"
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
            <span className="w-full mr-4 border-b border-dashed border-stone-400">
              {task}
            </span>
            <button
              className="text-lg text-red-700 hover:text-red-800"
              onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function Tracker({ counts, resetTracker }) {
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <p className="font-bold">Pomodoros</p>
        <p>{counts.pomodoro}</p>
      </div>
      <div>
        <p className="font-bold">Short Breaks</p>
        <p>{counts.short}</p>
      </div>
      <div>
        <p className="font-bold">Long Breaks</p>
        <p>{counts.long}</p>
      </div>
      <button onClick={resetTracker} className="border border-red-700 rounded p-1 w-fit hover:bg-red-700 hover:text-yellow-50 transition-all">Reset Tracker</button>
    </div>
  );
}

export default function Drawer({ menuOpen, setMenuOpen, mode, timeUp}) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [counts, setCounts] = useState({ pomodoro: 0, short: 0, long: 0 });
  const [cards, setCards] = useState([
    {
      id: "tracker",
      title: "Session Tracker",
      content: null,
    },
    {
      id: "todo",
      title: "To-Do List",
      content: null,
    },
    {
      id: "howTo",
      title: "How to Use",
      content: (
        <p>
          The Pomodoro Technique helps you focus by splitting work into 25-minute
          focus sessions with short breaks. After four, take a long break.
        </p>
      ),
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      content: (
        <ul className="flex flex-col space-y-1 text-xs">
          <li><strong>Space</strong> - Start / Pause</li>
          <li><strong>r</strong> - Reset</li>
          <li><strong>p</strong> - Pomodoro</li>
          <li><strong>s</strong> - Short Break</li>
          <li><strong>l</strong> - Long Break</li>
          <li><strong>c</strong> - Custom Timer</li>
        </ul>
      ),
    },
  ]);

  const menuRef = useRef(null);

  useEffect(() => {
    if (!timeUp) return;

    setCounts((prev) => ({
      ...prev,
      [mode]: prev[mode] + 1,
    }));
  }, [timeUp, mode]);

  const resetTracker = () => setCounts({ pomodoro: 0, short: 0, long: 0 });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMenuOpen]);

  const cycleCards = () => setCards((prev) => [...prev.slice(1), prev[0]]);

  return (
    <>
      <div className="fixed top-6 right-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl md:text-4xl hover:scale-110 hover:text-red-600 transition-all duration-300"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className={`fixed top-0 right-0 h-full w-[70vw] md:w-[25vw] z-50 bg-gradient-to-b from-red-700 to-red-800 p-6 flex flex-col transition-transform duration-500 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-2xl text-yellow-50 hover:scale-110 transition"
          >
            ×
          </button>

          <h2 className="text-2xl md:text-4xl text-yellow-50 uppercase tracking-widest font-bold border-b-2 border-yellow-50 border-dotted">
            Dash<span className="md:block">board</span>
          </h2>

          <div className="relative flex flex-col items-center justify-center flex-1">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => index !== 0 && cycleCards()}
                className={`absolute w-full h-96 p-4 rounded-md border-2 border-dotted border-stone-700 bg-yellow-50 shadow-[4px_4px_0_0_#00000030] overflow-hidden transition-transform duration-300 ${
                  index === 0 ? "cursor-default" : "cursor-pointer"
                }`}
                style={{
                  top: `calc(50% - ${
                    (cards.length * 100) / 2 + (cards.length - 1) * 20
                  }px + ${(cards.length - 1 - index) * 40}px)`,
                  left: "50%",
                  zIndex: cards.length - index,
                  transform: `translateX(-50%) rotate(${
                    index % 2 === 0 ? "-1deg" : "2deg"
                  })`,
                }}
              >
                <h3 className="text-stone-800 text-base font-bold uppercase tracking-widest mb-2">
                  {card.title}
                </h3>
                <div className="text-stone-700 text-xs leading-relaxed tracking-wide h-full overflow-y-auto pr-2">
                  {card.id === "todo" ? (
                    <TodoList
                      tasks={tasks}
                      setTasks={setTasks}
                      newTask={newTask}
                      setNewTask={setNewTask}
                    />
                  ) : card.id === "tracker" ? (
                    <Tracker counts={counts} resetTracker={resetTracker} />
                  ) : (
                    card.content
                  )}
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/pomodoro/legal"
            onClick={() => setMenuOpen(false)}
            className="absolute bottom-2 right-2 text-xs text-yellow-50/50 hover:text-yellow-50/70 transition"
          >
            Legal & Privacy
          </Link>
        </div>
      )}
    </>
  );
}
