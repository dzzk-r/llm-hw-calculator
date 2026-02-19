# Changelog

All notable changes to this project will be documented in this file.

The format loosely follows Keep a Changelog and Semantic Versioning.

---

## [0.2.0] - 2026-02-19

### Added
- Docked SidePanel with scaling chart + full context table
- Realistic KV modeling (alignment, fragmentation, metadata overhead)
- Engine presets (llama.cpp, vLLM, TensorRT-LLM, KV INT8, KV INT4)
- KV quantization modeling with group size and scale metadata
- Runtime overhead sliders (copies, paging, block headers)
- Profile export/import JSON snapshot system
- Sliding window realism support
- Pessimistic bandwidth sanity knobs

### Improved
- Separation of compute-bound vs bandwidth-bound tok/s
- KV cache alignment & packing logic
- Quantization overhead modeling

### Technical
- Refactored file structure into src/
- Release tagging (v0.2.0)

---

## [0.1.0] - 2026-02-18

### Baseline
- Initial LLM hardware calculator
- Weights + KV memory modeling
- Compute vs bandwidth tok/s estimation
- Basic presets for model and hardware

