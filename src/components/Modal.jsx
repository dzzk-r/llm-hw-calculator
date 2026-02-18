import React, { useEffect } from "react";

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-label="Close modal"
        type="button"
      />
      <div className="relative mx-auto mt-20 w-[min(720px,92vw)] rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
        <div className="flex items-start justify-between gap-3 p-4 border-b border-zinc-800">
          <div>
            <div className="text-sm font-semibold text-zinc-100">{title}</div>
            <div className="text-xs text-zinc-500 mt-1">Press Esc to close</div>
          </div>
          <button
            className="text-xs px-2 py-1 rounded-lg border border-zinc-700 hover:border-zinc-500"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="p-4 text-sm text-zinc-200">{children}</div>
      </div>
    </div>
  );
}

