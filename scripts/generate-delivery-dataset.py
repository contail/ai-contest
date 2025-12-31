import csv
import json
import os
import zipfile

rider_info = [
    {"id": "R01", "name": "김철수", "x": 0, "y": 0, "capacity": 10, "pref_region": "강남구"},
    {"id": "R02", "name": "이영희", "x": 5, "y": 5, "capacity": 20, "pref_region": "서초구"},
    {"id": "R03", "name": "박민수", "x": 2, "y": 3, "capacity": 15, "pref_region": "역삼동"},
    {"id": "R04", "name": "최신속", "x": 8, "y": 1, "capacity": 15, "pref_region": "송파구"},
    {"id": "R05", "name": "정스피드", "x": 3, "y": 7, "capacity": 30, "pref_region": "서초구"},
]

with open("rider_info.json", "w", encoding="utf-8") as f:
    json.dump(rider_info, f, ensure_ascii=False, indent=2)

dispatch_log = [
    ["order_id", "region", "x", "y", "weight", "assigned_rider", "raw_distance", "weighted_distance"],
    ["ORD_01", "강남구", 1, 1, 5, "김철수", 1.41, 1.13],
    ["ORD_02", "서초구", 4, 4, 12, "이영희", 1.41, 1.13],
    ["ORD_03", "강남구", 2, 2, 8, "박민수", 1.41, 1.41],
    ["ORD_04", "송파구", 9, 2, 11, "최신속", 1.41, 1.13],
    ["ORD_05", "강남구", 0, 2, 4, "김철수", 2.00, 1.60],
    ["ORD_06", "서초구", 6, 8, 15, "정스피드", 3.16, 2.53],
    ["ORD_07", "역삼동", 3, 3, 7, "박민수", 1.00, 0.80],
    ["ORD_08", "서초구", 5, 4, 8, "이영희", 1.00, 0.80],
    ["ORD_09", "강남구", 1, 0, 5, "정스피드", 7.28, 7.28],
    ["ORD_10", "송파구", 7, 1, 3, "최신속", 1.00, 0.80],
]

with open("dispatch_log.csv", "w", encoding="utf-8-sig", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(dispatch_log)

pending_orders = [
    ["order_id", "region", "x", "y", "weight", "failure_reason"],
    ["PEND_01", "송파구", 25, 25, 5, "OUT_OF_RANGE"],
    ["PEND_02", "강남구", 1, 1, 45, "CAPACITY_EXCEEDED"],
    ["PEND_03", "서초구", 4, 4, 10, "RIDER_FULL"],
    ["PEND_04", "역삼동", 2, 3, 20, "CAPACITY_EXCEEDED"],
    ["PEND_05", "강남구", 0, 1, 5, "RIDER_FULL"],
    ["PEND_06", "서초구", 5, 5, 25, "CAPACITY_EXCEEDED"],
]

with open("pending_orders.csv", "w", encoding="utf-8-sig", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(pending_orders)

with zipfile.ZipFile("delivery_data.zip", "w") as z:
    z.write("rider_info.json")
    z.write("dispatch_log.csv")
    z.write("pending_orders.csv")

os.remove("rider_info.json")
os.remove("dispatch_log.csv")
os.remove("pending_orders.csv")

print("delivery_data.zip 생성 완료!")
