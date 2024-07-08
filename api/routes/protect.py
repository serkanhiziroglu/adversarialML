from flask import request, jsonify
from PIL import Image
import numpy as np
import base64
import cv2
from utils.image_processing import preprocess_image, calculate_ssim
from adversarial_methods import fgsm


def protect_image():
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
