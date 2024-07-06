from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import base64
from PIL import Image
import cv2
from skimage.metrics import structural_similarity as ssim

from models import efficientnetb0, inceptionv3, mobilenetv2
from adversarial_methods import fgsm, pgd

app = Flask(__name__)
CORS(app)

# Load models
efficientnet_model = efficientnetb0.load_model()
inceptionv3_model = inceptionv3.load_model()
mobilenetv2_model = mobilenetv2.load_model()


def preprocess_image(image):
    # Convert PIL Image to numpy array
    image_array = np.array(image)

    # Normalize pixel values to [0, 1]
    image_array = image_array.astype(np.float32) / 255.0

    # Add batch dimension and convert to TensorFlow tensor
    image_tensor = tf.convert_to_tensor(np.expand_dims(image_array, axis=0))

    return image_tensor


def calculate_ssim(image1, image2):
    # Calculate the minimum dimension of the images
    min_dim = min(image1.shape[0], image1.shape[1],
                  image2.shape[0], image2.shape[1])

    # Set win_size to be odd and smaller than the minimum dimension
    win_size = min(7, min_dim - 1)
    if win_size % 2 == 0:
        win_size -= 1

    return ssim(image1, image2, win_size=win_size, channel_axis=-1)


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Check if the file has an allowed extension
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        # Try to open the image
        image = Image.open(file.stream)

        # Verify it's actually an image
        image.verify()

        # Rewind the file stream
        file.stream.seek(0)

        # Open the image again (because verify() closes the file)
        image = Image.open(file.stream).convert('RGB')
    except Exception as e:
        # If there's any error in opening the image, return an error message
        return jsonify({'error': f'Error processing image: {str(e)}'}), 400

    # Preprocess the image
    preprocessed_image = preprocess_image(image)

    # Generate adversarial image
    epsilon = 0.01  # You may need to adjust this value
    adversarial_image = fgsm.create_fgsm_adversarial_pattern(
        preprocessed_image, epsilon)

    # Convert back to uint8 for saving and SSIM calculation
    original_image_uint8 = np.array(image)
    adversarial_image_uint8 = (
        adversarial_image[0] * 255).numpy().astype(np.uint8)

    # Calculate SSIM
    ssim_value = calculate_ssim(original_image_uint8, adversarial_image_uint8)

    # Encode image to base64
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

    model_name = request.form.get('model', 'EfficientNetB0')

    # Check if the file has an allowed extension
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        # Try to open the image
        image = Image.open(file.stream)

        # Verify it's actually an image
        image.verify()

        # Rewind the file stream
        file.stream.seek(0)

        # Open the image again (because verify() closes the file)
        image = Image.open(file.stream).convert('RGB')
    except Exception as e:
        # If there's any error in opening the image, return an error message
        return jsonify({'error': f'Error processing image: {str(e)}'}), 400

    # Resize and preprocess the image based on the selected model
    if model_name == 'EfficientNetB0':
        model = efficientnet_model
        target_size = (224, 224)
    elif model_name == 'InceptionV3':
        model = inceptionv3_model
        target_size = (299, 299)
    else:  # MobileNetV2
        model = mobilenetv2_model
        target_size = (224, 224)

    # Resize the image
    resized_image = image.resize(target_size)

    # Convert to numpy array and preprocess
    img_array = np.array(resized_image)
    img_array = img_array.astype(np.float32) / 255.0  # Normalize to [0, 1]
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

    # Make prediction
    prediction = model.predict(img_array)
    predicted_label = get_predictions(img_array, model_name)

    # Encode original image to base64
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return jsonify({
        'original_image_b64': img_str,
        'prediction': predicted_label
    })

# Update the get_predictions function to handle the preprocessed image directly


def get_predictions(image, model_name):
    if model_name == 'EfficientNetB0':
        return efficientnetb0.get_imagenet_label(efficientnet_model.predict(image))
    elif model_name == 'InceptionV3':
        return inceptionv3.get_imagenet_label(inceptionv3_model.predict(image))
    elif model_name == 'MobileNetV2':
        return mobilenetv2.get_imagenet_label(mobilenetv2_model.predict(image))


if __name__ == '__main__':
    app.run(debug=True)
