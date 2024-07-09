from flask import request, jsonify
from PIL import Image
import numpy as np
import cv2
import base64
import tensorflow as tf
from skimage.metrics import structural_similarity as ssim
from utils.image_processing import preprocess_image
from adversarial_methods import fgsm

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def protect_image():
    file = get_file_from_request()
    if not file:
        return jsonify({'error': 'No file part'}), 400

    if not is_valid_file(file):
        return jsonify({'error': 'No selected file or invalid file type. Supported types: .png, .jpg, .jpeg, .gif'}), 400

    original_image = process_image(file)
    if original_image is None:
        return jsonify({'error': 'Error processing image'}), 400

    preprocessed_image = preprocess_image(original_image)
    if preprocessed_image is None:
        return jsonify({'error': 'Error preprocessing image'}), 400

    adversarial_image = create_adversarial_image(preprocessed_image)
    
    adversarial_image_np = (adversarial_image[0].numpy() * 255).astype(np.uint8)
    
    ssim_value = calculate_image_ssim(original_image, adversarial_image_np)

    response_data = generate_response_data(adversarial_image_np, ssim_value)
    return jsonify(response_data)

def get_file_from_request():
    if 'file' not in request.files:
        return None
    return request.files['file']

def is_valid_file(file):
    return '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(file):
    try:
        image = Image.open(file.stream).convert('RGB')
        return image
    except Exception as e:
        print(f"Error processing image: {e}")
        return None

def create_adversarial_image(image, epsilon=0.03, iterations=20, alpha=0.005):
    return fgsm.create_fgsm_adversarial_pattern(image, epsilon, iterations, alpha)

from skimage.metrics import structural_similarity as ssim
import numpy as np
import cv2

def calculate_image_ssim(original_image, adversarial_image):
    original_image = np.array(original_image)
    print(f"Original image shape: {original_image.shape}")
    print(f"Adversarial image shape: {adversarial_image.shape}")
    
    original_image_resized = cv2.resize(original_image, (adversarial_image.shape[1], adversarial_image.shape[0]))
    print(f"Resized original image shape: {original_image_resized.shape}")
    
    original_image_resized = original_image_resized.astype(np.float32) / 255.0
    adversarial_image = adversarial_image.astype(np.float32) / 255.0
    
    # Calculate SSIM for each channel separately and take the mean
    ssim_value = np.mean([ssim(original_image_resized[..., i], 
                               adversarial_image[..., i], 
                               data_range=1.0) for i in range(3)])
    
    return ssim_value
def generate_response_data(adversarial_image, ssim_value):
    _, buffer = cv2.imencode('.png', cv2.cvtColor(adversarial_image, cv2.COLOR_RGB2BGR))
    adversarial_image_b64 = base64.b64encode(buffer).decode('utf-8')
    return {
        'adversarial_image_b64': adversarial_image_b64,
        'ssim': f"{ssim_value:.4f}"
    }