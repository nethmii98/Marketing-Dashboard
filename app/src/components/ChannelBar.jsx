import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";

// Formatters
const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",  
});
const currencyCompact = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol", 
  notation: "compact",
  maximumFractionDigits: 1,
});


const COLORS = {
  cost: "var(--color-green)", // Cost,
  earnings: "var(--color-indigo)", // Earnings
};

// Label inside cost segment
function CostLabel({ x, y, width, height, value }) {
  if (height < 16 || !value) return null;
  return (
    <text
      x={x + width / 2}
      y={y + 12}
      textAnchor="middle"
      fill="#fff"
      fontSize={12}
    >
      {currencyCompact.format(Number(value))}
    </text>
  );
}

// Label above earnings segment
function EarningsLabel({ x, y, width, value }) {
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 4}
      textAnchor="middle"
      fill="#6B7280"
      fontSize={11}
    >
      {currencyCompact.format(Number(value))}
    </text>
  );
}

export default function ChannelBar({ data, title }) {
  const chartData = (data ?? []).map((d) => {
    const revenue = Number(d?.revenue ?? 0);
    const cost = Number(d?.cost ?? 0);
    return {
      name: `${d.channel}:${d.platform}`,
      cost,
      earnings: revenue - cost,
    };
  });

  return (
    <div className="bg-white p-4 rounded-2xl">
      <div className="text-sm font-semibold text-gray-700 mb-2">
        {title || "Cost vs Earnings by Channel (30d)"}
      </div>
      <div className="h-72 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 24, right: 15, left: 0, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid vertical={false} strokeDasharray="0" />
            <XAxis dataKey="name" tickFormatter={(value) => value.split(":")[1]} height={60} tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `$${(v / 1000)}K`} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => currency.format(Number(value))}
              labelFormatter={(label) => `Source: ${label}`}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={10}
              wrapperStyle={{
                fontSize: "10px", 
                color: "var(--color-muted)", 
                marginTop: "-10px"       
              }}
            />
            <Bar dataKey="cost" fill={COLORS.cost} name="Cost">
              
            </Bar>
            <Bar dataKey="earnings" fill={COLORS.earnings} name="Earnings">
              
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
