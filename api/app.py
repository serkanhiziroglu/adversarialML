from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import base64
from PIL import Image
import cv2
from io import BytesIO
from skimage.metrics import structural_similarity as ssim

from models import efficientnetb0, inceptionv3, mobilenetv2
from adversarial_methods import fgsm

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


# Load models
efficientnet_model = efficientnetb0.load_model()
inceptionv3_model = inceptionv3.load_model()
mobilenetv2_model = mobilenetv2.load_model()


def preprocess_image(image):
    image_array = np.array(image)
    image_array = image_array.astype(np.float32) / 255.0
    image_tensor = tf.convert_to_tensor(np.expand_dims(image_array, axis=0))
    return image_tensor


def calculate_ssim(image1, image2):
    min_dim = min(image1.shape[0], image1.shape[1],
                  image2.shape[0], image2.shape[1])
    win_size = min(7, min_dim - 1)
    if win_size % 2 == 0:
        win_size -= 1
    return ssim(image1, image2, win_size=win_size, channel_axis=-1)


@app.route('/result', methods=['POST'])
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        image = Image.open(file.stream)
        image.verify()
        file.stream.seek(0)
        image = Image.open(file.stream).convert('RGB')
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 400

    preprocessed_image = preprocess_image(image)

    epsilon = 0.01
    adversarial_image = fgsm.create_fgsm_adversarial_pattern(
        preprocessed_image, epsilon)

    original_image_uint8 = np.array(image)
    adversarial_image_uint8 = (
        adversarial_image[0] * 255).numpy().astype(np.uint8)

    ssim_value = calculate_ssim(original_image_uint8, adversarial_image_uint8)

    _, buffer = cv2.imencode('.png', cv2.cvtColor(
        adversarial_image_uint8, cv2.COLOR_RGB2BGR))
    adversarial_image_b64 = base64.b64encode(buffer).decode('utf-8')

    return jsonify({
        'adversarial_image_b64': adversarial_image_b64,
        'ssim': f"{ssim_value:.4f}"
    })


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
    models = {
        'EfficientNetB0': (efficientnet_model, efficientnetb0.preprocess_image, efficientnetb0.get_imagenet_label),
        'InceptionV3': (inceptionv3_model, inceptionv3.preprocess_image, inceptionv3.get_imagenet_label),
        'MobileNetV2': (mobilenetv2_model, mobilenetv2.preprocess_image, mobilenetv2.get_imagenet_label)
    }

    for model_name, (model, preprocess, get_label) in models.items():
        preprocessed_image = preprocess(image)
        prediction = model.predict(preprocessed_image)
        label, confidence = get_label(prediction)
        results[model_name] = {
            'label': label,
            'confidence': float(confidence)  # Convert to native Python float
        }

    return jsonify({
        'original_image_b64': original_image_b64,
        'predictions': results
    })


if __name__ == '__main__':
    app.run(debug=True)
