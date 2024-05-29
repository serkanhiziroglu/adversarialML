from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import re

app = Flask(__name__)
# Allow requests from localhost:3000
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Function to run Python script and return the results


def run_script(script_path, image_path):
    result = subprocess.run(
        ["python3", script_path, image_path], capture_output=True, text=True)

    # Capture and log the output for debugging
    stdout = result.stdout.strip()
    stderr = result.stderr.strip()
    if stdout:
        print(f"Script execution stdout: {stdout}")
    if stderr:
        print(f"Script execution stderr: {stderr}")

    # Extract base64 images from the output
    original_image_b64 = re.search(
        r'Original Image Base64: (.+)', stdout).group(1)
    adversarial_image_b64 = re.search(
        r'Adversarial Image Base64: (.+)', stdout).group(1)

    return original_image_b64, adversarial_image_b64


@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    model = request.form['model']
    method = request.form['method']

    image_path = os.path.join('/tmp', file.filename)
    file.save(image_path)

    script_path = None
    if model == "EfficientNetB0" and method == "PGD":
        # Use the correct script name
        script_path = os.path.join('api', 'pgdVSenet.py')
    # Add more conditions here for other model and method combinations

    if script_path is None:
        return jsonify({'error': 'Invalid model or method selected'}), 400

    original_image_b64, adversarial_image_b64 = run_script(
        script_path, image_path)

    # Log the result for debugging
    print(f"Final result: Original Image Base64 and Adversarial Image Base64 returned")

    return jsonify({
        'original_image_b64': original_image_b64,
        'adversarial_image_b64': adversarial_image_b64
    })


if __name__ == '__main__':
    app.run(debug=True)
