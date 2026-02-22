[//]: # (docs/v0.3-alpha/SCOPE.md)

# v0.3-alpha Scope

v0.3-alpha is a structural release.

Its purpose is to establish a clean, constraint-first UI and documentation baseline.
It does not aim to expand modeling depth beyond existing logic.

---

## 1. Objectives

v0.3-alpha must establish:

- Clear G/Y/B UI layering (Operator / System / Runtime)
- KV-aware context scaling visualization
- Dual-axis memory vs throughput chart
- Reactive bottleneck regime classification (heuristic)
- Vendor-neutral public documentation

This release focuses on structure, clarity, and constraint visibility.

---

## 2. In-Scope Features

### GREEN – Operator Layer
- Model controls
- Context controls (KV-aware)
- Hardware + performance inputs
- RegimeBadge (compute / bandwidth / KV heuristic)
- Dual-axis scaling chart with working toggles

### YELLOW – System Realism Layer
- Precision & overhead controls grouped
- Engine realism presets grouped
- Minimal explanatory text (1–3 bullets per group)

### BLUE – Runtime Layer
- Structural container only
- Collapsible
- No amplification math implemented

---

## 3. Acceptance Criteria (Definition of Done)

v0.3-alpha is complete when:

1. Context scaling visibly affects KV footprint.
2. tok/s visibly reflects compute vs bandwidth caps.
3. Regime classification updates reactively.
4. Chart toggles correctly show/hide:
    - Total vs KV-only memory
    - Compute/Bandwidth caps
5. PlannedCards are capped (≤ 3 per tier).
6. Public docs are vendor-neutral and internally consistent.

---

## 4. Explicit Non-Goals

The following are excluded from alpha:

- Prefill vs decode stage separation (math-level)
- Encoder workload mode
- Deterministic latency enforcement
- SRAM fit modeling
- Spill penalties
- Power or thermal scaling
- Multi-stream contention modeling
- Runtime scheduler coefficients

These belong to beta and beyond.

---

## 5. Exit Rule

Once all acceptance criteria are satisfied,
v0.3-alpha is frozen and tagged.

No feature creep is allowed inside alpha.