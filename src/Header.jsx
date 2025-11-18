import { useEffect, useRef } from "react";
import Drawer from "./Drawer";
import Modal from "./Modal";

export default function Header({ mode, changeMode, activeModal, openModal, closeModal, pendingCustom, setPendingCustom, setCustom, setDuration, menuOpen, setMenuOpen }) {
  const customRef = useRef(null);

  useEffect(() => {
    if (activeModal === "custom") {
      setPendingCustom(customRef.current?.value || "");
      if (customRef.current) customRef.current.focus();
    }
  }, [activeModal]);

  
  const handleSaveCustom = () => {
    const finalValue = pendingCustom === "" || isNaN(pendingCustom) ? 1 : pendingCustom;
    setCustom(finalValue);
    changeMode("custom");     
    setDuration(finalValue * 60); 
    closeModal();
    setPendingCustom(""); 
  };

  const handleCloseModal = () => { 
    closeModal();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between w-screen px-4">
      <div className="flex-col">
        <h1 className="text-5xl md:text-6xl uppercase tracking-wide font-bold -mb-2">Tomate</h1>
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
        {/* <button onClick={() => openModal("custom")} className={`button-base ${mode === "custom" ? "button-active" : "button-inactive"}`}>
            Custom Timer
        </button> */}

        {/* Custom Timer Modal */}
        <Modal
          isOpen={activeModal === "custom"}
          onClose={closeModal}
          title="Set Custom Timer"
        >
          <div className="flex flex-row items-center space-x-4 mb-4">
            <input
              type="number"
              min="1"
              max="180"
              value={pendingCustom}
              ref={customRef}
              className="border border-red-700 rounded px-3 py-2 w-24 text-center font-bold text-red-700 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveCustom();
              }}
              onChange={(e) => {
                const val = e.target.value;
                setPendingCustom(val === "" ? "" : Math.max(1, Math.min(180, Number(val))));
              }}
            />
            <span className="font-bold uppercase text-sm md:text-base">
              minutes
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSaveCustom} className="button-base button-active">
              Save
            </button>
            <button onClick={handleCloseModal} className="button-base button-active">
              Cancel
            </button>
          </div>
        </Modal>
      </div>

      <Drawer menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </div>
  );
}




