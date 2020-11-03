from flask import Flask, jsonify, make_response
from flask_cors import CORS
import model_controller
import stats_controller
import base_logger

app = Flask(__name__)
CORS(app)

@app.errorhandler(500)
def server_error(error):
    return make_response(jsonify({"error": "internal server error"}), 500)

app.register_blueprint(model_controller.api)
app.register_blueprint(stats_controller.api)

if __name__ == "__main__":
    app.run(debug=True)