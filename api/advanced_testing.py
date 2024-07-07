from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import base64
from io import BytesIO

from models import efficientnetb0, inceptionv3, mobilenetv2

app = Flask(__name__)
CORS(app)

# Load models
models = {
    'EfficientNetB0': efficientnetb0.load_model(),
    'InceptionV3': inceptionv3.load_model(),
    'MobileNetV2': mobilenetv2.load_model()
}


@app.route('/advanced-testing', methods=['POST'])
def advanced_testing():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        image = Image.open(file.stream).convert('RGB')
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 400

    # Encode original image to base64
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    original_image_b64 = base64.b64encode(buffered.getvalue()).decode()

    # Process image with all models
    results = {}
    for model_name, model in models.items():
        if model_name == 'EfficientNetB0':
            preprocess = efficientnetb0.preprocess_image
            get_label = efficientnetb0.get_imagenet_label
        elif model_name == 'InceptionV3':
            preprocess = inceptionv3.preprocess_image
            get_label = inceptionv3.get_imagenet_label
        else:  # MobileNetV2
            preprocess = mobilenetv2.preprocess_image
            get_label = mobilenetv2.get_imagenet_label

        preprocessed_image = preprocess(np.array(image))
        prediction = model.predict(preprocessed_image)
        label = get_label(prediction)
        results[model_name] = {'label': label}

    return jsonify({
        'original_image_b64': original_image_b64,
        'predictions': results
    })


if __name__ == '__main__':
    app.run(debug=True, port=5001)
