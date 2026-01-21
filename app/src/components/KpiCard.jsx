export default function KpiCard({
  label,
  value,
  variant = "primary",
  icon = null,
  bgClass = "",
  fgClass = "",
}) {
  const variantBg = {
    primary: "bg-gradient-to-r from-primary to-indigo text-white",
    cyan: "bg-gradient-to-r from-cyan to-blue text-white",
    plain: "bg-surface text-title",
  }[variant];

  const labelColor = variant === "plain" ? "text-muted" : "text-white/80";

  return (
    <div className={`rounded-card border-soft p-4 ${variantBg}`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`grid h-10 w-10 place-items-center rounded-full ${bgClass}`}>
            <span className={`${fgClass}`}>{icon}</span>
          </div>
        )}

        <div className="flex flex-col">
          <div className={`text-sm ${labelColor}`}>{label}</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
        </div>
      </div>
    </div>
  );
}
