import { WEIGHT_DTYPE_BYTES, KV_DTYPE_BYTES } from "./presets.js";

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
