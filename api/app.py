from flask import Flask, request
from flask_cors import CORS
from routes.protect import protect_image
from routes.analyze import analyze_image

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route('/protect', methods=['POST'])
def protect_route():
    return protect_image()  # Remove 'request' argument


@app.route('/analyze', methods=['POST'])
def analyze_route():
    return analyze_image()  # This was already correct


if __name__ == '__main__':
    app.run(debug=True)
