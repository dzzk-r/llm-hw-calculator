[//]: # (docs/v0.3-alpha/TASKBOARD.md)

# v0.3-alpha Taskboard (Operator UI + Constraint-first modeling)

## Links
- Scope: `docs/v0.3-alpha/SCOPE.md`
- Roadmap: `docs/v0.3-alpha/ROADMAP.md`
- Constraints: `docs/Edge_Architectural_Constraints.md`

**Rule:** every task must map to at least one constraint theme (see Constraints doc).

## Legend
- Tier: 🟩 GREEN (operator) / 🟨 YELLOW (systems realism) / 🟦 BLUE (optional)
- Size: 🟢 S (2–4h) / 🟠 M (6–12h) / 🔴 L (16–24h)

---

## 🟩 GREEN – Core Inputs (Operator Layer)
- [DONE] 🟩 🟢 Regime badge (compute/bandwidth/KV heuristic) – ~3h
- [TODO] 🟩 🟠 Scaling chart toggles (Total/KV/Caps) + dual-axis cleanup – ~8h
  - Links: `src/App.jsx` (SidePanelDock), `src/components/Toggle.jsx`
  - Constraint themes: KV growth visibility, bottleneck attribution

- [TODO] 🟩 🟢 Prefill vs Decode UI stub (layout + tooltip text; no new math) – ~3h
  - Constraint themes: decode ≠ prefill framing

## 🟨 YELLOW – Practical Realism (Systems Layer)
- [DONE] 🟨 🟢 Engine realism presets grouped into YELLOW (layout-only)
- [TODO] 🟨 🟢 KV realism grouping (alignment/copies/overheads) + short help text – ~4h
  - Links: `src/lib/math.js`, `docs/Edge_Architectural_Constraints.md`

## 🟦 BLUE – Advanced / Optional
- [TODO] 🟦 🟢 Runtime amplification explanation panel (short, collapsible) – ~3h
  - Links: `docs/Runtime_Amplification_Layer.md`

- [TODO] 🟦 🟢 Competitive context panel (masked presets, memory topology notes) – ~4h
  - Links: `docs/Competitive_Context.md`

---

## Alpha exit criteria (must be true to tag v0.3-alpha)
- GREEN has **no broken UX**: toggles work, chart readable, no duplicate/ghost cards.
- PlannedCards are capped: **≤ 3 PlannedCards per tier**. Everything else lives here in TASKBOARD.
- Public docs are clean and vendor-agnostic:
  - `docs/Edge_Architectural_Constraints.md`
  - `docs/v0.3-alpha/SCOPE.md`
  - `docs/v0.3-alpha/ROADMAP.md`
  - this TASKBOARD
