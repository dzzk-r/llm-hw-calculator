export default function Input({ label, value, onChange, type="number", step, min, max }) {
  return (
    <label className="block">
      <div className="text-xs text-zinc-400 mb-1">{label}</div>
      <input
        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
        type={type}
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </label>
  );
}
