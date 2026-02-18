export default function Card({ title, children, right }) {
  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-4 shadow">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-sm text-zinc-200 font-semibold">{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}
