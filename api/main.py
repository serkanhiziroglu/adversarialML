import os
import io
import json
import base64
import importlib
import matplotlib.pyplot as plt
from skimage.metrics import structural_similarity as ssim
import tensorflow as tf

# Set Matplotlib backend to 'Agg' for non-GUI rendering
plt.switch_backend('Agg')

# Dictionary to store epsilon values for different models and methods
EPSILON_VALUES = {
    'efficientnetb0': {
        'fgsm': 5.115
    }
}


def save_image(image_tensor, label, confidence, model_name, method_name, epsilon=None):
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.imshow(image_tensor[0] / 255.0)
    title = f'{label} : {confidence * 100:.2f}% Confidence\nModel: {model_name}'
    if method_name and epsilon is not None:
        title += f'\nMethod: {method_name.upper()}, Epsilon: {epsilon}'
    ax.set_title(title, fontsize=12)
    ax.axis('off')  # Hide the axes
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight',
                pad_inches=0)  # Remove whitespace
    buf.seek(0)
    image_b64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    return image_b64


def main(image_path, output_path):
    print("Loading EfficientNetB0 model...")
    model_name = 'efficientnetb0'
    method_name = 'fgsm'

    model_module = importlib.import_module(f"models.{model_name}")
    method_module = importlib.import_module(
        f"adversarial_methods.{method_name}")

    model = model_module.load_model()
    image = model_module.preprocess_image(image_path)

    decode_predictions = tf.keras.applications.efficientnet.decode_predictions

    def get_imagenet_label(probs):
        return decode_predictions(probs, top=1)[0][0]

    print(f"Reading and preprocessing image from {image_path}...")
    print("Image loaded and preprocessed successfully.")

    print("Predicting label for the original image...")
    image_probs = model.predict(image)
    _, label, confidence = get_imagenet_label(model.predict(image))
    print(
        f"Original image prediction: {label} with {confidence * 100:.2f}% confidence.")

    print("Saving original image...")
    original_image_b64 = save_image(image, label, confidence, model_name, None)
    print("Original image saved successfully.")

    label = tf.one_hot(tf.argmax(image_probs[0]), image_probs.shape[-1])
    label = tf.reshape(label, (1, image_probs.shape[-1]))

    epsilon = EPSILON_VALUES.get(model_name, {}).get(
        method_name, 1.015)  # Default to 0.01 if not found
    adv_x = method_module.create_fgsm_adversarial_pattern(
        model, image, label, epsilon)

    print("Predicting label for the adversarial image...")
    _, adv_label, adv_confidence = get_imagenet_label(model.predict(adv_x))
    print(
        f"Adversarial image prediction: {adv_label} with {adv_confidence * 100:.2f}% confidence.")

    print("Saving adversarial image...")
    adversarial_image_b64 = save_image(
        adv_x, adv_label, adv_confidence, model_name, method_name, epsilon)
    print("Adversarial image saved successfully.")

    original_image_np = (image[0] / 255.0).numpy()
    adversarial_image_np = (adv_x[0] / 255.0).numpy()

    ssim_value = ssim(original_image_np, adversarial_image_np,
                      multichannel=True, data_range=1.0, win_size=3)
    ssim_value = float(ssim_value)
    print(f"SSIM between original and adversarial images: {ssim_value}")

    result = {
        "original_image_b64": original_image_b64,
        "adversarial_image_b64": adversarial_image_b64,
        "ssim": ssim_value
    }

    with open(output_path, 'w') as f:
        json.dump(result, f)
    print(f"Results written to {output_path}")
