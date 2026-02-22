export default function Toggle({ label, checked, onChange, hint }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm text-zinc-200">{label}</div>
        {hint ? <div className="text-xs text-zinc-500 mt-0.5">{hint}</div> : null}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full border transition ${
          checked ? "bg-emerald-700/40 border-emerald-800" : "bg-zinc-900 border-zinc-700"
        }`}
        type="button"
        aria-pressed={checked}
      >
        <div className={`h-5 w-5 rounded-full bg-zinc-200 transition translate-y-[1px] ${
          checked ? "translate-x-4" : "translate-x-1"
        }`} />
      </button>
    </div>
  );
}
