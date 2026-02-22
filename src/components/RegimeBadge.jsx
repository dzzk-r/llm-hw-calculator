// src/components/RegimeBadge.jsx
import React from "react";
import Badge from "./Badge.jsx";

const META = {
    "compute-bound": {
        tone: "info",
        label: "Compute-bound",
        hint: "Compute is the limiter (tok/s from TOPS/utilization is below bandwidth ceiling).",
    },
    "bandwidth-bound": {
        tone: "warn",
        label: "Bandwidth-bound",
        hint: "Memory bandwidth is the limiter (KV/weights traffic caps decode tok/s).",
    },
    "kv-overflow": {
        tone: "bad",
        label: "KV overflow",
        hint: "Total memory (weights+KV+runtime) exceeds RAM headroom → paging/offload risk.",
    },
    balanced: {
        tone: "neutral",
        label: "Balanced",
        hint: "Compute and bandwidth ceilings are close (within tolerance band).",
    },
};

export default function RegimeBadge({ regime = "balanced" }) {
    const m = META[regime] ?? META.balanced;
    return (
        <Badge tone={m.tone} title={m.hint}>
            Regime: {m.label}
        </Badge>
    );
}
