export default function Slider({ label, value, onChange, min, max, step, suffix="" }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-zinc-400">{label}</div>
        <div className="text-xs text-zinc-200">{value}{suffix}</div>
      </div>
      <input
        className="w-full"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
