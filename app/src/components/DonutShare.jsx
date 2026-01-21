import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DonutShare({ data, title, dataKey = "revenue" }) {
  const chartData = data.map(d => ({
    name: `${d.channel}:${d.platform}`,
    value: Number(d[dataKey] || 0),
  }));

  
  const PALETTE = [
    "var(--color-indigo)",
    "var(--color-orange)",
    "var(--color-watermelon)",
    "var(--color-lightblue)",
    "var(--color-indigo-light)",
    "var(--color-orange-light)",
    "var(--color-watermelon-light)"

  ];

  return (
    <div className="bg-white p-4 rounded-2xl">
      <div className="text-sm text-title font-semibold mb-2">{title}</div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 15, left: 0, bottom: -5 }}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="90%"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              content={({ payload }) => (
                <ul className="text-[10px] text-gray-500 flex flex-wrap gap-3 mt-2">
                  {payload.map((entry, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>{entry.value.split(":")[1]}</span>
                    </li>
                  ))}
                </ul>
              )}
            />


          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
