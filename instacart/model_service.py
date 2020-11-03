import pandas as pd
import sys
import warnings
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score
import joblib

if not sys.warnoptions:
    warnings.simplefilter("ignore")

def main():
    return modeling()

def preprocessing():
    aisles = pd.read_csv("./data/aisles.csv")
    departments = pd.read_csv("./data/departments.csv")
    order_products_prior = pd.read_csv("./data/order_products__prior.csv")
    order_products_train = pd.read_csv("./data/order_products__train.csv")
    orders = pd.read_csv("./data/orders.csv")
    products = pd.read_csv("./data/products.csv")

    aisles['aisle'] = aisles['aisle'].astype('category')
    departments['department'] = departments['department'].astype('category')
    orders['eval_set'] = orders['eval_set'].astype('category')
    products['product_name'] = products['product_name'].astype('category')

    op = orders.merge(order_products_prior, on='order_id', how='inner')

    user = op.groupby('user_id')['order_number'].max().to_frame('u_total_orders')
    user = user.reset_index()

    u_reorder = op.groupby('user_id')['reordered'].mean().to_frame('u_reordered_ratio')
    u_reorder = u_reorder.reset_index()

    user = user.merge(u_reorder, on='user_id', how='left')

    prd = op.groupby('product_id')['order_id'].count().to_frame('p_total_purchases')
    prd = prd.reset_index()

    p_reorder = op.groupby('product_id').filter(lambda x: x.shape[0] >40)

    p_reorder = p_reorder.groupby('product_id')['reordered'].mean().to_frame('p_reorder_ratio')
    p_reorder = p_reorder.reset_index()

    prd = prd.merge(p_reorder, on='product_id', how='left')

    prd['p_reorder_ratio'] = prd['p_reorder_ratio'].fillna(value=0)

    uxp = op.groupby(['user_id', 'product_id'])['order_id'].count().to_frame('uxp_total_bought')
    uxp = uxp.reset_index()

    times = op.groupby(['user_id', 'product_id'])[['order_id']].count()
    times.columns = ['Times_Bought_N']

    total_orders = op.groupby('user_id')['order_number'].max().to_frame('total_orders')

    first_order_no = op.groupby(['user_id', 'product_id'])['order_number'].min().to_frame('first_order_number')
    first_order_no  = first_order_no.reset_index()

    span = pd.merge(total_orders, first_order_no, on='user_id', how='right')

    span['Order_Range_D'] = span.total_orders - span.first_order_number + 1

    uxp_ratio = pd.merge(times, span, on=['user_id', 'product_id'], how='left')

    uxp_ratio['uxp_reorder_ratio'] = uxp_ratio.Times_Bought_N / uxp_ratio.Order_Range_D

    uxp_ratio = uxp_ratio.drop(['Times_Bought_N', 'total_orders', 'first_order_number', 'Order_Range_D'], axis=1)

    uxp = uxp.merge(uxp_ratio, on=['user_id', 'product_id'], how='left')

    op[op.user_id==1].head(45)

    op['order_number_back'] = op.groupby('user_id')['order_number'].transform(max) - op.order_number +1 

    op[op.user_id==7].head(10)

    op5 = op[op.order_number_back <= 5]

    last_five = op5.groupby(['user_id','product_id'])[['order_id']].count()
    last_five.columns = ['times_last5']

    uxp = uxp.merge(last_five, on=['user_id', 'product_id'], how='left')
    uxp = uxp.fillna(0)

    data = uxp.merge(user, on='user_id', how='left')

    data = data.merge(prd, on='product_id', how='left')

    orders_future = orders[((orders.eval_set=='train') | (orders.eval_set=='test'))]
    orders_future = orders_future[ ['user_id', 'eval_set', 'order_id'] ]

    data = data.merge(orders_future, on='user_id', how='left')

    data = data[data.eval_set=='train']
    data = data.merge(order_products_train[['product_id','order_id', 'reordered']], on=['product_id','order_id'], how='left' )
    data['reordered'] = data['reordered'].fillna(0)
    data = data.set_index(['user_id', 'product_id'])
    data = data.drop(['eval_set', 'order_id'], axis=1)

    train = data.drop(['reordered'],axis=1)
    test = data.loc[:,'reordered']
    return train, test

def modeling():
    train, test = preprocessing()
    X_train, X_test, y_train, y_test = train_test_split(train, test, test_size=0.3)

    classifier = LogisticRegression()
    classifier.fit(X_train, y_train)
    y_pred = classifier.predict(X_test)

    return joblib.dump(classifier, "pred.model")

if __name__ == "__main__":
    main()