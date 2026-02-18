export default function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-zinc-800 text-zinc-200 border-zinc-700",
    ok: "bg-emerald-900/40 text-emerald-200 border-emerald-800",
    warn: "bg-amber-900/40 text-amber-200 border-amber-800",
    bad: "bg-rose-900/40 text-rose-200 border-rose-800",
    info: "bg-sky-900/40 text-sky-200 border-sky-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${tones[tone] ?? tones.neutral}`}>
      {children}
    </span>
  );
}
