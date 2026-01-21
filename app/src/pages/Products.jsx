import React, { useMemo } from "react";
import data from "../data/products.json";
import KpiCard from "../components/KpiCard";

import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip,
Line, XAxis, YAxis, CartesianGrid,
  ComposedChart, Area, AreaChart, Legend,
  BarChart, Bar,
} from "recharts";

import {
  Package,
  Wallet,
  LineChart,
  Target,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

const PALETTE = [
  "var(--color-primary)",
  "var(--color-indigo)",
  "var(--color-blue)",
  "var(--color-cyan)",
  "#64748b",
  "#0ea5e9",
];

function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-surface rounded-card border-soft p-4 ${className}`}>
      {title && <div className="text-sm font-semibold text-title mb-2">{title}</div>}
      {children}
    </div>
  );
}

function useCategoryStacks(byProduct) {
  return useMemo(() => {
    const map = new Map(); // category -> { category, ad_units, organic_units, units }
    byProduct.forEach((p) => {
      const prev = map.get(p.category) || { category: p.category, ad_units: 0, organic_units: 0, units: 0 };
      const adUnits = Number(p.ad_units || 0);
      const units = Number(p.units || 0);
      prev.ad_units += adUnits;
      prev.units += units;
      prev.organic_units += Math.max(units - adUnits, 0);
      map.set(p.category, prev);
    });
    return Array.from(map.values()).sort((a, b) => b.units - a.units);
  }, [byProduct]);
}

export default function Products() {
  const k = data?.kpis ?? {};
  const daily = data?.daily ?? [];
  const topProducts = data?.topProductsByRevenue ?? [];
  const byProduct = data?.byProduct ?? [];
  const byProductPlatform = data?.byProductPlatform ?? [];
  const adVsOrg = data?.adVsOrganicUnits ?? [];

  const catStacks = useCategoryStacks(byProduct);

  const returnSeries = useMemo(() => {
    return (daily || []).map(d => {
      const units = Number(d.units || 0);
      const ret = Number(d.returns || 0);
      return {
        order_date: d.order_date,
        return_rate: units ? (ret / units) * 100 : 0,
        returns: ret,
        units
      };
    });
  }, [daily]);
  return (
    <div className="products-page flex-1">
      <h1 className="text-2xl font-bold text-title mb-1">Product Analytics</h1>
      <p className="text-muted mb-6">Sales performance, attribution, and product insights (2025)</p>

      <div className="
            mb-6 gap-4 grid
            grid-cols-[repeat(auto-fit,minmax(240px,1fr))]
            md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]
            2xl:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]
            "
            >
        <KpiCard label="Units Sold"   value={Number(k.totalUnits || 0).toLocaleString()} variant="plain" icon={<Package size={20} strokeWidth={2.4} />} bgClass="kpi-bg-indigo" fgClass="kpi-fg-indigo"/>
        <KpiCard label="Total Revenue" value={`$${Number(k.totalRevenue || 0).toLocaleString()}`} variant="plain" icon={<Wallet size={20} strokeWidth={2.4} />} bgClass="kpi-bg-orange" fgClass="kpi-fg-orange"/>
        <KpiCard label="Gross Margin"  value={`$${Number(k.totalMargin || 0).toLocaleString()}`} variant="plain" icon={<LineChart size={20} strokeWidth={2.4} />} bgClass="kpi-bg-watermelon" fgClass="kpi-fg-watermelon" />
        <KpiCard label="Ad-Assisted %" value={`${Number(k.adAssistedPct || 0).toFixed(1)}%`} variant="plain" icon={<Target size={20} strokeWidth={2.4} />} bgClass="kpi-bg-lightblue" fgClass="kpi-fg-lightblue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Ad-Assisted vs Organic (Units)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adVsOrg}
                  dataKey="units"
                  nameKey="label"
                  innerRadius="60%"
                  outerRadius="90%"
                  paddingAngle={2}
                >
                  {adVsOrg.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "var(--color-indigo)" : "var(--color-indigo-light)"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{
                        fontSize: "13px",
                        paddingTop: "8px",
                    }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <div className="bg-surface rounded-card border-soft p-4">
            <div className="text-sm font-semibold text-title mb-2">Return Rate Over Time</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={returnSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="0" />
                  <XAxis dataKey="order_date" hide />
                  <YAxis domain={['auto', 'auto']} tickFormatter={(v) => `${v.toFixed(1)}%`} tick={{ fill: "#6B7280", fontSize: 11 }} width={60} axisLine={false} tickLine={false}  />
                  <Tooltip formatter={(v, n) => n === "return_rate" ? `${Number(v).toFixed(2)}%` : v} labelFormatter={(l) => `Date: ${l}`} />
                  <Area
                    type="monotone"
                    dataKey="return_rate"
                    name="Return rate"
                    stroke="var(--color-orange)"
                    fill="var(--color-orange)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Top 10 Products by Revenue">
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...topProducts]} 
                layout="vertical"
                margin={{ top: 24, right: 15, left: 0, bottom: -25 }}
              >
                <CartesianGrid vertical={false} horizontal={false} strokeDasharray="0"/>
                <XAxis type="number" tickLine={false} axisLine={false}/>
                <YAxis
                  type="category"
                  dataKey="product_name"
                  width={120}
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar dataKey="revenue" name="Revenue" fill="var(--color-blue)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Units by Category (Ad vs Organic)">
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catStacks} margin={{ top: 24, right: 15, left: 0, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid vertical={false}  strokeDasharray="0"/>
                <XAxis dataKey="category" tick={{ fill: "#6B7280", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis  tick={{ fill: "#6B7280", fontSize: 11 }} tickLine={false} axisLine={false}/>
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

                <Tooltip />
                <Bar dataKey="organic_units" name="Organic" stackId="u" fill="var(--color-indigo)" />
                <Bar dataKey="ad_units" name="Ad-assisted" stackId="u" fill="var(--color-green)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Performance by Product × Platform">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-soft">
                <th className="py-2 pr-4">Product</th>
                <th className="py-2 pr-4">Platform</th>
                <th className="py-2 pr-4">Units</th>
                <th className="py-2 pr-4">Revenue</th>
                <th className="py-2 pr-4">Ad Share</th>
              </tr>
            </thead>
            <tbody>
              {byProductPlatform.map((row, i) => (
                <tr key={i} className="border-b border-soft">
                  <td className="py-2 pr-4 text-title">{row.product_name}</td>
                  <td className="py-2 pr-4">{row.platform}</td>
                  <td className="py-2 pr-4">{Number(row.units || 0).toLocaleString()}</td>
                  <td className="py-2 pr-4">${Number(row.revenue || 0).toLocaleString()}</td>
                  <td className="py-2 pr-4">
                    {(Number(row.ad_share || 0) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
