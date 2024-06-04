from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import importlib
import tensorflow as tf
from skimage.metrics import structural_similarity as ssim
import io
import base64
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Set Matplotlib backend to 'Agg' for non-GUI rendering
plt.switch_backend('Agg')

# Dictionary to store epsilon values for different models and methods
EPSILON_VALUES = {
    'efficientnetb0': {
        'fgsm': 1.015,
        'pgd': 0.0  # Increase epsilon value for a stronger attack
    }
}


def save_image(image_tensor, label, confidence, model_name, method_name, epsilon=None):
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.imshow(image_tensor[0] / 255.0)
    ax.axis('off')  # Hide the axes

    # Adjust layout to create space above the image for the text
    plt.subplots_adjust(top=0.8)

    # Title text
    title = f'\nEpsilon: {epsilon}\n{label} : {confidence * 100:.2f}% Confidence\nModel: {model_name}\nMethod: {method_name.upper()}'
    fig.suptitle(title, fontsize=12, va='top', ha='center', y=0.95)

    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight',
                pad_inches=0.1)  # Remove whitespace
    buf.seek(0)
    image_b64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    return image_b64


def run_script(image_path, output_path, model_name, method_name):
    try:
        print(
            f"Running script with model_name: {model_name} (type: {type(model_name)}) and method_name: {method_name} (type: {type(method_name)})")

        # Import model and method modules
        model_module = importlib.import_module(f"models.{model_name}")
        method_module = importlib.import_module(
            f"adversarial_methods.{method_name}")

        # Load model and preprocess image
        model = model_module.load_model()
        image = model_module.preprocess_image(image_path)

        # Predict original image label
        print("Predicting label for the original image...")
        image_probs = model.predict(image)
        _, label, confidence = model_module.get_imagenet_label(image_probs)
        print(
            f"Original image prediction: {label} with {confidence * 100:.2f}% confidence.")

        # Save original image
        print("Saving original image...")
        original_image_b64 = save_image(
            image, label, confidence, model_name, "original")

        # Prepare label for adversarial pattern
        label = tf.one_hot(tf.argmax(image_probs[0]), image_probs.shape[-1])
        label = tf.reshape(label, (1, image_probs.shape[-1]))

        # Get epsilon value
        epsilon = EPSILON_VALUES.get(model_name, {}).get(method_name, 0.1)
        print(f"Using increased epsilon: {epsilon} (type: {type(epsilon)})")

        # Check types before passing to create_fgsm_adversarial_pattern
        if not isinstance(epsilon, float):
            raise ValueError(
                f"Epsilon value is not a float: {epsilon} (type: {type(epsilon)})")

        if not isinstance(method_name, str):
            raise ValueError(
                f"Method name is not a string: {method_name} (type: {type(method_name)})")

        # Create adversarial pattern
        if method_name == 'fgsm':
            adv_x = method_module.create_fgsm_adversarial_pattern(
                model, image, label, epsilon)
        elif method_name == 'pgd':
            adv_x = method_module.create_pgd_adversarial_pattern(
                model, image, label, model_name)

        # Predict adversarial image label
        print("Predicting label for the adversarial image...")
        _, adv_label, adv_confidence = model_module.get_imagenet_label(
            model.predict(adv_x))
        print(
            f"Adversarial image prediction: {adv_label} with {adv_confidence * 100:.2f}% confidence.")

        # Save adversarial image
        print("Saving adversarial image...")
        adversarial_image_b64 = save_image(
            adv_x, adv_label, adv_confidence, model_name, method_name, epsilon)

        # Calculate SSIM
        original_image_np = (image[0] / 255.0).numpy()
        adversarial_image_np = (adv_x[0] / 255.0).numpy()
        ssim_value = ssim(original_image_np, adversarial_image_np,
                          multichannel=True, data_range=1.0, win_size=3)
        ssim_value = float(ssim_value)
        print(f"SSIM between original and adversarial images: {ssim_value}")

        # Prepare result
        result = {
            "original_image_b64": original_image_b64,
            "adversarial_image_b64": adversarial_image_b64,
            "ssim": ssim_value
        }

        # Write result to output path
        with open(output_path, 'w') as f:
            json.dump(result, f)
        print(f"Results written to {output_path}")

        return result
    except Exception as e:
        print(f"Error running script: {e}")
        return None


@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    model = request.form['model']
    method = request.form['method']

    # Print the types and values of model and method for debugging
    print(f"Received model: {model} (type: {type(model)})")
    print(f"Received method: {method} (type: {type(method)})")

    try:
        # Ensure model and method are strings
        model = str(model).lower()
        method = str(method).lower()
    except Exception as e:
        print(f"Error converting model or method to string: {e}")

    print(f"Processed model: {model} (type: {type(model)})")
    print(f"Processed method: {method} (type: {type(method)})")

    image_path = os.path.join('/tmp', file.filename)
    file.save(image_path)

    output_path = os.path.join('/tmp', 'output.json')

    result = run_script(image_path, output_path, model, method)

    if result is None:
        return jsonify({'error': 'Error processing images'}), 500

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
