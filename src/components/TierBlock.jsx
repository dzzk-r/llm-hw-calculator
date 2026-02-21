// src/components/TierBlock.jsx
import React, { useMemo, useState } from "react";

const TONES = {
    green: "border-l-[3px] border-l-emerald-500/60 bg-zinc-950",
    yellow: "border-l-[3px] border-l-amber-500/60 bg-zinc-950",
    blue: "border-l-[3px] border-l-sky-500/60 bg-zinc-950",
    neutral: "border-l-[3px] border-l-zinc-700 bg-zinc-950",
};

export default function TierBlock({
                                      tone = "neutral",
                                      title,
                                      subtitle,
                                      right,
                                      children,
                                      collapsible = false,
                                      defaultCollapsed = false,
                                  }) {
    const [collapsed, setCollapsed] = useState(Boolean(defaultCollapsed));

    const canCollapse = Boolean(collapsible);
    const isCollapsed = canCollapse ? collapsed : false;

    const headerHint = useMemo(() => {
        if (!canCollapse) return null;
        return isCollapsed ? "Show ▼" : "Hide ▲";
    }, [canCollapse, isCollapsed]);

    return (
        <section
            className={`rounded-2xl border border-zinc-900 ${TONES[tone] ?? TONES.neutral}`}
        >
            <div className="flex items-start justify-between gap-3 px-4 pt-4">
                <div className="min-w-0">
                    {canCollapse ? (
                        <button
                            type="button"
                            className="w-full text-left"
                            onClick={() => setCollapsed((v) => !v)}
                            aria-expanded={!isCollapsed}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-sm font-semibold text-zinc-100">{title}</div>
                                <div className="text-xs text-zinc-500">{headerHint}</div>
                            </div>
                        </button>
                    ) : (
                        <div className="text-sm font-semibold text-zinc-100">{title}</div>
                    )}

                    {subtitle ? <div className="text-xs text-zinc-400 mt-1">{subtitle}</div> : null}
                </div>

                {right ? <div className="shrink-0">{right}</div> : null}
            </div>

            {!isCollapsed ? <div className="px-4 pb-4 pt-3">{children}</div> : null}
        </section>
    );
}
