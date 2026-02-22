[//]: # (docs/v0.3-alpha/ROADMAP.md)

# v0.3-alpha Roadmap

v0.3-alpha is a **structure-first** milestone.

Goal: make the UI readable and enforce a constraint-first mental model:
**TOPS != tok/s** (decode is capped by compute, bandwidth, and KV growth).

---

## Current milestone: v0.3-alpha (DoD)

v0.3-alpha is done when all items below are true:

1. **G/Y/B tiers are stable**
    - No duplicated cards.
    - BLUE is collapsible and remains optional.
    - PlannedCards are capped (=< 3 per tier).

2. **Scaling chart is truthful and controllable**
    - Dual-axis chart: memory vs throughput.
    - Toggles work:
        - Total vs KV-only memory
        - Show/hide BW/Compute caps
    - Tooltip is readable and consistent.

3. **Regime attribution is visible**
    - Verdict shows `Status` + `Regime`.
    - Regime updates reactively when inputs change.

4. **Public docs are concise and vendor-neutral**
    - `docs/Edge_Architectural_Constraints.md` is the canonical constraints summary.
    - `docs/v0.3-alpha/SCOPE.md` and `docs/v0.3-alpha/TASKBOARD.md` reflect reality.

Once DoD is satisfied: **freeze + tag v0.3-alpha**. No feature creep.

---

## Next milestone: v0.3-beta (first depth increment)

v0.3-beta introduces *new modeling depth* (not just layout):

- Prefill vs Decode split (separate throughput paths)
- Encoder workload mode (KV-free path)
- Deterministic mode toggle (fixed window, latency-first assumptions)
- Memory-tier modeling start (SRAM fit checks + spill penalties scaffolding)

v0.3-beta work must start only after v0.3-alpha is frozen.
