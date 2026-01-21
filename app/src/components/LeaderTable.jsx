export default function LeaderTable({ data }) {
  const rows = [...data].map(d => ({
    name: `${d.channel}:${d.platform}`,
    revenue: Number(d.revenue || 0),
    cost: Number(d.cost || 0),
    conv: Number(d.conversions || 0),
    clicks: Number(d.clicks || 0),
  })).map(r => ({
    ...r,
    roas: r.cost ? r.revenue / r.cost : 0,
    cvr: r.clicks ? r.conv / r.clicks : 0,
  })).sort((a,b) => b.roas - a.roas);

  return (
    <div className="bg-white p-4 rounded-2xl">
      <div className="text-sm text-title font-semibold mb-2">Channel Leaderboard</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2 pr-4">Channel</th>
              <th className="py-2 pr-4">Revenue</th>
              <th className="py-2 pr-4">Cost</th>
              <th className="py-2 pr-4">ROAS</th>
              <th className="py-2 pr-0">CVR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.name} className="border-t border-gray-300">
                <td className="py-2 pr-4">{r.name}</td>
                <td className="py-2 pr-4">${r.revenue.toLocaleString()}</td>
                <td className="py-2 pr-4">${r.cost.toLocaleString()}</td>
                <td className="py-2 pr-4">{r.roas.toFixed(2)}×</td>
                <td className="py-2 pr-0">{(r.cvr*100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
