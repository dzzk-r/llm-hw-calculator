// src/components/TierBlock.jsx
import React from "react";

const TONES = {
    green: "border-l-4 border-l-emerald-500/60 bg-zinc-950",
    yellow: "border-l-4 border-l-amber-500/60 bg-zinc-950",
    blue: "border-l-4 border-l-sky-500/60 bg-zinc-950",
    neutral: "border-l-4 border-l-zinc-700 bg-zinc-950",
};

export default function TierBlock({
  tone = "neutral",
  title,
  subtitle,
  right,
  children,
}) {
    return (
        <section className={`rounded-2xl border border-zinc-900 ${TONES[tone] ?? TONES.neutral}`}>
            <div className="flex items-start justify-between gap-3 px-4 pt-4">
                <div>
                    <div className="text-sm font-semibold text-zinc-100">{title}</div>
                    {subtitle ? (
                        <div className="text-xs text-zinc-400 mt-1">{subtitle}</div>
                    ) : null}
                </div>
                {right ? <div className="shrink-0">{right}</div> : null}
            </div>
            <div className="px-4 pb-4 pt-3">{children}</div>
        </section>
    );
}