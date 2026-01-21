

import csv
import os
import random
import datetime as dt
from collections import defaultdict

# Config
RAW_DIR = "../data/raw"
os.makedirs(RAW_DIR, exist_ok=True)

SEED = 7
YEAR = 2025
START_DATE = dt.date(YEAR, 1, 1)
END_DATE   = dt.date(YEAR, 12, 31)

ADS_PATH     = os.path.join(RAW_DIR, "marketing_metrics.csv")
CATALOG_PATH = os.path.join(RAW_DIR, "product_catalog.csv")
ORDERS_PATH  = os.path.join(RAW_DIR, "product_orders_2025.csv")

CHANNELS = [
    ("social",  "LinkedIn"),
    ("social",  "X"),
    ("social",  "YouTube"),
    ("social",  "Instagram"),
    ("email",   "Mailchimp"),
    ("website", "Organic"),
    ("paid",    "GoogleAds"),
]

# Helpers
def daterange(start: dt.date, end: dt.date):
    d = start
    while d <= end:
        yield d
        d += dt.timedelta(days=1)

def weighted_choice(pairs):
    """pairs: list[(value, weight)]"""
    total = sum(w for _, w in pairs)
    if total <= 0:
        return random.choice([v for v, _ in pairs])
    r = random.uniform(0, total)
    s = 0
    for v, w in pairs:
        s += w
        if s >= r:
            return v
    return pairs[-1][0]

# Ads dataset
def generate_ads():
    random.seed(SEED)
    with open(ADS_PATH, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["date","channel","platform","impressions","clicks","page_views","conversions","revenue","cost"])
        for day in daterange(START_DATE, END_DATE):
            for ch, pf in CHANNELS:
                imp = random.randint(1000, 18000)
                clk = int(imp * random.uniform(0.01, 0.08))
                pv  = int(clk * random.uniform(0.5, 2.0))
                conv= int(pv * random.uniform(0.02, 0.12))
                rev = round(conv * random.uniform(10, 60), 2)
                cost= round(imp * (0.005 if ch != "paid" else 0.02), 2)
                w.writerow([day.isoformat(), ch, pf, imp, clk, pv, conv, rev, cost])
    print(f"✓ Wrote {ADS_PATH}")

# Product catalog
def generate_catalog():
    random.seed(SEED + 1)
    categories = {
        "Electronics": [
            ("E100", "Wireless Earbuds", 79),
            ("E110", "Smart Watch", 149),
            ("E120", "Bluetooth Speaker", 99),
            ("E130", "USB-C Hub", 39),
        ],
        "Apparel": [
            ("A200", "Athletic T-Shirt", 25),
            ("A210", "Yoga Pants", 45),
            ("A220", "Hoodie", 55),
            ("A230", "Running Shoes", 95),
        ],
        "Home": [
            ("H300", "Aroma Diffuser", 29),
            ("H310", "Weighted Blanket", 69),
            ("H320", "LED Desk Lamp", 35),
            ("H330", "Air Purifier", 129),
        ],
        "Beauty": [
            ("B400", "Vitamin C Serum", 32),
            ("B410", "Moisturizer", 28),
            ("B420", "SPF Sunscreen", 24),
            ("B430", "Hair Oil", 19),
        ],
        "Sports": [
            ("S500", "Adjustable Dumbbells", 199),
            ("S510", "Resistance Bands Set", 22),
            ("S520", "Foam Roller", 18),
            ("S530", "Cycling Gloves", 27),
        ],
    }

    catalog = []
    for cat, items in categories.items():
        for pid, name, price in items:
            popularity = random.uniform(0.5, 1.8)
            cogs_rate  = random.uniform(0.35, 0.6)
            catalog.append({
                "product_id": pid,
                "product_name": name,
                "category": cat,
                "unit_price": price,
                "popularity": round(popularity, 2),
                "cogs_rate": round(cogs_rate, 2),
            })

    with open(CATALOG_PATH, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["product_id","product_name","category","unit_price","popularity","cogs_rate"])
        w.writeheader()
        w.writerows(catalog)

    print(f"✓ Wrote {CATALOG_PATH}")
    return catalog

# Orders tied to ads 
def generate_orders(catalog):
    random.seed(SEED + 2)

    # Load ads for quick lookups
    by_date = defaultdict(list)
    with open(ADS_PATH, newline="") as f:
        r = csv.DictReader(f)
        for row in r:
            by_date[row["date"]].append({
                "channel": row["channel"],
                "platform": row["platform"],
                "conversions": int(row["conversions"]),
            })

    regions = ["US", "EU", "APAC", "LATAM"]
    devices = ["mobile", "desktop", "tablet"]

    pop_pairs = [(c["product_id"], c["popularity"]) for c in catalog]
    cat_by_id = {c["product_id"]: c for c in catalog}

    order_rows = []
    order_seq = 100000

    for day in daterange(START_DATE, END_DATE):
        d_str = day.isoformat()
        daily_ads = by_date.get(d_str, [])
        total_conv = sum(r["conversions"] for r in daily_ads)
        if total_conv == 0:
            total_conv = random.randint(8, 25)

        platform_weights = [(f'{r["channel"]}|{r["platform"]}', r["conversions"]) for r in daily_ads] or [("website|Organic", 1)]
        organic_share = random.uniform(0.3, 0.8)
        total_orders_today = int(total_conv * (1 + organic_share))

        for _ in range(total_orders_today):
            order_seq += 1
            pid = weighted_choice(pop_pairs)
            p = cat_by_id[pid]
            qty = 1 if random.random() < 0.8 else random.randint(2, 4)
            unit_price = float(p["unit_price"])

            discount_rate = 0.0
            if random.random() < 0.15:
                discount_rate = random.choice([0.05, 0.10, 0.15])

            line_total = round(unit_price * qty * (1 - discount_rate), 2)
            ad_assisted = random.random() < (1 - organic_share)

            if ad_assisted:
                ch_pl = weighted_choice(platform_weights)
                channel, platform = ch_pl.split("|", 1)
                attribution_type = "click" if random.random() < 0.8 else "view"
            else:
                channel, platform = "website", "Organic"
                attribution_type = "organic"

            cogs = round(unit_price * qty * p["cogs_rate"], 2)
            margin = round(line_total - cogs, 2)

            is_returned = 1 if random.random() < 0.03 else 0
            if is_returned:
                margin = round(-abs(margin), 2)
                line_total = 0.0

            order_rows.append({
                "order_id": f"O{order_seq}",
                "order_date": d_str,
                "channel": channel,
                "platform": platform,
                "ad_assisted": 1 if ad_assisted else 0,
                "attribution_type": attribution_type,
                "product_id": pid,
                "product_name": p["product_name"],
                "category": p["category"],
                "unit_price": unit_price,
                "quantity": qty,
                "discount_rate": discount_rate,
                "revenue": line_total,
                "cogs": cogs,
                "margin": margin,
                "device": random.choice(devices),
                "region": random.choice(regions),
                "customer_id": f"C{random.randint(10000, 99999)}",
                "returned": is_returned,
            })

    with open(ORDERS_PATH, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(order_rows[0].keys()))
        w.writeheader()
        w.writerows(order_rows)

    print(f"✓ Wrote {ORDERS_PATH}")

# ---------------- Main ----------------
if __name__ == "__main__":
    generate_ads()
    catalog = generate_catalog()
    generate_orders(catalog)
    print("\nAll raw data generated under ../data/raw")
