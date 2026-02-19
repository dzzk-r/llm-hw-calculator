import React from "react";

export default function SidePanelDock({
  open,
  title,
  children,
  onToggle,
  widthClass = "w-[420px]",
}) {
  return (
    <aside
      className={[
        "shrink-0 border-l border-zinc-800 bg-zinc-950",
        "hidden lg:flex lg:flex-col",
        open ? widthClass : "w-[56px]",
      ].join(" ")}
      aria-label="Side panel"
      style={{'position':'fixed','top':0,'right':0, 'bottom':0}}
    >
            <div className="flex items-center justify-between gap-2 p-3 border-b border-zinc-800">
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-xs px-2 py-1 rounded-lg border border-zinc-700 hover:border-zinc-500"
                    title={open ? "Collapse" : "Expand"}
                >
                    {open ? "Collapse" : "Open"}
                </button>

                {open ? (
                    <div className="text-sm font-semibold text-zinc-100 truncate">{title}</div>
                ) : (
                    <div className="text-[10px] text-zinc-500 rotate-90 select-none">PANEL</div>
                )}
            </div>

            {open ? (
                <div className="p-3 overflow-y-auto h-[calc(100vh-60px)]">{children}</div>
            ) : (
                <div className="flex-1" />
            )}
        </aside>
    );
}
