import csv, random, datetime as dt
import os

file_path = "../data/raw/marketing_metrics.csv"
os.makedirs(os.path.dirname(file_path), exist_ok=True)

random.seed(7)
channels = [
    ("social","LinkedIn"), ("social","X"), ("social","YouTube"), ("social","Instagram"),
    ("email","Mailchimp"),
    ("website","Organic"),
    ("paid","GoogleAds")
]

start = dt.date(2025, 1, 1)
days = 297

with open(file_path,"w",newline="") as f:
    w = csv.writer(f)
    w.writerow(["date","channel","platform","campaign","impressions","clicks","page_views","conversions","revenue","cost"])
    for d in range(days):
        day = start + dt.timedelta(days=d)
        for ch, pf in channels:
            imp = random.randint(1000, 18000)
            clk = int(imp * random.uniform(0.01, 0.08))
            pv  = int(clk * random.uniform(0.5, 2.0))
            conv= int(pv * random.uniform(0.02, 0.12))
            rev = round(conv * random.uniform(10, 60), 2)
            cost= round(imp * (0.005 if ch!="paid" else 0.02), 2)
            w.writerow([day.isoformat(), ch, pf, f"{pf}_Sept", imp, clk, pv, conv, rev, cost])

print("Wrote data/raw/marketing_metrics.csv")
