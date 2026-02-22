# TODO

## v0.3-alpha: Architectural Reality Mode
*Goal: Demonstrate architectural thinking by formalizing system constraints and enforcing brand-agnostic modeling.*

### UI & UX: 3-Layer Hierarchy [G/Y/B]
*   **[G] Tiered Containers:** Implement three visual logic groups (GREEN/YELLOW/BLUE) using a **border-left** (2–4px thick) for logical grouping.
*   **[G] Collapsible Sections:** Make blocks collapsible (accordions), with **Runtime Amplification Layer** (BLUE) collapsed by default.
*   **[G] Placeholder Scaffolding:** Add "release-date" boilerplate for planned but not yet implemented sections to declare future intent.
*   **[G] Sidebar Content Dock:** Ensure all charts and scaling tables are strictly moved to the sidebar area.

### Core Architecture & Logic
*   **[G] Regime Classifier:** Implement `regimeClassifier()` function to detect dominant bottlenecks (Compute-bound / Bandwidth-bound / KV-bound / SRAM-spill) with a reactive UI badge.
*   **[G] Prefill vs Decode:** Separate throughput modeling for prompt loading (prefill) and token generation (decode) stages.
*   **[G] Encoder Workload Mode:** Add a selector for workload types (LLM / Encoder / Hybrid) to model scenarios like CV or STT without KV-cache growth.
*   **[G] Deterministic Mode:** Implement a toggle for industrial/robotics edge scenarios (fixed window, no paging, strict latency priority).

### Naming & Brand Masking (Policy Enforcement)
*   **[G] Alias Migration:** Replace all vendor names with established masks:
    *   `h8m2`, `h10hm2`
    *   `nvo`, `nvj`
    *   `r3x`, `r18x` (integrated SoC + co-processor)
    *   `LM`
*   **[G] Acceptance Check:** Enforce "0 explicit vendor names" policy in UI labels, preset IDs, and public documentation.

### Future Roadmap (Drafting Stage)
*   **v0.3-beta:** Memory Tier Modeling (SRAM fit check), Spill Penalty, and Power/Thermal Scaling.
*   **v0.3-runtime:** Scheduler Efficiency Coefficient and Multi-Stream Contention modeling.

---

### Core Policies
1.  **TOPS != tok/s:** All UI elements and tooltips must reinforce that memory bandwidth and scheduler efficiency are the primary bottlenecks.
2.  **Architectural Integrity:** Every task must remain traceable to the systemic constraints discussed in `docs/LM_Context.md`.
3.  **Vendor Neutrality:** Public repository assets must remain brand-agnostic; internal mappings are kept in private dev notes only.

---

## Effort Estimation (T-Shirt Sizing)

Size guide:
- S = 1–3 hours
- M = 4–8 hours
- L = 9–16 hours

---

## GREEN (Operator Layer)

### Prefill vs Decode Separation
Size: M (6–8h)  
Docs: LM_Context.md  
Description:
Separate prompt-loading throughput from decode throughput.
Expose both metrics in UI.

---

### Encoder Workload Mode
Size: M (6–10h)  
Docs: LM_Context.md (Encoder asymmetry)  
Description:
Add workload selector:
- LLM (autoregressive)
- Encoder (stateless)
  Disable KV growth in encoder mode.

---

### Deterministic Mode
Size: M–L (8–12h)  
Docs: LM_Context.md (Edge realism)  
Description:
Fixed window enforcement.
Latency-priority modeling.

---

## YELLOW (System Realism)

### SRAM Fit Detection
Size: M (6–8h)  
Docs: LM_Context.md  
Description:
Add SRAM capacity parameter.
Trigger regime "SRAM-spill" when exceeded.

---

### Spill Penalty Modeling
Size: M (6h)  
Docs: Runtime_Amplification_Layer.md  
Description:
Apply throughput multiplier when KV spills beyond fast memory tier.

---

## BLUE (Runtime Amplification Layer)

### Scheduler Efficiency Coefficient
Size: L (12–16h)  
Docs: Runtime_Amplification_Layer.md

---

### Multi-Stream Contention Modeling
Size: L (12–16h)  
Docs: Runtime_Amplification_Layer.md

---

## Deferred (v0.4+)

- Power envelope modeling
- Thermal throttling curves
- Fleet-level orchestration constraints

