import tensorflow as tf
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
import io
import base64

mpl.rcParams['figure.figsize'] = (8, 8)
mpl.rcParams['axes.grid'] = False


def main(image_path):
    # Load EfficientNet model
    pretrained_model = tf.keras.applications.EfficientNetB0(
        include_top=True, weights='imagenet')
    pretrained_model.trainable = False

    # Set decode_predictions function for EfficientNet
    decode_predictions = tf.keras.applications.efficientnet.decode_predictions

    # Preprocessing function
    def preprocess(image):
        image = tf.image.resize(image, (224, 224))
        image = tf.cast(image, tf.float32)
        image = image[None, ...]
        return image

    # Function to decode predictions
    def get_imagenet_label(probs):
        return decode_predictions(probs, top=1)[0][0]

    # Load and preprocess image
    image_raw = tf.io.read_file(image_path)
    image = tf.image.decode_image(image_raw, channels=3)
    image = preprocess(image)
    image_probs = pretrained_model.predict(image)

    # Display original image and print results
    _, label, confidence = get_imagenet_label(pretrained_model.predict(image))

    # Save original image to buffer
    plt.figure()
    plt.imshow(image[0] / 255.0)  # Normalize to [0, 1] for display
    plt.title(f'Original Image\n{label} : {confidence * 100:.2f}% Confidence')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    original_image_b64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

    # Adversarial pattern generation function
    loss_object = tf.keras.losses.CategoricalCrossentropy()

    def create_pgd_adversarial_pattern(input_image, input_label, epsilon=2.55, alpha=0.25, iterations=40):
        adversarial_image = tf.identity(input_image)
        for _ in range(iterations):
            with tf.GradientTape() as tape:
                tape.watch(adversarial_image)
                prediction = pretrained_model(adversarial_image)
                loss = loss_object(input_label, prediction)

            gradient = tape.gradient(loss, adversarial_image)
            signed_grad = tf.sign(gradient)
            adversarial_image = adversarial_image + alpha * signed_grad
            adversarial_image = tf.clip_by_value(
                adversarial_image, input_image - epsilon, input_image + epsilon)
            # Ensure the image stays within valid range
            adversarial_image = tf.clip_by_value(adversarial_image, 0, 255)
        return adversarial_image - input_image

    # Generate adversarial pattern
    prediction = pretrained_model.predict(image)
    label = tf.one_hot(tf.argmax(prediction[0]), prediction.shape[-1])
    label = tf.reshape(label, (1, prediction.shape[-1]))

    perturbations = create_pgd_adversarial_pattern(image, label)

    # Display adversarial image with epsilon = 2.55
    epsilon = 1.055
    adv_x = image + epsilon * perturbations
    adv_x = tf.clip_by_value(adv_x, 0, 255)

    # Display adversarial image and print results
    _, adv_label, adv_confidence = get_imagenet_label(
        pretrained_model.predict(adv_x))

    # Save adversarial image to buffer
    plt.figure()
    plt.imshow(adv_x[0] / 255.0)  # Normalize to [0, 1] for display
    plt.title(
        f'Adversarial Image\n{adv_label} : {adv_confidence * 100:.2f}% Confidence')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    adversarial_image_b64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

    # Print base64 encoded images
    print(f"Original Image Base64: {original_image_b64}")
    print(f"Adversarial Image Base64: {adversarial_image_b64}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python pgdVSenet.py <image_path>")
        sys.exit(1)
    main(sys.argv[1])
