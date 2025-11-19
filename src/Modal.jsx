import { useRef, useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div
        ref={modalRef}
        className="relative bg-yellow-50 border-2 border-red-700 rounded-xl px-12 py-8 shadow-[4px_4px_0_rgba(0,0,0,1)] text-red-700 flex flex-col space-y-6 items-center"
      >
        {title && <h3 className="text-lg font-bold uppercase tracking-wider">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
