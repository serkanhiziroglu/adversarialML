from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import tempfile
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


def run_script(script_path, image_path):
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_output_file:
            temp_output_path = temp_output_file.name

        result = subprocess.run(
            ["python3", script_path, image_path, temp_output_path], capture_output=True, text=True
        )

        stdout = result.stdout.strip()
        stderr = result.stderr.strip()

        print(f"Script execution stdout: {stdout[:500]}...")
        if stderr:
            print(f"Script execution stderr: {stderr}")

        with open(temp_output_path, 'r') as f:
            data = json.load(f)

        os.remove(temp_output_path)

        original_image_b64 = data.get('original_image_b64')
        adversarial_image_b64 = data.get('adversarial_image_b64')
        ssim_value = data.get('ssim')  # Get SSIM value from the script output

        if original_image_b64 and adversarial_image_b64:
            print(f"Original Image Base64 length: {len(original_image_b64)}")
            print(
                f"Adversarial Image Base64 length: {len(adversarial_image_b64)}")
            print(
                f"Original Image Base64 preview: {original_image_b64[:50]}...")
            print(
                f"Adversarial Image Base64 preview: {adversarial_image_b64[:50]}...")
        else:
            print("Base64 strings not found in script output.")
            return None, None, None

        return original_image_b64, adversarial_image_b64, ssim_value
    except Exception as e:
        print(f"Error running script: {e}")
        return None, None, None


@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    model = request.form['model']
    method = request.form['method']

    image_path = os.path.join('/tmp', file.filename)
    file.save(image_path)

    # Construct the script filename dynamically
    model_lower = model.lower()
    if model == "MobileNetV2":
        script_name = f"{method.lower()}vs{'mn'}.py"
    if model == "EfficientNetB0":
        script_name = f"{method.lower()}vs{'enet'}.py"
    else:
        model_lower = model_lower.replace(
            "b0", "").replace("v3", "").replace("v2", "")
        script_name = f"{method.lower()}vs{model_lower}.py"

    script_path = os.path.join('api', script_name)

    if not os.path.exists(script_path):
        return jsonify({'error': 'Invalid model or method selected'}), 400

    original_image_b64, adversarial_image_b64, ssim_value = run_script(
        script_path, image_path)

    if original_image_b64 is None or adversarial_image_b64 is None:
        return jsonify({'error': 'Error processing images'}), 500

    return jsonify({
        'original_image_b64': original_image_b64,
        'adversarial_image_b64': adversarial_image_b64,
        'ssim': ssim_value  # Include SSIM value in the response
    })


if __name__ == '__main__':
    app.run(debug=True)
