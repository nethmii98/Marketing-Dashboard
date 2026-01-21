import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function RoasScatter({ data }) {
  const points = data.map(d => ({
    platform: `${d.channel}:${d.platform}`,
    cost: Number(d.cost || 0),
    revenue: Number(d.revenue || 0),
    conv: Number(d.conversions || 0),
  }));

  return (
    <div className="bg-white p-4 rounded-2xl shadow border">
      <div className="text-sm text-gray-700 mb-2">Cost vs Revenue (bubble = conversions)</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 24, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="0" />
            <XAxis dataKey="cost" name="Cost" axisLine={false} tickLine={false} />
            <YAxis dataKey="revenue" name="Revenue" axisLine={false} tickLine={false} />
            <ZAxis dataKey="conv" range={[60, 360]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend content={() => null} />
            <Scatter name="Channel" data={points} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
