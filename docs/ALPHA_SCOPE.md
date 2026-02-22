[//]: # (docs/ALPHA_SCOPE.md)

# v0.3-alpha Scope Definition

This document defines the formal boundaries of v0.3-alpha.

The purpose of this release is architectural constraint modeling —
not feature completeness.

---

## 1. Objectives

v0.3-alpha establishes:

- G/Y/B UI layering (Operator / System / Runtime)
- KV-aware context scaling visualization
- Dual-axis memory vs throughput chart
- Bottleneck regime classification (heuristic)
- Vendor-neutral modeling

It does NOT implement:
- SRAM fit modeling
- Prefill vs decode separation
- Encoder workload mode
- Deterministic latency enforcement
- Runtime amplification modeling

Those belong to later stages.

---

## 2. Delivered Components

### GREEN — Operator Layer
- Model controls
- Context controls (KV-aware)
- Hardware + performance inputs
- RegimeBadge (compute / bandwidth / KV heuristic)
- Dual-axis scaling chart

### YELLOW — System Realism Layer
- Precision & overhead controls
- Engine realism presets

### BLUE — Runtime Layer (structural only)
- Placeholder container
- No amplification modeling yet

---

## 3. Acceptance Criteria

v0.3-alpha is considered complete when:

- Context scaling affects KV footprint deterministically
- tok/s reflects compute vs bandwidth caps
- Regime classification updates reactively
- Chart toggles behave correctly
- Public documentation aligns with architectural intent

---

## 4. Non-Goals

The following are explicitly excluded from alpha:

- Power modeling
- Thermal scaling
- SRAM spill penalties
- Multi-stream contention modeling
- Runtime scheduler coefficients

These are tracked in TODO.md.

---

## 5. Rationale

The goal of v0.3-alpha is to demonstrate:

- Constraint-aware inference modeling
- Edge deployment realism
- Decode vs encoder asymmetry awareness
- Architectural thinking beyond marketing metrics

Nothing more.

Freeze means freeze.