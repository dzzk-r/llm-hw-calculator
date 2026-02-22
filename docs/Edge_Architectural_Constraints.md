[//]: # (docs/Edge_Architectural_Constraints.md)

# Field Notes: Edge Camera SoC Reality (Anonymized)

Vendor-agnostic notes distilled from real edge-silicon / smart-camera environments.
Purpose: ground the calculator in constraints that repeatedly appear in production edge systems.

## Why this document exists
The calculator is a **constraint-first sanity checker**, not a benchmark tool.
It should make these realities visible in UI and math:

- **Decode != Encoder** (KV growth is not universal)
- **Multi-stream + determinism** is the default in surveillance-like deployments
- **Software stack depth** (compiler/driver/runtime) introduces non-obvious penalties
- **Fleet control plane** is typically customer-owned (out of scope for this repo)

---

## 1) Encoder pipelines are not LLM decode
Many edge camera workloads are encoder-centric:
- ISP / image enhancement (low-light, denoise, WDR/HDR-like)
- detection / segmentation / tracking
- analytics metadata generation

**Architectural implication:** throughput + memory fit matter, but **KV growth does not**.

**UI implication:** introduce a **Workload Mode** selector:
- **LLM** (autoregressive decode, KV grows)
- **Encoder** (no KV growth; throughput/fit focused)
- **Hybrid** (mixed workloads)

---

## 2) "Surveillance reality" is multi-stream + determinism
Real deployments are rarely "one stream on a dev kit".
They are usually:
- multiple concurrent streams
- strict latency expectations (bounded tail latency)
- predictable resource envelopes (no surprises)

**Architectural implication:** model a **Deterministic Mode** concept:
- fixed window / capped KV
- conservative bandwidth assumptions
- avoid paging/spill where possible
- prefer stable p95/p99 over peak throughput

---

## 3) Software stack depth matters (compiler, drivers, packaging)
Edge silicon ecosystems ship a full stack:
- kernel + user-mode drivers
- model compilation / conversion toolchains
- packaging (Linux/Windows artifacts, containers, installers)
- CI validation loops and frequent release trains

**Architectural implication:** introduce a **Runtime Amplification** factor
(copy/tiling/scheduler penalties), even if initially exposed as an optional "advanced" layer.

---

## 4) Control plane is usually the customer's job
Silicon vendors often provide hardware + SDK, while large-scale device management
(rollouts, telemetry aggregation, fleet policy) is implemented by customers.

**Scope implication:** keep this repo focused on **on-device feasibility + constraints**.
Do not drift into fleet orchestration — but keep doc hooks for future integrations.

---

## What this means for v0.3
v0.3-alpha should demonstrate **architecture-aware UI structure**:
- Regime attribution (compute / bandwidth / KV)
- Prefill vs Decode framing (math later is ok; framing must exist)
- Workload Mode (LLM vs Encoder vs Hybrid)
- Deterministic Mode framing
- Runtime Amplification as an optional deep layer
