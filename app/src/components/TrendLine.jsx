import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TrendLine({ data, yKey, title, stroke = "var(--color-indigo)" }) {
  return (
    <div className="bg-surface p-4 rounded-card shadow border border-soft">
      <div className="text-sm text-title font-semibold mb-2">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="0" />
            <XAxis dataKey="date" hide />
            <YAxis tickFormatter={(v) => `$${(v / 1000)}K`} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={stroke}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
