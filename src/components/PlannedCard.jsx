// src/components/PlannedCard.jsx
import React from "react";

export default function PlannedCard({ title, desc, bullets = [], docHint }) {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-zinc-200">{title}</div>
                <span className="text-[11px] rounded-md border border-zinc-800 px-2 py-0.5 text-zinc-400">
                  planned
                </span>
            </div>

            {desc ? <div className="text-xs text-zinc-400 mt-2">{desc}</div> : null}

            {bullets?.length ? (
                <ul className="mt-2 list-disc pl-5 text-xs text-zinc-400 space-y-1">
                    {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                    ))}
                </ul>
            ) : null}

            {docHint ? (
                <div className="mt-3 text-[11px] text-zinc-500">
                    {docHint}
                </div>
            ) : null}
        </div>
    );
}
