export const WEIGHT_DTYPE_BYTES = {
  int4: 0.5,
  int8: 1,
  int16: 2,
  fp16: 2,
  fp32: 4,
};

export const KV_DTYPE_BYTES = {
  int8: 1,
  fp16: 2,
};

export const DEFAULT_CONTEXT_OPTIONS = [
  1024, 2048, 4096, 8192,
  16384, 32768, 65536, 128000
];

// “Llama-like-ish” shapes. These are not exact specs, but sane defaults for orders-of-magnitude.
export const MODEL_PRESETS = [
  { id: "7b",  label: "7B (approx)",  paramsB: 7,  layers: 32, hidden: 4096, heads: 32, kvHeads: 32 },
  { id: "10b", label: "10B (approx)", paramsB: 10, layers: 40, hidden: 4608, heads: 36, kvHeads: 36 },
  { id: "13b", label: "13B (approx)", paramsB: 13, layers: 40, hidden: 5120, heads: 40, kvHeads: 40 },
  { id: "15b", label: "15B (approx)", paramsB: 15, layers: 48, hidden: 6144, heads: 48, kvHeads: 48 },
  { id: "30b", label: "30B (approx)", paramsB: 30, layers: 60, hidden: 6656, heads: 52, kvHeads: 52 },
];

// Bandwidth numbers are approximate peak. Real sustained is lower.
export const HARDWARE_PRESETS = [
  { id: "ddr4-3200-2ch", label: "DDR4-3200 (2ch) ~51 GB/s peak", bandwidthGBs: 51 },
  { id: "ddr5-5600-2ch", label: "DDR5-5600 (2ch) ~90 GB/s peak", bandwidthGBs: 90 },
  { id: "lpddr5-6400",   label: "LPDDR5-6400 ~51 GB/s peak",     bandwidthGBs: 51 },
  { id: "lpddr5x-8533",  label: "LPDDR5X-8533 ~68 GB/s peak",   bandwidthGBs: 68 },
  { id: "hbm2e",         label: "HBM2e class ~800 GB/s peak",    bandwidthGBs: 800 },
  { id: "manual",        label: "Manual (set your own)",         bandwidthGBs: 75 },
];

export const IMPOSSIBLE_TRICKS = [
  {
    id: "sliding",
    title: "Sliding Window / Local Attention",
    effect: "Caps effective KV tokens to a window (e.g. 4k–16k) even if prompt is 128k+.",
    whatChanges: "Memory becomes O(window), not O(full_context). Quality depends on task.",
  },
  {
    id: "gqa",
    title: "GQA / MQA",
    effect: "Reduces KV heads (kvHeads << heads), cutting KV size ~linearly.",
    whatChanges: "KV bytes/tok drops by heads/kvHeads factor.",
  },
  {
    id: "kvquant",
    title: "KV Quantization (INT8/FP8)",
    effect: "Cuts KV bytes by ~2× vs FP16 (or more with FP8).",
    whatChanges: "Quality/stability varies; depends on runtime & model.",
  },
  {
    id: "paged",
    title: "Paged KV / KV Cache Paging",
    effect: "Better memory management, fewer stalls, better locality.",
    whatChanges: "Doesn’t magically remove KV cost, but improves survivability.",
  },
  {
    id: "offload",
    title: "KV Offload (RAM↔SSD) / Unified Memory tricks",
    effect: "Makes 'it runs' possible when RAM is insufficient.",
    whatChanges: "Tokens/sec collapses; useful for demos, not for 20+ tok/s.",
  },
];
