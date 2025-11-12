import { useEffect, useRef, useState } from "react";

function TodoListContent({ tasks, setTasks, newTask, setNewTask }) {
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

export default function Drawer({ menuOpen, setMenuOpen }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [cards, setCards] = useState([
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
          The Pomodoro Technique (by Francesco Cirillo) helps you focus by
          splitting work into 25-minute focus sessions with short 5-minute breaks. After
          four sessions, take a longer break to reset.
        </p>
      ),
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      content: (
        <ul className="flex flex-col space-y-1 justify-between text-stone-700 text-xs">
          <li><strong>Space</strong> - Start / Pause</li>
          <li><strong>R/r</strong> - Reset</li>
          <li><strong>1</strong> - Pomodoro</li>
          <li><strong>2</strong> - Short Break</li>
          <li><strong>3</strong> - Long Break</li>
        </ul>
      ),
    },
  ]);

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

  const cycleCards = () => {
    setCards((prev) => [...prev.slice(1), prev[0]]);
  };

  return (
    <>
      <div className="fixed top-8 right-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl md:text-4xl hover:scale-110 hover:text-red-600 transition-all duration-300"
          style={{ fontFamily: '"Courier New", monospace' }}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed top-44 right-4 z-40 flex flex-col space-y-6 border-2 border-stone-800 shadow-[6px_6px_0_0_#00000050] text-stone-800 p-8 w-[25vw] h-[60vh] transition-all duration-500 bg-gradient-to-b from-[#f5e6d3] to-[#e3d5b8] rounded-md overflow-hidden"
          style={{ fontFamily: '"IBM Plex Mono", "Courier New", monospace' }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-2xl text-stone-500 hover:text-stone-600 transition"
          >
            ×
          </button>

          <div className="relative flex-1 z-10">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={cycleCards}
                className="absolute w-full h-64 p-4 rounded-md border-2 border-stone-700 bg-[#fdfaf2] shadow-[4px_4px_0_0_#00000030] cursor-pointer overflow-hidden"
                style={{
                  top: `${index * 44}px`,
                  left: `${index * 12}px`,
                  zIndex: index,
                  transform: `rotate(${index % 2 === 0 ? "-1deg" : "2deg"})`,
                }}
              >
                <h3 className="text-stone-800 text-base font-bold uppercase tracking-widest mb-2">
                  {card.title}
                </h3>
                <div className="text-stone-700 text-xs leading-relaxed tracking-wide h-full overflow-y-auto pr-2">
                  {card.id === "todo" ? (
                    <TodoListContent
                      tasks={tasks}
                      setTasks={setTasks}
                      newTask={newTask}
                      setNewTask={setNewTask}
                    />
                  ) : (
                    card.content
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}