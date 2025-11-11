import { useEffect, useRef, useState } from "react";

export default function Drawer({ menuOpen, setMenuOpen }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [cards, setCards] = useState([
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
          <li><strong>Space</strong> - Start / Pause </li>
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

  const bringCardToFront = (id) => {
    setCards(prevCards => {
      if (prevCards[0].id === id) {
        return [...prevCards.slice(1), prevCards[0]]; 
      }
      const cardToFront = prevCards.find(c => c.id === id);
      const otherCards = prevCards.filter(c => c.id !== id);
      return [cardToFront, ...otherCards];
    });
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

          {/* More Info Cards */}
          <div className="relative flex-1">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => bringCardToFront(card.id)}
                className="absolute w-full h-60 p-4 rounded-md border-2 border-stone-700 bg-[#fdfaf2] shadow-[4px_4px_0_0_#00000030] cursor-pointer"
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
                <div className="text-stone-700 text-xs leading-relaxed tracking-wide">
                  {card.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
