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

function Tracker({ counts, customMinutes, resetTracker }) {
  const totalMinutes = counts.pomodoro * 25 + counts.short * 5 + counts.long * 15 + customMinutes;
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <p className="font-bold">Focus Sessions</p>
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
      <div>
        <p className="font-bold">Total Minutes</p>
        <p>{totalMinutes}</p>
      </div>
      <button onClick={resetTracker} className="border border-red-700 rounded p-1 w-fit hover:bg-red-700 hover:text-yellow-50 transition-all">Reset Tracker</button>
    </div>
  );
}

export default function Drawer({ menuOpen, setMenuOpen, mode, custom, timeUp}) {
  const [copied, setCopied] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [counts, setCounts] = useState(() => {
    const savedCounts = localStorage.getItem("counts");
    return savedCounts ? JSON.parse(savedCounts) : { pomodoro: 0, short: 0, long: 0 };
  });
  const customMinutes = counts.custom ? counts.custom.reduce((sum, val) => sum + val, 0) : 0;
  const [newTask, setNewTask] = useState("");
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
        <div className="space-y-2">
        <p>The Pomodoro® Technique is a time management method designed to improve focus and productivity. It breaks work into 25-minute “Pomodoro” sessions, each followed by a short 5-minute break. After completing four Pomodoros, take a longer 15-minute break to recharge.</p>
        <p>The technique was developed by Francesco Cirillo. He named it “Pomodoro” (Italian for “tomato”) after the tomato-shaped kitchen timer he used to track his work sessions.</p>      
        </div>
      ),
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      content: (
        <ul className="flex flex-col space-y-1">
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
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("counts", JSON.stringify(counts));
  }, [tasks, counts]);

  useEffect(() => {
    if (!timeUp) return;

    setCounts((prev) => {
      if (mode === "custom") {
        const newCustom = prev.custom ? [...prev.custom, custom] : [custom];
        return { ...prev, custom: newCustom };
      }
      return { ...prev, [mode]: prev[mode] + 1 };
    });
  }, [timeUp, mode, custom]);

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
                  index === 0 ? "cursor-default" : "cursor-pointer select-none"
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
                    <TodoList tasks={tasks} setTasks={setTasks} newTask={newTask} setNewTask={setNewTask} />
                  ) : card.id === "tracker" ? (
                    <Tracker counts={counts} customMinutes={customMinutes} resetTracker={resetTracker} />
                  ) : (
                    card.content
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className=" flex flex-col xl:flex-row items-center justify-center space-x-0 xl:space-x-2 text-xs text-yellow-50/50">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {
                  alert("Failed to copy link. Please try manually.");
                }
              }}
              className="relative hover:text-yellow-50/70 transition"
            >
              Share
              {copied && (
                <span className="absolute -top-6 -left-1">
                  Copied! 
                </span>
              )}
            </button>
            <span className="hidden xl:inline">|</span>
            <Link
              to="/pomodoro/legal"
              onClick={() => setMenuOpen(false)}
              className="hover:text-yellow-50/70 transition"
            >
              Legal & Privacy
            </Link>
            <span className="hidden xl:inline">|</span>
            <a href="https://github.com/samanthacabrera" target="_blank" rel="noopener noreferrer"className="hover:text-yellow-50/70 transition">
              Made by Sam Cabrera
            </a>
          </div>
        </div>
      )}
    </>
  );
}
