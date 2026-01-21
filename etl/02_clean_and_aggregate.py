import pandas as pd
import numpy as np
import json
import pathlib

DATA_DIR = pathlib.Path("../data/raw")
OUT_DIR = pathlib.Path("../app/src/data")
OUT_DIR.mkdir(parents=True, exist_ok=True)


# ADS DATA AGGREGATION

ads_path = DATA_DIR / "marketing_metrics.csv"
ads = pd.read_csv(ads_path, parse_dates=["date"])

# Ensure numeric
num_cols = ["impressions","clicks","page_views","conversions","revenue","cost"]
ads[num_cols] = ads[num_cols].apply(pd.to_numeric, errors="coerce").fillna(0)

# Helper for safe division
def safe_div(a, b):
    res = np.divide(a, b, out=np.zeros_like(a, dtype=float), where=(b!=0))
    return np.nan_to_num(res, nan=0.0, posinf=0.0, neginf=0.0)

# Derived metrics
ads["ctr"]  = safe_div(ads["clicks"], ads["impressions"])
ads["cvr"]  = safe_div(ads["conversions"], ads["clicks"])
ads["rpc"]  = safe_div(ads["revenue"], ads["conversions"])
ads["cpc"]  = safe_div(ads["cost"], ads["clicks"])
ads["cpa"]  = safe_div(ads["cost"], ads["conversions"])
ads["roas"] = safe_div(ads["revenue"], ads["cost"])

# Daily totals
daily = (ads.groupby("date", as_index=False)
            .agg(impressions=("impressions","sum"),
                 clicks=("clicks","sum"),
                 page_views=("page_views","sum"),
                 conversions=("conversions","sum"),
                 revenue=("revenue","sum"),
                 cost=("cost","sum")))
daily["ctr"]  = safe_div(daily["clicks"], daily["impressions"])
daily["cvr"]  = safe_div(daily["conversions"], daily["clicks"])
daily["roas"] = safe_div(daily["revenue"], daily["cost"])

# Last 30d channel summary
cutoff = daily["date"].max() - pd.Timedelta(days=30)
by_channel = (ads[ads["date"] >= cutoff]
                .groupby(["channel","platform"], as_index=False)
                .agg(impressions=("impressions","sum"),
                     clicks=("clicks","sum"),
                     conversions=("conversions","sum"),
                     revenue=("revenue","sum"),
                     cost=("cost","sum")))
by_channel["roas"] = safe_div(by_channel["revenue"], by_channel["cost"])

# KPI summary
total_revenue  = float(daily["revenue"].sum())
total_cost     = float(daily["cost"].sum())
total_earning  = total_revenue - total_cost
total_views    = int(daily["page_views"].sum())
total_conv     = int(daily["conversions"].sum())

ads_json = {
  "kpis": {
    "pageViews": total_views,
    "totalRevenue": round(total_revenue, 2),
    "totalEarning": round(total_earning, 2),
    "conversions": total_conv
  },
  "daily": daily.assign(date=daily["date"].dt.strftime("%Y-%m-%d")).to_dict(orient="records"),
  "byChannel": by_channel.to_dict(orient="records")
}

with open(OUT_DIR / "clean_metrics.json", "w") as f:
    json.dump(ads_json, f, indent=2)

print("✓ Wrote clean_metrics.json")


# PRODUCT DATA AGGREGATION

orders_path  = DATA_DIR / "product_orders_2025.csv"
catalog_path = DATA_DIR / "product_catalog.csv"

orders  = pd.read_csv(orders_path, parse_dates=["order_date"])
catalog = pd.read_csv(catalog_path)

# Ensure numeric
num_cols = ["unit_price","quantity","discount_rate","revenue","cogs","margin","ad_assisted","returned"]
orders[num_cols] = orders[num_cols].apply(pd.to_numeric, errors="coerce").fillna(0)

orders["units"] = orders["quantity"].astype(int)

# KPIs
total_units     = int(orders["units"].sum())
total_revenue   = float(orders["revenue"].sum())
total_margin    = float(orders["margin"].sum())
total_orders    = len(orders)
ad_units        = int(orders.loc[orders["ad_assisted"]==1, "units"].sum())
ad_pct          = (ad_units / total_units * 100) if total_units else 0
returns_count   = int(orders["returned"].sum())
aov             = (total_revenue / total_orders) if total_orders else 0

# Daily series
daily_prod = (orders.groupby("order_date", as_index=False)
                     .agg(units=("units","sum"),
                          ad_units=("ad_assisted","sum"),
                          revenue=("revenue","sum"),
                          margin=("margin","sum"),
                          returns=("returned","sum")))
daily_prod["order_date"] = daily_prod["order_date"].dt.strftime("%Y-%m-%d")

# Product summary
by_product = (orders.groupby(["product_id","product_name","category"], as_index=False)
                     .agg(units=("units","sum"),
                          revenue=("revenue","sum"),
                          margin=("margin","sum"),
                          ad_units=("ad_assisted","sum")))
by_product["ad_share"] = safe_div(by_product["ad_units"], by_product["units"]).round(3)

# Product × Platform summary
by_prod_plat = (orders.groupby(["product_id","product_name","platform"], as_index=False)
                       .agg(units=("units","sum"),
                            revenue=("revenue","sum"),
                            ad_units=("ad_assisted","sum")))
by_prod_plat["ad_share"] = safe_div(by_prod_plat["ad_units"], by_prod_plat["units"]).round(3)

# Ad vs Organic (donut)
ad_vs_org = pd.DataFrame({
    "label": ["Ad-assisted", "Organic"],
    "units": [ad_units, total_units - ad_units]
}).to_dict(orient="records")

# Top 10 by revenue
top_products = (by_product.sort_values("revenue", ascending=False)
                            .head(10).to_dict(orient="records"))

prod_json = {
  "kpis": {
    "totalUnits": total_units,
    "totalRevenue": round(total_revenue, 2),
    "totalMargin": round(total_margin, 2),
    "orders": total_orders,
    "adAssistedPct": round(ad_pct, 2),
    "returns": returns_count,
    "aov": round(aov, 2)
  },
  "daily": daily_prod.to_dict(orient="records"),
  "byProduct": by_product.to_dict(orient="records"),
  "byProductPlatform": by_prod_plat.to_dict(orient="records"),
  "topProductsByRevenue": top_products,
  "adVsOrganicUnits": ad_vs_org
}

with open(OUT_DIR / "products.json", "w") as f:
    json.dump(prod_json, f, indent=2)

print("✓ Wrote products.json")

print("\nAll aggregations complete.")
