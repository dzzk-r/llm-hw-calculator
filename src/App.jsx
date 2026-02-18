import React, { useMemo, useState } from "react";
import {
  DEFAULT_CONTEXT_OPTIONS,
  HARDWARE_PRESETS,
  KV_DTYPE_BYTES,
  MODEL_PRESETS,
  WEIGHT_DTYPE_BYTES,
  IMPOSSIBLE_TRICKS,
} from "./lib/presets.js";
import { loadProfiles, saveProfiles } from "./lib/storage.js";
import {
  bytesToGiB,
  effectiveKvTokens,
  kvBytesPerToken,
  tokPerSecBandwidth,
  tokPerSecCompute,
  weightsBytes
} from "./lib/math.js";

import Card from "./components/Card.jsx";
import Badge from "./components/Badge.jsx";
import Input from "./components/Input.jsx";
import Select from "./components/Select.jsx";
import Slider from "./components/Slider.jsx";
import Toggle from "./components/Toggle.jsx";
import SectionTitle from "./components/SectionTitle.jsx";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

import Modal from "./components/Modal.jsx";

function fmt(n, digits=2) {
  return Number(n).toFixed(digits);
}

function GiB(n) {
  return `${fmt(n, 2)} GiB`;
}

function classify({ totalGiB, ramGiB, tokSecFinal, context, kvTokensEff, paramsB }) {
  const memOk = totalGiB <= ramGiB * 0.92; // leave headroom
  const speedOk = tokSecFinal >= 20;

  const hugeContext = context >= 128000 && paramsB >= 15;
  const kvHuge = kvTokensEff >= 128000;

  if (!memOk) return { tone: "bad", text: "Not enough RAM (won’t load / will thrash)" };
  if (hugeContext && kvHuge && tokSecFinal >= 20) return { tone: "warn", text: "Suspicious: 128k+ & big model @20+ tok/s needs tricks" };
  if (speedOk) return { tone: "ok", text: "Plausible for 20+ tok/s (given assumptions)" };
  return { tone: "warn", text: "Loads, but 20+ tok/s unlikely (memory/bandwidth bound)" };
}

