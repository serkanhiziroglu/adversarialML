import tensorflow as tf
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
import io
import base64
import json
import os
from skimage.metrics import structural_similarity as ssim

mpl.rcParams['figure.figsize'] = (8, 8)
mpl.rcParams['axes.grid'] = False
mpl.rcParams['savefig.bbox'] = 'tight'


def main(image_path, output_path):
    print("Loading InceptionV3 model...")
    pretrained_model = tf.keras.applications.InceptionV3(
        include_top=True, weights='imagenet')
    pretrained_model.trainable = False
    print("Model loaded successfully.")

    decode_predictions = tf.keras.applications.inception_v3.decode_predictions

    def preprocess(image):
        image = tf.image.resize(image, (299, 299))
        image = tf.keras.applications.inception_v3.preprocess_input(image)
        image = image[None, ...]
        return image

    def get_imagenet_label(probs):
        return decode_predictions(probs, top=1)[0][0]

    print(f"Reading and preprocessing image from {image_path}...")
    image_raw = tf.io.read_file(image_path)
    image = tf.image.decode_image(image_raw, channels=3)
    image = preprocess(image)
    print("Image loaded and preprocessed successfully.")

    print("Predicting label for the original image...")
    image_probs = pretrained_model.predict(image)
    _, label, confidence = get_imagenet_label(image_probs)
    print(
        f"Original image prediction: {label} with {confidence * 100:.2f}% confidence.")

    print("Saving original image...")
    plt.figure()
    plt.imshow((image[0] + 1) / 2.0)
    plt.title(
        f'{label} : {confidence * 100:.2f}% Confidence\nModel: InceptionV3', fontsize=12)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    original_image_b64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    print("Original image saved successfully.")

    loss_object = tf.keras.losses.CategoricalCrossentropy()
    epsilon = 0.015  # Start with a low epsilon value

    def create_fgsm_adversarial_pattern(input_image, input_label):
        print("Generating adversarial pattern using FGSM...")
        with tf.GradientTape() as tape:
            tape.watch(input_image)
            prediction = pretrained_model(input_image)
            loss = loss_object(input_label, prediction)
        gradient = tape.gradient(loss, input_image)
        signed_grad = tf.sign(gradient)
        adversarial_image = input_image + epsilon * signed_grad
        adversarial_image = tf.clip_by_value(adversarial_image, -1.0, 1.0)
        return adversarial_image

    prediction = pretrained_model.predict(image)
    label_index = np.argmax(prediction[0])
    label = tf.one_hot(label_index, prediction.shape[-1])
    label = tf.reshape(label, (1, prediction.shape[-1]))

    adv_x = create_fgsm_adversarial_pattern(image, label)

    print("Predicting label for the adversarial image...")
    adv_probs = pretrained_model.predict(adv_x)
    _, adv_label, adv_confidence = get_imagenet_label(adv_probs)
    print(
        f"Adversarial image prediction: {adv_label} with {adv_confidence * 100:.2f}% confidence.")

    print("Saving adversarial image...")
    plt.figure()
    plt.imshow((adv_x[0] + 1) / 2.0)
    plt.title(
        f'{adv_label} : {adv_confidence * 100:.2f}% Confidence\nModel: InceptionV3\nMethod: FGSM, Epsilon: {epsilon}')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    adversarial_image_b64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    print("Adversarial image saved successfully.")

    original_image_np = ((image[0] + 1) / 2.0).numpy()
    adversarial_image_np = ((adv_x[0] + 1) / 2.0).numpy()

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


if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python fgsmVSinception.py <image_path> <output_path>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
