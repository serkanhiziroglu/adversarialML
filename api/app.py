from flask import Flask, request, jsonify
import os
import logging
from flask_cors import CORS
import sys
from routes.protect import protect_image
from routes.analyze import analyze_image

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "https://staging.d167phppufzp75.amplifyapp.com",
    "https://d167phppufzp75.amplifyapp.com"  # Production URL
]}})

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', stream=sys.stdout)
logger = app.logger

@app.route('/protect', methods=['POST'])
def protect_route():
    logger.debug("Received request to /protect")
    return protect_image()

@app.route('/analyze', methods=['POST'])
def analyze_route():
    logger.debug("Received request to /analyze")
    return analyze_image()

@app.route('/debug', methods=['GET'])
def debug():
    logger.debug("Received request to /debug")
    debug_info = {
        "environment_variables": dict(os.environ),
        "current_directory": os.getcwd(),
        "directory_contents": os.listdir(os.getcwd())
    }
    logger.debug(f"Debug Info: {debug_info}")
    return jsonify(debug_info)

if __name__ == '__main__':
    logger.info("Starting Flask application")
    app.run(host='0.0.0.0', port=8080)