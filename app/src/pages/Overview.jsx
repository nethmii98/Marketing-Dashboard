import { useMemo, useState } from "react";
import data from "../data/clean_metrics.json";

import KpiCard from "../components/KpiCard";
import TrendLine from "../components/TrendLine";
import ChannelBar from "../components/ChannelBar";
import DonutShare from "../components/DonutShare";
import RoasScatter from "../components/RoasScatter";
import LeaderTable from "../components/LeaderTable";
import Filters from "../components/Filters";
import AreaTrend from "../components/AreaTrend";
import CostDonut from "../components/CostDonut";
import MiniTrendCard from "../components/MiniTrendCard";

import { Wallet, TrendingUp, ShoppingCart, Eye } from "lucide-react";

export default function Overview() {
  const [sel, setSel] = useState(""); 
  const daily = data?.daily ?? [];
  const byChannel = data?.byChannel ?? [];
  const kpis = data?.kpis ?? { pageViews: 0, totalRevenue: 0, conversions: 0, totalEarning: 0 };

  const filteredByChannel = useMemo(() => {
    if (!sel) return byChannel;
    return byChannel.filter(d => `${d.channel}:${d.platform}` === sel);
  }, [sel, byChannel]);

  return (
    <main className="flex-1">
      <h1 className="text-2xl font-bold text-title mb-4">Marketing Performance Dashboard</h1>
      <p className="text-gray-500 mb-4">2025</p>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Total Income"
          value={`$${kpis.totalRevenue.toLocaleString()}`}
          variant="plain"
          icon={<Wallet size={20} strokeWidth={2.4} />}
          bgClass="kpi-bg-indigo"
          fgClass="kpi-fg-indigo"
        />
        <KpiCard
          label="Total Earning"
          value={`$${(kpis.totalEarning ?? 0).toLocaleString()}`}
          variant="plain"
          icon={<TrendingUp size={20} strokeWidth={2.4} />}
          bgClass="kpi-bg-orange"
          fgClass="kpi-fg-orange"
        />
        <KpiCard
          label="Total Orders"
          value={kpis.conversions.toLocaleString()}
          variant="plain"
          icon={<ShoppingCart size={20} strokeWidth={2.4} />}
          bgClass="kpi-bg-watermelon"
          fgClass="kpi-fg-watermelon"
        />
        <KpiCard
          label="Page Views"
          value={kpis.pageViews.toLocaleString()}
          variant="plain"
          icon={<Eye size={20} strokeWidth={2.4} />}
          bgClass="kpi-bg-lightblue"
          fgClass="kpi-fg-lightblue"
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AreaTrend
            data={daily}
            yKey="revenue"
            title="Revenue Over Time (Area)"
            stroke="var(--color-orange)"
          />
        </div>
        <DonutShare data={filteredByChannel} title="Revenue Share by Source" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <ChannelBar data={filteredByChannel} title="Cost vs Earnings by Channel (30d)" />
        </div>
        <CostDonut data={filteredByChannel} title="Cost Distribution by Channel" />
      </div>

      <div className="mt-6">
        <MiniTrendCard
          data={daily}
          yKey="conversions"
          title={kpis.conversions.toLocaleString()}
          subtitle="Total Conversions in 2025"
        />
      </div>

      <div className="mt-6">
        <LeaderTable data={filteredByChannel} />
      </div>
    </main>
  );
}
