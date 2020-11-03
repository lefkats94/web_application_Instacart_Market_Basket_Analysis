import numpy as np
from flask import Blueprint, jsonify, abort, request
import model_service
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import f1_score

api = Blueprint(
    name="models_controller",
    import_name="models_controller",
    url_prefix="/instacart/model/",
)

@api.route("/", methods=["POST"])
def users():
    new_user = request.get_json()

    uxp_total_bought = new_user["uxp_total_bought"]
    uxp_reorder_ratio = new_user["uxp_reorder_ratio"]
    times_last5 = new_user["times_last5"]
    u_total_orders = new_user["u_total_orders"]
    u_reordered_ratio = new_user["u_reordered_ratio"]
    p_total_purchases = new_user["p_total_purchases"]
    p_reorder_ratio = new_user["p_reorder_ratio"]

    df = pd.DataFrame([[uxp_total_bought, uxp_reorder_ratio, times_last5, u_total_orders,
        u_reordered_ratio, p_total_purchases, p_reorder_ratio]])

    model = joblib.load("pred.model")
    prediction = model.predict(df)
    if prediction == 0.0 :
        prediction = np.array(["The customer will not reorder this product"])
    if prediction == 1.0 :
        prediction = np.array(["The customer will reorder this product"])
    if not prediction:
        abort(500)
    return jsonify({"prediction": prediction.tolist()}), 201