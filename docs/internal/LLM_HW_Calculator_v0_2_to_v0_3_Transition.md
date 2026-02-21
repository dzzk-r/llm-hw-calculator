# LLM HW Calculator --- v0.2 → v0.3 Transition Declaration

## Purpose

This document formalizes the architectural transition from v0.2
(functional calculator) to v0.3 (constraint-aware inference modeling
framework).

The goal is to declare v0.3 intent already within v0.2 as a
forward-looking design layer.

------------------------------------------------------------------------

# 1. Interface Philosophy

v0.3 introduces a structured three-layer UI hierarchy, visible directly
in the interface.

Each layer is visually grouped using a 2--3px left border to establish
logical separation. Layers are collapsible where appropriate.

------------------------------------------------------------------------

# 2. Three-Tier Interface Model

## 🟢 Layer 1 --- Strategic / VP Friendly

Visible immediately.

Includes:

-   Regime badge (Compute / Bandwidth / KV / Spill)
-   Prefill vs Decode separation
-   Memory spill warning
-   Deterministic mode toggle

Purpose: Clear demonstration that TOPS ≠ tok/s and inference is
constraint-bound.

------------------------------------------------------------------------

## 🟡 Layer 2 --- Architectural / Principal Friendly

Structured modeling components.

Includes:

-   Memory tier abstraction (SRAM / DDR / HBM)
-   Working set fit modeling
-   KV growth visualization
-   Power envelope scaling
-   Edge survivability indicators

Purpose: Demonstrate system-level architectural reasoning.

------------------------------------------------------------------------

## 🔵 Layer 3 --- Runtime Amplification Layer (Deep & Optional)

Collapsible advanced section.

Includes:

-   Scheduler efficiency coefficient
-   Runtime copy amplification
-   Tiling inefficiency factor
-   Multi-stream contention modeling

Alias: Runtime Amplification Layer

Purpose: Expose deep systems understanding without overwhelming primary
UI.

Hidden by default, collapsible web-style.

------------------------------------------------------------------------

# 3. Sidebar as Analytical Surface

Graphs and example calculation tables remain in the SidePanel.

The SidePanel serves as:

-   Analytical output space
-   Comparative scenario explorer
-   Structured benchmarking surface

Main canvas remains conceptual. Sidebar remains analytical.

------------------------------------------------------------------------

# 4. Transitional Integrity (v0.2 → v0.3)

v0.2 remains the functional baseline.

v0.3 is introduced as:

-   Declared architectural intent
-   Structured modeling expansion
-   Hierarchical UI evolution

Even if some Layer 3 components are initially boilerplate with
release-date markers from ToDo.md, the architectural direction is
already visible.

------------------------------------------------------------------------

# 5. Architectural Identity

v0.2 = Functional calculator\
v0.3 = Constraint-aware inference modeling framework

The transition emphasizes:

-   Memory hierarchy realism
-   Decode regime modeling
-   Deterministic deployment awareness
-   Competitive architectural neutrality
-   Runtime amplification transparency

------------------------------------------------------------------------

# 6. Design Principles

1.  No marketing framing
2.  Brand-neutral abstraction
3.  Collapsible depth
4.  Explicit constraint modeling
5.  Clean visual grouping with border-based logic containers

------------------------------------------------------------------------

# Closing Note

This declaration ensures a controlled evolution from utility tool (v0.2)
to architectural artifact (v0.3), preserving clarity while adding depth.

The Runtime Amplification Layer formalizes deep-system awareness without
polluting the primary interface.
