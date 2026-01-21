import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MiniTrendCard({
  data,                 
  yKey = "value",
  title = "3,240",
  subtitle = "Patients this month",
  lineColor = "#ffffff",
  bgFrom = "rgb(99 102 241)",  
  bgTo = "rgb(79 70 229)",     
}) {

  const dayTick = (d) => {
    const t = typeof d === "string" ? new Date(d) : d;
    const month = String(t.getMonth() + 1).padStart(2, "0"); 
    const day = String(t.getDate()).padStart(2, "0");
    return `${month}-${day}`;
  };

  return (
    <div
      className="relative rounded-2xl p-4 text-white overflow-hidden"
      style={{
        background: `linear-gradient(90deg, ${bgTo} 0%, ${bgFrom} 100%)`,
      }}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-white/10" />

      <div className="mb-3">
        <div className="text-3xl font-extrabold leading-none">{title}</div>
        <div className="text-white/80 text-sm">{subtitle}</div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={dayTick}
              tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />

            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.3)", strokeDasharray: "3 3" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const v = payload[0].value;
                const dateStr = new Date(label).toLocaleDateString(undefined, {
                    month: "short",
                    day: "2-digit",
                    year: "numeric", 
                });
                return (
                  <div className="px-2 py-1 rounded-md text-xs bg-white text-indigo-700 shadow">
                    <div className="font-semibold">{Math.round(v)}</div>
                    <div className="text-[10px] text-indigo-700/70">{dateStr}</div>
                  </div>
                );
              }}
            />

            <defs>
              <linearGradient id="miniArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey={yKey}
              stroke={lineColor}
              strokeWidth={3}
              fill="url(#miniArea)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#ffffff",
                stroke: lineColor,
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
