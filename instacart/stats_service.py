import pandas as pd
import sys
import warnings
import os

if not sys.warnoptions:
    warnings.simplefilter("ignore")

def main():
    figure_1 = Bar_hour()
    figure_2 = Tree_map()
    figure_3 = Line()
    print({"plots": { "figure_1" : figure_1, "figure_2" : figure_2 }, "figure_3" : figure_3})
    return {"plots": { "figure_1" : figure_1,  "figure_2" : figure_2, "figure_3" : figure_3 }}

def Bar_hour():
    orders = pd.read_csv("./data/orders.csv")

    hour_of_order = orders.groupby("order_id")['order_hour_of_day'].sum().value_counts().sort_index()
    my_dict = hour_of_order.to_dict()
    bar_stats = []
    for key, value in my_dict.items():
        bar_stat = {"hour": key, "orders_per_hour": value }
        bar_stats.append(bar_stat)
    return bar_stats

def Tree_map():
    departments = pd.read_csv("./data/departments.csv")
    products = pd.read_csv("./data/products.csv")

    products = products.merge(departments, on="department_id")
    products = products.groupby("product_id")['department'].sum().value_counts()
    my_dict = products.to_dict()
    tree_stats = []
    for key, value in my_dict.items():
        tree_stat = {"department": key, "number_of_products": value }
        tree_stats.append(tree_stat)
    return tree_stats

def Line():
    orders = pd.read_csv("./data/orders.csv")
    orders = orders.dropna(axis=0)
    orders = orders.groupby("order_id")['days_since_prior_order'].sum().value_counts().sort_index()
    my_dict = orders.to_dict()
    line_stats = []
    for key, value in my_dict.items():
        line_stat = {"days": key, "number": value }
        line_stats.append(line_stat)
    return line_stats

if __name__ == "__main__":
    main()