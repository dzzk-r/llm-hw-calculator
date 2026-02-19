import {
  WEIGHT_DTYPE_BYTES,
  KV_DTYPE_BYTES,
  KV_DTYPE_OVERHEAD,
  KV_QUANT_SCHEMES,
} from "./presets.js";

export function bytesToGiB(bytes) {
  return bytes / (1024 ** 3);
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * KV bytes per token (approx):
 * 2 * layers * head_dim * kvHeads * bytesPerElement
 * where head_dim = hidden / heads
 */
export function kvBytesPerToken({ layers, hidden, heads, kvHeads, kvDtype }) {
  const headDim = hidden / heads;
  const b = KV_DTYPE_BYTES[kvDtype] ?? 2;
  return 2 * layers * headDim * kvHeads * b;
}

export function weightsBytes({ paramsB, weightDtype, quantOverheadPct }) {
  const params = paramsB * 1e9;
  const b = WEIGHT_DTYPE_BYTES[weightDtype] ?? 2;
  const raw = params * b;
  const overhead = raw * (quantOverheadPct / 100);
  return raw + overhead;
}

export function kvBytesPerTokenRealistic({
  layers,
  hidden,
  heads,
  kvHeads,
  kvDtype,
  kvSchemeId = "none",
  groupSize = 64,
  alignment = 256,          // bytes alignment per token chunk (heuristic)
  copiesFactor = 1.10,      // runtime copies/fragmentation factor
  blockOverheadPct = 0,     // optional extra overhead
}) {
  // base elems per token for K+V
  // We keep your assumption: base dims ~ layers * hidden (Llama-like approximation)
  const headDim = hidden / Math.max(1, heads);
  const elemsPerToken = 2 * layers * headDim * Math.max(1, kvHeads);

  const dtypeBytes = KV_DTYPE_BYTES[kvDtype] ?? 2;

  const scheme = KV_QUANT_SCHEMES.find((s) => s.id === kvSchemeId) ?? KV_QUANT_SCHEMES[0];

  // 1) value storage bytes (+ dtype overhead heuristic)
  const dtypeOver = KV_DTYPE_OVERHEAD?.[kvDtype] ?? 1.0;
  const valueBytes = elemsPerToken * dtypeBytes * dtypeOver * (scheme.bytesPerElemMul ?? 1.0);

  // 2) quant metadata: scale bytes per group
  // group count ≈ elems / groupSize (ceil)
  const groups = Math.ceil(elemsPerToken / Math.max(1, groupSize));
  const metaBytes = groups * (scheme.metaPerGroupBytes ?? 0);

  // 3) pack/alignment: pad total to alignment boundary
  const raw = valueBytes + metaBytes;
  const aligned = alignment > 0 ? Math.ceil(raw / alignment) * alignment : raw;

  // 4) runtime copies / fragmentation
  const withCopies = aligned * Math.max(1.0, copiesFactor);

  // 5) optional extra overhead (workspace/paging headers etc)
  const total = withCopies * (1 + (blockOverheadPct / 100));

  return total;
}


/**
 * Effective KV tokens:
 * - if slidingWindowEnabled, KV tokens = min(context, window)
 * - otherwise KV tokens = context
 */
export function effectiveKvTokens({ context, slidingWindowEnabled, slidingWindow }) {
  if (!slidingWindowEnabled) return context;
  return Math.min(context, slidingWindow);
}

/**
 * Compute-limited estimate:
 * ops/token ≈ 2 * params
 * tok/s ≈ (TOPS * utilization * 1e12) / opsPerTok
 */
export function tokPerSecCompute({ paramsB, tops, utilization }) {
  const params = paramsB * 1e9;
  const opsPerTok = 2 * params;
  const effTops = tops * utilization;
  if (opsPerTok <= 0) return 0;
  return (effTops * 1e12) / opsPerTok;
}

/**
 * Bandwidth-limited *sanity* estimate (very rough, intentionally pessimistic):
 * bytes/token ≈ weightsReadFactor*weightsBytes + attnReadFactor*(kvBytesPerTok*KV_tokens)
 */
export function tokPerSecBandwidth({
  bandwidthGBs,
  weightsBytesTotal,
  weightsReadFactor,
  kvBytesPerTok,
  kvTokens,
  attnReadFactor,
}) {
  const bandwidthBytes = bandwidthGBs * (1024 ** 3);
  const bytesPerToken =
    (weightsReadFactor * weightsBytesTotal) +
    (attnReadFactor * kvBytesPerTok * kvTokens);

  if (bytesPerToken <= 0) return 0;
  return bandwidthBytes / bytesPerToken;
}
