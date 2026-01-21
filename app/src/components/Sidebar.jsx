import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package } from "lucide-react";

export default function Sidebar() {
  const link =
    "flex items-center gap-2 rounded-card px-3 py-2 text-sm transition border";
  const active = "bg-surface border-soft text-title shadow";
  const idle =
    "border-transparent text-gray-600 hover:bg-surface/60 hover:border-soft";

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <nav className="rounded-card bg-surface border border-soft p-3 shadow space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted px-2">Pages</div>

        <NavLink to="/" end className={({ isActive }) => `${link} ${isActive ? active : idle}`}>
          <LayoutDashboard size={16} />
          Overview
        </NavLink>

        <NavLink to="/products" className={({ isActive }) => `${link} ${isActive ? active : idle}`}>
          <Package size={16} />
          Products
        </NavLink>
      </nav>

      <div className="rounded-card bg-surface border border-soft p-4 shadow mt-4">
        <div className="text-sm text-muted mb-2">Popular Channels</div>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>Instagram</li>
          <li>LinkedIn</li>
          <li>Twitter</li>
          <li>Google Ads</li>
        </ul>
      </div>
    </aside>
  );
}