function TooltipFmt({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-xs">
      <div className="text-zinc-400 mb-1">Context: <span className="text-zinc-200">{label}</span></div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span className="text-zinc-400">{p.name}</span>
          <span className="text-zinc-200">{fmt(p.value, 2)}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [badgeModal, setBadgeModal] = useState({ open: false, key: null });

  const BADGE_INFO = {
    ui: {
      title: "UI: English",
      body: (
        <>
          <p className="text-zinc-300">
            The UI is intentionally English for easy sharing and hosting. Your original discussion can stay RU/HE,
            but the calculator remains “exportable”.
          </p>
        </>
      ),
    },
    kv: {
      title: "KV-aware",
      body: (
        <>
          <p className="text-zinc-300">
            Memory is split into <b>weights</b> and <b>KV cache</b>. KV scales linearly with effective KV tokens and
            often dominates at 8k+ contexts.
          </p>
          <ul className="list-disc pl-5 mt-2 text-zinc-400 text-sm">
            <li>KV per token ≈ 2 × layers × head_dim × kvHeads × bytes</li>
            <li>“128k context” claims usually rely on sliding windows / GQA / KV quant</li>
          </ul>
        </>
      ),
    },
    edge: {
      title: "Edge presets",
      body: (
        <>
          <p className="text-zinc-300">
            One-click configs intended to reflect edge constraints (RAM/bandwidth). They’re not “benchmarks” —
            they’re guardrails to expose impossible marketing.
          </p>
        </>
      ),
    },
    profiles: {
      title: "Profiles",
      body: (
        <>
          <p className="text-zinc-300">
            Hardware profiles are stored locally in <b>localStorage</b> (no backend). Save/apply/delete quickly.
          </p>
        </>
      ),
    },
  };

  const [profiles, setProfiles] = useState(() => loadProfiles());

  // Model
  const [modelPreset, setModelPreset] = useState("10b");
  const preset = MODEL_PRESETS.find(p => p.id === modelPreset) ?? MODEL_PRESETS[1];

  const [paramsB, setParamsB] = useState(preset.paramsB);
  const [layers, setLayers] = useState(preset.layers);
  const [hidden, setHidden] = useState(preset.hidden);
  const [heads, setHeads] = useState(preset.heads);
  const [kvHeads, setKvHeads] = useState(preset.kvHeads);

  // Dtypes
  const [weightDtype, setWeightDtype] = useState("int4");
  const [kvDtype, setKvDtype] = useState("fp16");

  // Overheads
  const [quantOverheadPct, setQuantOverheadPct] = useState(20);
  const [runtimeOverheadGiB, setRuntimeOverheadGiB] = useState(1.5);

  // Context
  const [context, setContext] = useState(4096);
  const [slidingWindowEnabled, setSlidingWindowEnabled] = useState(false);
  const [slidingWindow, setSlidingWindow] = useState(8192);

  // Perf model
  const [tops, setTops] = useState(26);
  const [utilization, setUtilization] = useState(2); // percent
  const [bandwidthPreset, setBandwidthPreset] = useState("ddr4-3200-2ch");
  const bwPresetObj = HARDWARE_PRESETS.find(h => h.id === bandwidthPreset) ?? HARDWARE_PRESETS[0];
  const [bandwidthGBsManual, setBandwidthGBsManual] = useState(bwPresetObj.bandwidthGBs);
  const bandwidthGBs = bandwidthPreset === "manual" ? bandwidthGBsManual : bwPresetObj.bandwidthGBs;

  // Bandwidth heuristics knobs (pessimistic by design)
  const [attnReadFactor, setAttnReadFactor] = useState(1.0);
  const [weightsReadFactor, setWeightsReadFactor] = useState(1.0);

  // RAM target (what user “has”)
  const [ramGiB, setRamGiB] = useState(32);

  // Apply preset -> values
  function applyModelPreset(id) {
    const p = MODEL_PRESETS.find(x => x.id === id);
    if (!p) return;
    setModelPreset(id);
    setParamsB(p.paramsB);
    setLayers(p.layers);
    setHidden(p.hidden);
    setHeads(p.heads);
    setKvHeads(p.kvHeads);
  }

  const computed = useMemo(() => {
    const kvTokensEff = effectiveKvTokens({ context, slidingWindowEnabled, slidingWindow });
    const wBytes = weightsBytes({ paramsB, weightDtype, quantOverheadPct });
    const kvPerTokBytes = kvBytesPerToken({ layers, hidden, heads, kvHeads, kvDtype });
    const kvBytesTotal = kvPerTokBytes * kvTokensEff;

    const totalGiB = bytesToGiB(wBytes + kvBytesTotal) + runtimeOverheadGiB;
    const weightsGiB = bytesToGiB(wBytes);
    const kvGiB = bytesToGiB(kvBytesTotal);

    const tokSecCompute = tokPerSecCompute({
      paramsB,
      tops,
      utilization: utilization / 100,
    });

    const tokSecBW = tokPerSecBandwidth({
      bandwidthGBs,
      weightsBytesTotal: wBytes,
      weightsReadFactor,
      kvBytesPerTok: kvPerTokBytes,
      kvTokens: kvTokensEff,
      attnReadFactor,
    });

    const tokSecFinal = Math.min(tokSecCompute, tokSecBW);

    const status = classify({ totalGiB, ramGiB, tokSecFinal, context, kvTokensEff, paramsB });

    const flags = [];
    if (context >= 128000 && !slidingWindowEnabled) flags.push("Full 128k KV grows linearly; edge RAM explodes.");
    if (kvHeads === heads) flags.push("No GQA/MQA (kvHeads=heads) → KV is maximal.");
    if (kvDtype === "fp16") flags.push("KV FP16 is common, but heavy; INT8 KV halves KV size.");
    if (tokSecFinal < 20 && totalGiB <= ramGiB) flags.push("You fit in RAM but bandwidth/runtime likely caps tok/s.");
    if (totalGiB > ramGiB) flags.push("RAM insufficient → paging/offload → tok/s collapses.");

    return {
      kvTokensEff,
      weightsGiB,
      kvGiB,
      totalGiB,
      kvPerTokMB: (kvPerTokBytes / (1024 * 1024)),
      tokSecCompute,
      tokSecBW,
      tokSecFinal,
      status,
      flags
    };
  }, [
    paramsB, layers, hidden, heads, kvHeads,
    weightDtype, kvDtype,
    quantOverheadPct, runtimeOverheadGiB,
    context, slidingWindowEnabled, slidingWindow,
    tops, utilization,
    bandwidthGBs, attnReadFactor, weightsReadFactor,
    ramGiB
  ]);

  const contextTable = useMemo(() => {
    return DEFAULT_CONTEXT_OPTIONS.map((ctx) => {
      const kvTokensEff = effectiveKvTokens({ context: ctx, slidingWindowEnabled, slidingWindow });
      const wBytes = weightsBytes({ paramsB, weightDtype, quantOverheadPct });
      const kvPerTokBytes = kvBytesPerToken({ layers, hidden, heads, kvHeads, kvDtype });
      const kvBytesTotal = kvPerTokBytes * kvTokensEff;

      const totalGiB = bytesToGiB(wBytes + kvBytesTotal) + runtimeOverheadGiB;
      const kvGiB = bytesToGiB(kvBytesTotal);

      const tokSecCompute = tokPerSecCompute({ paramsB, tops, utilization: utilization / 100 });
      const tokSecBW = tokPerSecBandwidth({
        bandwidthGBs,
        weightsBytesTotal: wBytes,
        weightsReadFactor,
        kvBytesPerTok: kvPerTokBytes,
        kvTokens: kvTokensEff,
        attnReadFactor,
      });
      const tokSecFinal = Math.min(tokSecCompute, tokSecBW);

      return {
        context: ctx,
        kvGiB,
        totalGiB,
        tokSecFinal,
        tokSecBW,
        tokSecCompute,
      };
    });
  }, [
    paramsB, layers, hidden, heads, kvHeads,
    weightDtype, kvDtype,
    quantOverheadPct, runtimeOverheadGiB,
    slidingWindowEnabled, slidingWindow,
    tops, utilization,
    bandwidthGBs, attnReadFactor, weightsReadFactor
  ]);

  // SaaS-lite profiles
  function saveCurrentProfile() {
    const name = prompt("Profile name (e.g., 'MiniPC DDR5 64GB'):");
    if (!name) return;
    const p = {
      id: crypto.randomUUID(),
      name,
      ramGiB,
      bandwidthGBs,
      note: "Saved locally (localStorage)",
      createdAt: new Date().toISOString(),
    };
    const next = [p, ...profiles].slice(0, 20);
    setProfiles(next);
    saveProfiles(next);
  }

  function applyProfile(p) {
    setRamGiB(p.ramGiB);
    setBandwidthPreset("manual");
    setBandwidthGBsManual(p.bandwidthGBs);
  }

  function deleteProfile(id) {
    const next = profiles.filter(p => p.id !== id);
    setProfiles(next);
    saveProfiles(next);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <div className="text-2xl font-semibold">LLM Hardware Calculator</div>
            <div className="text-sm text-zinc-400 mt-1">
              Memory (weights + KV) + compute & bandwidth sanity checks. Designed to expose “marketing nonsense”.
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge
              tone="info"
              title="Click for details"
              onClick={() => setBadgeModal({ open: true, key: "ui" })}
            >
              UI: English
            </Badge>
            <Badge
               tone="neutral"
               title="Click for details"
               onClick={() => setBadgeModal({ open: true, key: "kv" })}
            >
              KV-aware
            </Badge>
            <Badge
              tone="neutral"
              title="Click for details"
              onClick={() => setBadgeModal({ open: true, key: "edge" })}
            >
              Edge presets
            </Badge>
            <Badge
              tone="neutral"
              title="Click for details"
              onClick={() => setBadgeModal({ open: true, key: "profiles" })}
            >
              Profiles
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Model">
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Preset"
                value={modelPreset}
                onChange={applyModelPreset}
                options={MODEL_PRESETS.map(p => ({ value: p.id, label: p.label }))}
              />
              <Input label="Params (B)" value={paramsB} onChange={setParamsB} min={0.1} step={0.5} />
              <Input label="Layers" value={layers} onChange={setLayers} min={1} step={1} />
              <Input label="Hidden" value={hidden} onChange={setHidden} min={256} step={128} />
              <Input label="Heads" value={heads} onChange={setHeads} min={1} step={1} />
              <Input label="KV Heads (GQA/MQA)" value={kvHeads} onChange={setKvHeads} min={1} step={1} />
            </div>
            <div className="mt-3 text-xs text-zinc-500">
              KV size scales with <span className="text-zinc-300">layers × head_dim × kvHeads × tokens</span>.
            </div>
          </Card>

          <Card title="Precision & overheads">
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Weights dtype"
                value={weightDtype}
                onChange={setWeightDtype}
                options={Object.keys(WEIGHT_DTYPE_BYTES).map(k => ({ value: k, label: k }))}
              />
              <Select
                label="KV dtype"
                value={kvDtype}
                onChange={setKvDtype}
                options={Object.keys(KV_DTYPE_BYTES).map(k => ({ value: k, label: k }))}
              />
            </div>

            <div className="mt-4 space-y-3">
              <Slider
                label="Quant metadata overhead"
                value={quantOverheadPct}
                onChange={setQuantOverheadPct}
                min={0}
                max={50}
                step={1}
                suffix="%"
              />
              <Slider
                label="Runtime overhead (framework, buffers)"
                value={runtimeOverheadGiB}
                onChange={setRuntimeOverheadGiB}
                min={0}
                max={8}
                step={0.1}
                suffix=" GiB"
              />
            </div>

            <div className="mt-3 text-xs text-zinc-500">
              INT4 weights are “minimum”; real engines add scales/zeros + workspace.
            </div>
          </Card>

          <Card
            title="Hardware + performance"
            right={<button onClick={saveCurrentProfile} className="text-xs px-2 py-1 rounded-lg border border-zinc-700 hover:border-zinc-500" type="button">Save profile</button>}
          >
            <div className="grid grid-cols-2 gap-3">
              <Input label="RAM available (GiB)" value={ramGiB} onChange={setRamGiB} min={1} step={1} />
              <Input label="TOPS (peak @ chosen accel dtype)" value={tops} onChange={setTops} min={0} step={1} />
            </div>

            <div className="mt-4 space-y-3">
              <Slider
                label="LLM utilization (compute)"
                value={utilization}
                onChange={setUtilization}
                min={0.2}
                max={20}
                step={0.1}
                suffix="%"
              />
              <Select
                label="Memory bandwidth preset"
                value={bandwidthPreset}
                onChange={(v) => { setBandwidthPreset(v); }}
                options={HARDWARE_PRESETS.map(h => ({ value: h.id, label: h.label }))}
              />
              {bandwidthPreset === "manual" ? (
                <Input label="Bandwidth (GB/s)" value={bandwidthGBsManual} onChange={setBandwidthGBsManual} min={1} step={1} />
              ) : (
                <div className="text-xs text-zinc-500">Using preset: <span className="text-zinc-300">{bandwidthGBs} GB/s peak</span> (sustained lower).</div>
              )}

              <SectionTitle>Bandwidth sanity knobs (pessimistic)</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <Slider label="Attn read factor" value={attnReadFactor} onChange={setAttnReadFactor} min={0.2} max={2.0} step={0.1} />
                <Slider label="Weights read factor" value={weightsReadFactor} onChange={setWeightsReadFactor} min={0.2} max={2.0} step={0.1} />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">Verdict</div>
                <Badge tone={computed.status.tone}>{computed.status.text}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div className="text-zinc-400">Weights</div>
                <div className="text-right">{GiB(computed.weightsGiB)}</div>

                <div className="text-zinc-400">KV cache</div>
                <div className="text-right">{GiB(computed.kvGiB)}</div>

                <div className="text-zinc-400">Total (incl. overhead)</div>
                <div className="text-right font-semibold">{GiB(computed.totalGiB)}</div>

                <div className="text-zinc-400">KV / token</div>
                <div className="text-right">{fmt(computed.kvPerTokMB, 2)} MB</div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                  <div className="text-zinc-400">tok/s (compute)</div>
                  <div className="text-zinc-200 font-semibold">{fmt(computed.tokSecCompute, 2)}</div>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                  <div className="text-zinc-400">tok/s (bandwidth)</div>
                  <div className="text-zinc-200 font-semibold">{fmt(computed.tokSecBW, 2)}</div>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                  <div className="text-zinc-400">tok/s (final)</div>
                  <div className="text-zinc-200 font-semibold">{fmt(computed.tokSecFinal, 2)}</div>
                </div>
              </div>

              {computed.flags.length ? (
                <div className="mt-3 space-y-1">
                  {computed.flags.map((f, i) => (
                    <div key={i} className="text-xs text-zinc-400">• {f}</div>
                  ))}
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <Card title="Context controls (the KV bomb)">
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Context length"
                value={String(context)}
                onChange={(v) => setContext(Number(v))}
                options={DEFAULT_CONTEXT_OPTIONS.map(c => ({ value: String(c), label: String(c) }))}
              />
              <Input label="Custom context" value={context} onChange={setContext} min={256} step={256} />
            </div>

            <div className="mt-4 space-y-3">
              <Toggle
                label="Sliding window enabled"
                checked={slidingWindowEnabled}
                onChange={setSlidingWindowEnabled}
                hint="Caps KV tokens to a window; makes '128k prompt' feasible without 128k KV."
              />
              <Input
                label="Sliding window size (tokens)"
                value={slidingWindow}
                onChange={setSlidingWindow}
                min={512}
                step={256}
              />
            </div>

            <div className="mt-3 text-xs text-zinc-500">
              Effective KV tokens: <span className="text-zinc-200 font-semibold">{computed.kvTokensEff}</span>
            </div>
          </Card>

          <Card title="Edge-AI “sane defaults”">
            <div className="text-xs text-zinc-400 mb-2">
              One-click configurations that match real edge constraints.
            </div>
            <div className="grid gap-2">
              <button
                className="text-left rounded-xl border border-zinc-800 hover:border-zinc-600 bg-zinc-950 px-3 py-2"
                type="button"
                onClick={() => {
                  applyModelPreset("7b");
                  setWeightDtype("int4");
                  setKvDtype("fp16");
                  setContext(4096);
                  setSlidingWindowEnabled(false);
                  setRamGiB(16);
                  setBandwidthPreset("lpddr5x-8533");
                  setTops(26);
                  setUtilization(2);
                }}
              >
                <div className="text-sm text-zinc-200">Edge Lite (7B, 4k, 16GiB)</div>
                <div className="text-xs text-zinc-500">Plausible 20+ tok/s with good runtime (depends on accel).</div>
              </button>

              <button
                className="text-left rounded-xl border border-zinc-800 hover:border-zinc-600 bg-zinc-950 px-3 py-2"
                type="button"
                onClick={() => {
                  applyModelPreset("10b");
                  setWeightDtype("int4");
                  setKvDtype("fp16");
                  setContext(8192);
                  setSlidingWindowEnabled(false);
                  setRamGiB(32);
                  setBandwidthPreset("ddr5-5600-2ch");
                  setTops(26);
                  setUtilization(2);
                }}
              >
                <div className="text-sm text-zinc-200">Edge Pro (10B, 8k, 32GiB DDR5)</div>
                <div className="text-xs text-zinc-500">KV math regime; shows where DDR4 starts choking.</div>
              </button>

              <button
                className="text-left rounded-xl border border-zinc-800 hover:border-zinc-600 bg-zinc-950 px-3 py-2"
                type="button"
                onClick={() => {
                  applyModelPreset("30b");
                  setWeightDtype("int4");
                  setKvDtype("int8");
                  setContext(128000);
                  setSlidingWindowEnabled(true);
                  setSlidingWindow(8192);
                  setRamGiB(64);
                  setBandwidthPreset("ddr5-5600-2ch");
                  setTops(60);
                  setUtilization(3);
                  // Approximate: set kvHeads smaller than heads (GQA-ish)
                  setKvHeads(Math.max(8, Math.floor(heads / 4)));
                }}
              >
                <div className="text-sm text-zinc-200">“128k prompt” reality check (30B, sliding 8k, INT8 KV)</div>
                <div className="text-xs text-zinc-500">How “128k+” is marketed without 200GB KV.</div>
              </button>
            </div>
          </Card>

          <Card title="Saved hardware profiles (SaaS-lite)">
            <div className="text-xs text-zinc-500 mb-2">
              Stored in <span className="text-zinc-300">localStorage</span>. No backend.
            </div>
            {profiles.length === 0 ? (
              <div className="text-sm text-zinc-400">No profiles yet. Click “Save profile”.</div>
            ) : (
              <div className="space-y-2">
                {profiles.map((p) => (
                  <div key={p.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-zinc-200 font-semibold">{p.name}</div>
                        <div className="text-xs text-zinc-500 mt-1">
                          RAM: <span className="text-zinc-300">{p.ramGiB} GiB</span> · BW: <span className="text-zinc-300">{p.bandwidthGBs} GB/s</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs px-2 py-1 rounded-lg border border-zinc-700 hover:border-zinc-500" type="button" onClick={() => applyProfile(p)}>
                          Apply
                        </button>
                        <button className="text-xs px-2 py-1 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200" type="button" onClick={() => deleteProfile(p.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Card title="Scaling table + chart">
            <div className="text-xs text-zinc-500 mb-2">
              KV & tok/s evolve with context (effective KV respects sliding window).
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={contextTable}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="context" />
                  <YAxis />
                  <Tooltip content={<TooltipFmt />} />
                  <Legend />
                  <Line type="monotone" dataKey="totalGiB" name="Total GiB" dot={false} />
                  <Line type="monotone" dataKey="tokSecFinal" name="tok/s (final)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs border border-zinc-800 rounded-xl overflow-hidden">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="text-left p-2 border-b border-zinc-800">Context</th>
                    <th className="text-right p-2 border-b border-zinc-800">KV (GiB)</th>
                    <th className="text-right p-2 border-b border-zinc-800">Total (GiB)</th>
                    <th className="text-right p-2 border-b border-zinc-800">tok/s final</th>
                  </tr>
                </thead>
                <tbody>
                  {contextTable.map((r) => (
                    <tr key={r.context} className="odd:bg-zinc-950 even:bg-zinc-950/60">
                      <td className="p-2 border-b border-zinc-900">{r.context}</td>
                      <td className="p-2 border-b border-zinc-900 text-right">{fmt(r.kvGiB, 2)}</td>
                      <td className="p-2 border-b border-zinc-900 text-right">{fmt(r.totalGiB, 2)}</td>
                      <td className="p-2 border-b border-zinc-900 text-right">{fmt(r.tokSecFinal, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="“Impossible” explanations (how people claim 128k on 8–16GB)">
            <div className="text-xs text-zinc-500 mb-3">
              Common escape hatches. If someone claims “30B + 128k + 8GB DDR4 + 20+ tok/s”, one of these is used — or it’s nonsense.
            </div>

            <div className="space-y-3">
              {IMPOSSIBLE_TRICKS.map((t) => (
                <div key={t.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-zinc-200 font-semibold">{t.title}</div>
                    <Badge tone="info">escape hatch</Badge>
                  </div>
                  <div className="text-xs text-zinc-400 mt-2">Effect: {t.effect}</div>
                  <div className="text-xs text-zinc-500 mt-1">What changes: {t.whatChanges}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-400">
              <div className="font-semibold text-zinc-200 mb-1">Important: prefill vs decode</div>
              People often quote “tokens/sec” from prefill or averaged throughput. Real chat UX cares about <span className="text-zinc-200">decode tok/s</span>.
            </div>
          </Card>
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Disclaimer: model shapes are approximate; bandwidth model is intentionally pessimistic to flag impossible claims.
        </div>
      </div>
      <Modal
        open={badgeModal.open}
        title={BADGE_INFO[badgeModal.key]?.title ?? "Info"}
         onClose={() => setBadgeModal({ open: false, key: null })}
      >
        {BADGE_INFO[badgeModal.key]?.body ?? null}
      </Modal>
    </div>
  );
}
