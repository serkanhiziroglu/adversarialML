from flask import request, jsonify
from PIL import Image
import base64
from io import BytesIO
from utils.model_loader import load_models


def analyze_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        image = Image.open(file.stream).convert('RGB')
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 400

    models = load_models()

    buffered = BytesIO()
    image.save(buffered, format="PNG")
    original_image_b64 = base64.b64encode(buffered.getvalue()).decode()

    results = {}
    for model_name, (model, preprocess, get_label) in models.items():
        preprocessed_image = preprocess(image)
        prediction = model.predict(preprocessed_image)
        label, confidence = get_label(prediction)
        results[model_name] = {
            'label': label,
            'confidence': float(confidence)
        }

    return jsonify({
        'original_image_b64': original_image_b64,
        'predictions': results
    })
