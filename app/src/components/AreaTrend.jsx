import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AreaTrend({ data, yKey, title, stroke = "var(--color-indigo)" }) {
  return (
    <div className="bg-surface p-4 rounded-card">
      <div className="text-sm text-title font-semibold mb-2">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            {/* Grid */}
            <CartesianGrid vertical={false} strokeDasharray="0" />
            
            {/* X-Axis */}
            <XAxis dataKey="date" hide />
            
            {/* Y-Axis */}
            <YAxis 
              tickFormatter={(v) => `$${(v / 1000)}K`} 
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false} 
              tickLine={false} 
            />

            {/* Tooltip */}
            <Tooltip 
              formatter={(value) => `$${value.toLocaleString()}`} 
            />

            {/* Area Line */}
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={stroke}
              fill={stroke}
              fillOpacity={0.2}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
