import pandas as pd, json, pathlib

src = pathlib.Path("../data/raw/marketing_metrics.csv")
df  = pd.read_csv(src, parse_dates=["date"])

# Basic cleaning
num_cols = ["impressions","clicks","page_views","conversions","revenue","cost"]
df[num_cols] = df[num_cols].fillna(0)
df[num_cols] = df[num_cols].apply(pd.to_numeric, errors="coerce").fillna(0)

# Derived metrics (row level)
df["ctr"]  = (df["clicks"] / df["impressions"]).replace([pd.NA, pd.NaT], 0)
df["cvr"]  = (df["conversions"] / df["clicks"]).fillna(0)
df["rpc"]  = (df["revenue"] / df["conversions"]).fillna(0) 
df["cpc"]  = (df["cost"] / df["clicks"]).fillna(0)
df["cpa"]  = (df["cost"] / df["conversions"]).fillna(0)
df["roas"] = (df["revenue"] / df["cost"]).replace([pd.NA, pd.NaT], 0)

# Daily totals for charts
daily = (df.groupby("date", as_index=False)
           .agg(impressions=("impressions","sum"),
                clicks=("clicks","sum"),
                page_views=("page_views","sum"),
                conversions=("conversions","sum"),
                revenue=("revenue","sum"),
                cost=("cost","sum")))
daily["ctr"]  = daily["clicks"]/daily["impressions"]
daily["cvr"]  = daily["conversions"]/daily["clicks"]
daily["roas"] = daily["revenue"]/daily["cost"]

# Channel breakdown (latest 30 days)
by_channel = (df[df["date"] >= (df["date"].max() - pd.Timedelta(days=30))]
                .groupby(["channel","platform"], as_index=False)
                .agg(impressions=("impressions","sum"),
                     clicks=("clicks","sum"),
                     conversions=("conversions","sum"),
                     revenue=("revenue","sum"),
                     cost=("cost","sum")))
by_channel["roas"] = by_channel["revenue"]/by_channel["cost"]

# Export for the app
out = {
  "kpis": {
    "pageViews": int(daily["page_views"].sum()),
    "totalRevenue": round(float(daily["revenue"].sum()),2),
    "conversions": int(daily["conversions"].sum())
  },
  "daily": daily.assign(date=daily["date"].dt.strftime("%Y-%m-%d")).to_dict(orient="records"),
  "byChannel": by_channel.to_dict(orient="records")
}

pathlib.Path("../app/src/data").mkdir(parents=True, exist_ok=True)
with open("../app/src/data/clean_metrics.json","w") as f:
    json.dump(out, f)

print("Wrote app/src/data/clean_metrics.json")
