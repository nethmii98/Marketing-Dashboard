export default function Filters({ byChannel, value, onChange }) {
  const options = Array.from(new Set(byChannel.map(d => `${d.channel}:${d.platform}`)));
  return (
    <div className="flex gap-2 items-center mb-4">
      <label className="text-sm text-gray-600">Filter:</label>
      <select className="border rounded-lg px-3 py-2" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
