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
