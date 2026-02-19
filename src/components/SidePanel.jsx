import React, { useEffect } from "react";

export default function SidePanel({ open, title, children, onClose, widthClass = "w-[min(920px,92vw)]" }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <button
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
                aria-label="Close side panel"
                type="button"
            />
            <div className={`absolute right-0 top-0 h-full ${widthClass} bg-zinc-950 border-l border-zinc-800 shadow-2xl`}>
                <div className="flex items-start justify-between gap-3 p-4 border-b border-zinc-800">
                    <div>
                        <div className="text-sm font-semibold text-zinc-100">{title}</div>
                        <div className="text-xs text-zinc-500 mt-1">Esc to close</div>
                    </div>
                    <button
                        className="text-xs px-2 py-1 rounded-lg border border-zinc-700 hover:border-zinc-500"
                        onClick={onClose}
                        type="button"
                    >
                        Close
                    </button>
                </div>
                <div className="p-4 overflow-y-auto h-[calc(100%-57px)]">
                    {children}
                </div>
            </div>
        </div>
    );
}
