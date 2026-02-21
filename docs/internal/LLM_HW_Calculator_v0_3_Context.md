# LLM HW Calculator --- v0.3 Architectural Context

## Executive Summary

Version 0.3 transitions the project from a hardware token estimator into
a Constraint-Aware Edge Inference Modeling Framework.

This release formalizes the distinction between theoretical accelerator
performance (TOPS) and real-world LLM throughput (tokens/sec),
introducing architectural modeling for memory hierarchy, decode regimes,
KV growth, and edge survivability.

------------------------------------------------------------------------

# 1. Core Thesis

## TOPS ≠ tok/s

v0.3 explicitly models the real bottlenecks:

-   Compute ceiling
-   Bandwidth ceiling
-   KV growth pressure
-   Decode regime dominance
-   Memory tier spill
-   Scheduler/runtime amplification

Regime classification: - Compute-bound - Bandwidth-bound - KV-bound -
SRAM-spill - Decode-dominated

------------------------------------------------------------------------

# 2. Memory Hierarchy Modeling

Memory Tiers:

1.  On-chip SRAM (MB scale)
2.  External LPDDR/DDR (GB scale)
3.  HBM-class memory (datacenter scale)

Working Set Fit condition:

    weights tile + KV working set > SRAM

Then:

-   Latency amplification
-   Bandwidth amplification
-   Scheduler pressure
-   Effective tok/s collapse

This is central to edge inference realism.

------------------------------------------------------------------------

# 3. Workload Differentiation

Workload modes:

-   LLM Decode (autoregressive)
-   LLM Prefill
-   Encoder-only (CNN / Transformer encoder)
-   Hybrid streaming

Key distinction:

-   Encoder workloads → minimal KV growth
-   Decode workloads → linear KV growth

This explains why certain edge SoCs appear competitive for encoder tasks
but degrade in long-context decode scenarios.

------------------------------------------------------------------------

# 4. Deterministic Low-Latency Mode

Deterministic Low-Latency Mode characteristics:

-   Fixed window
-   Sliding window enforced
-   No dynamic memory expansion
-   No paging
-   Latency bound priority over throughput

Relevant for:

-   Robotics
-   Industrial automation
-   Security-grade deployments
-   Edge reliability scenarios

------------------------------------------------------------------------

# 5. Edge Survivability Modeling

Added modeling dimensions:

-   Thermal throttle factor
-   Power envelope scaling
-   Graceful degradation
-   Context clipping behavior
-   KV eviction behavior

This connects inference modeling to real hardware constraints.

------------------------------------------------------------------------

# 6. Neutral Accelerator Abstraction

Brand-agnostic identifiers:

-   h8m2
-   h10hm2
-   edge-soc-small-sram
-   edge-soc-large-sram
-   datacenter-hbm

README maps these abstractions to real-world hardware.

------------------------------------------------------------------------

# 7. Decode vs Prefill Separation

Prefill → compute dominated\
Decode → memory + KV dominated

v0.3 separates:

-   Prefill tok/s
-   Decode tok/s
-   Mixed streaming estimates

------------------------------------------------------------------------

# 8. Competitive Context: Rockchip vs Hailo (2026 Landscape)

Strategic Landscape:

Rockchip (RK3668 / RK3688 + RK182X) introduces strong competition in
edge LLM acceleration.

Rockchip Strategy:

-   Integrated SoC + NPU + optional RK182X co-processor
-   Dedicated DRAM for LLM workloads
-   Strong performance/price ratio
-   Tight ecosystem integration
-   Mass-market accessibility

Hailo Positioning:

-   Discrete accelerator architecture
-   Extremely high performance-per-watt
-   Strong multi-stream vision inference
-   Industrial / automotive positioning
-   Deterministic deployment focus

Architectural Differences:

Rockchip optimizes: - Performance per dollar - Integration simplicity -
Local LLM accessibility

Hailo optimizes: - Performance per watt - Deterministic inference -
Industrial-grade deployment - Multi-stream vision

v0.3 models these architectural trade-offs rather than brand narratives.

------------------------------------------------------------------------

# 9. Relevance to Edge AI Leadership

This release demonstrates:

-   Understanding of decode vs encoder asymmetry
-   Awareness of memory hierarchy constraints
-   Edge deployment realism
-   Deterministic inference reasoning
-   Competitive ecosystem awareness
-   System-level architectural thinking

------------------------------------------------------------------------

# 10. What v0.3 Is NOT

-   Not an SDK
-   Not a benchmark suite
-   Not marketing material
-   Not runtime implementation
-   Not NDA-based documentation

It is a reasoning framework.

------------------------------------------------------------------------

# Closing Statement

v0.2 = Functional calculator\
v0.3 = Architectural modeling artifact

The project now reflects system-level understanding of edge inference
constraints, memory hierarchy realities, and competitive accelerator
dynamics.
