# LM Context (Architectural Alignment)

This document aligns v0.3 modeling tasks with architectural themes
discussed with LM.

## Core Themes Raised

-   Encoder workloads vs autoregressive decode
-   Edge deployment realism
-   Deterministic inference constraints
-   Generative AI on-device
-   Memory hierarchy awareness
-   Vision multi-stream capability

------------------------------------------------------------------------

## Implementation Traceability Matrix

  
 | LM Theme                   | TODO Item                      | Layer | Priority |
 |----------------------------|--------------------------------|-------|----------|
 | Encoder focus              | Encoder workload toggle        | 🟢    | High     |
 | Generative decode pressure | Prefill vs Decode separation   | 🟢    | High     |
 | Deterministic constraints  | Deterministic mode toggle      | 🟢    | High     |
 | Edge realism modeling      | Memory tier                    | 🟡    | High     |
 | Memory hierarchy awareness | SRAM fit detection             | 🟡    | High     |
 | Power envelope discussion  | Power / thermal scaling        | 🟡    | Medium   |
 | Runtime depth              | Runtime amplefication modeling | 🔵    | Medium   |
 | Multi-stream vision        | Multi-stream cont. modeling    | 🔵    | Medium   |
  

## Strategic Interpretation

v0.3 demonstrates architectural reasoning depth aligned with:

-   Edge deployment realities
-   Decode vs encoder asymmetry
-   Memory-tier constraints
-   Deterministic inference modes
-   Runtime-level amplification effects

This is a system-level modeling artifact, not a promotional tool.

------------------------------------------------------------------------

## Field Notes from an Edge Silicon Organization
*(Sanitized architectural observations)*

The following observations reflect practical realities of edge silicon deployment,
independent of any specific vendor.

### 1. Encoder vs Autoregressive Asymmetry

Edge silicon deployments often prioritize encoder-style workloads
(vision, sensor fusion, low-light pipelines, multi-stream analytics)
over pure autoregressive LLM decode.

Key differences:

- Encoder workloads are throughput-oriented and stateless.
- Autoregressive decode is latency-sensitive and KV-cache bound.
- KV growth is not a concern for encoder pipelines.
- Memory bandwidth pressure manifests differently across these regimes.

This asymmetry justifies:
- Separate modeling for Encoder vs LLM workloads.
- Regime classification (compute-bound vs bandwidth-bound).
- Deterministic operating modes.

---

### 2. Edge Is Not "Small Cloud"

Edge deployments frequently include:

- On-prem validation labs
- Hardware-in-the-loop testing
- Mixed OS targets
- Quarterly release cadence with customer-specific hotfixes
- Strict latency envelopes

These constraints make:
- Deterministic inference modeling essential.
- Memory-tier awareness critical.
- Runtime overhead modeling non-optional.

---

### 3. Runtime Reality Dominates TOPS

Peak TOPS rarely reflects delivered decode throughput.

Practical bottlenecks include:

- Memory bandwidth ceilings
- KV-cache growth pressure
- Scheduler efficiency
- Runtime copy amplification
- Tiling inefficiency
- Multi-stream contention

This motivates the Regime Classifier and Runtime Amplification Layer.

---

### 4. Control Plane Is Usually External

Silicon vendors typically ship SDKs and runtime stacks.

They rarely provide:

- Fleet orchestration
- Resource scheduling across devices
- Deployment policy management
- Deterministic rollout control

Therefore, this modeling framework assumes:
You own system-level orchestration constraints.

------------------------------------------------------------------------

## Why This Matters

This calculator is not a benchmark tool.
It is a constraint-awareness instrument.

It exists to model:

- Memory ceilings
- Decode vs encoder asymmetry
- Deterministic edge requirements
- Runtime amplification effects

Architectural reasoning > marketing claims.

## Field Notes: Edge Silicon / Camera SoC Reality (Brand-Neutral)

These notes capture practical constraints commonly observed in edge silicon organizations:

1) **Two product realities**
 - Discrete accelerators (add-on cards / modules) often target **vision first**.
 - Camera SoCs integrate **sensor pipeline + ISP + encoder/decoder + CPU/DSP + NPU**, enabling analytics at the source.

2) **Encoder workloads differ from autoregressive LLM decode**
 - Encoder-style inference (CV/STT encoders) is typically **throughput + memory-fit** driven and does **not** grow KV per token.
 - Autoregressive decode is frequently **bandwidth/KV/scheduler** bound even when TOPS looks high.

3) **Determinism matters on real edge**
 - Many deployments prefer fixed windows, strict latency ceilings, and predictable memory behavior.
 - “Works in a benchmark” is not the same as “works in a product at scale”.

4) **Runtime and memory amplification are real**
 - Alignment, fragmentation, copies, paging, and scheduler overhead can multiply theoretical costs.
 - Any credible model should surface these multipliers explicitly (even as knobs).
 - 

# Taskboard — G/Y/B + T-Shirt Estimates

Legend:
- 🟢 GREEN  – Operator Layer
- 🟡 YELLOW – Systems Realism
- 🔵 BLUE   – Runtime / Strategic

Size:
- 🟩 S – 2-4 hours
- 🟨 M – 6-12 hours
- 🟥 L – 16-24 hours

---

## 🟢 GREEN — Operator Layer

| Task | Size | Hours | Docs |
|------|------|-------|------|
| Scaling chart polish (dual axis + toggles) | 🟩 S | 3h | ALPHA_SCOPE.md |
| Prefill vs Decode separation | 🟨 M | 8h | LM_Context.md |
| Encoder workload mode | 🟨 M | 10h | LM_Context.md |
| Deterministic mode toggle | 🟥 L | 16h | LM_Context.md |

---

## 🟡 YELLOW — Systems Realism

| Task | Size | Hours | Docs |
|------|------|-------|------|
| SRAM fit detection | 🟨 M | 8h | LM_Context.md |
| Spill penalty modeling | 🟨 M | 6h | Runtime_Amplification_Layer.md |

---

## 🔵 BLUE — Runtime / Advanced

| Task | Size | Hours | Docs |
|------|------|-------|------|
| Scheduler efficiency coefficient | 🟥 L | 20h | Runtime_Amplification_Layer.md |
| Multi-stream contention modeling | 🟥 L | 20h | Runtime_Amplification_Layer.md |

---

## Alpha Freeze Rule

v0.3-alpha includes:
- Layout (G/Y/B)
- Regime badge
- Dual-axis chart
- Public documentation alignment

All other tasks belong to v0.3-beta or later.