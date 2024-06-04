import tensorflow as tf
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
import io
import base64
import json
from skimage.metrics import structural_similarity as ssim

mpl.rcParams['figure.figsize'] = (8, 8)
mpl.rcParams['axes.grid'] = False
mpl.rcParams['savefig.bbox'] = 'tight'  # Remove whitespace


def main(image_path, output_path):
    print("Loading EfficientNetB0 model...")
    pretrained_model = tf.keras.applications.EfficientNetB0(
        include_top=True, weights='imagenet')
    pretrained_model.trainable = False
    print("Model loaded successfully.")

    decode_predictions = tf.keras.applications.efficientnet.decode_predictions

    def preprocess(image):
        image = tf.image.resize(image, (224, 224))
        image = tf.cast(image, tf.float32)
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
    _, label, confidence = get_imagenet_label(pretrained_model.predict(image))
    print(
        f"Original image prediction: {label} with {confidence * 100:.2f}% confidence.")

    print("Saving original image...")
    plt.figure()
    plt.imshow(image[0] / 255.0)
    plt.title(
        f'{label} : {confidence * 100:.2f}% Confidence\nModel: EfficientNetB0', fontsize=12)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    original_image_b64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    print("Original image saved successfully.")

    class CarliniWagnerL2:
        def __init__(self, model, confidence=0, learning_rate=1e-2, binary_search_steps=3, max_iterations=200, initial_const=1e-2, clip_min=0.0, clip_max=1.0):
            self.model = model
            self.confidence = confidence
            self.learning_rate = learning_rate
            self.binary_search_steps = binary_search_steps
            self.max_iterations = max_iterations
            self.initial_const = initial_const
            self.clip_min = clip_min
            self.clip_max = clip_max

        def generate(self, input_image, target_label):
            input_image = tf.convert_to_tensor(input_image)
            target_label = tf.convert_to_tensor(target_label)

            def loss_fn(modifier, const, input_image, target_label):
                adv_image = tf.tanh(modifier) * 0.5 + 0.5  # Transform to [0,1]
                # Transform to [clip_min, clip_max]
                adv_image = adv_image * \
                    (self.clip_max - self.clip_min) + self.clip_min
                logits = self.model(adv_image)
                real = tf.reduce_sum(target_label * logits, axis=1)
                other = tf.reduce_max(
                    (1 - target_label) * logits - target_label * 1e4, axis=1)
                loss1 = tf.reduce_sum(tf.maximum(
                    0.0, other - real + self.confidence))
                loss2 = tf.reduce_sum(tf.square(adv_image - input_image))
                return const * loss1 + loss2, adv_image

            shape = input_image.shape
            modifier = tf.Variable(tf.zeros(shape, dtype=tf.float32))
            best_adv_image = input_image

            lower_bound = tf.zeros([shape[0]])
            upper_bound = tf.ones([shape[0]]) * 1e10
            const = tf.ones([shape[0]]) * self.initial_const

            lower_bound_array = tf.TensorArray(
                tf.float32, size=shape[0], clear_after_read=False)
            upper_bound_array = tf.TensorArray(
                tf.float32, size=shape[0], clear_after_read=False)
            const_array = tf.TensorArray(
                tf.float32, size=shape[0], clear_after_read=False)
            lower_bound_array = lower_bound_array.unstack(lower_bound)
            upper_bound_array = upper_bound_array.unstack(upper_bound)
            const_array = const_array.unstack(const)

            optimizer = tf.keras.optimizers.Adam(
                learning_rate=self.learning_rate)

            for step in range(self.binary_search_steps):
                best_loss = float('inf')
                for iteration in range(self.max_iterations):
                    with tf.GradientTape() as tape:
                        loss, adv_image = loss_fn(
                            modifier, const, input_image, target_label)
                    grads = tape.gradient(loss, [modifier])
                    optimizer.apply_gradients(zip(grads, [modifier]))

                    if loss < best_loss:
                        best_loss = loss
                        best_adv_image = adv_image

                # Binary search step
                for i in range(shape[0]):
                    if loss < best_loss:
                        upper_bound_array = upper_bound_array.write(
                            i, min(upper_bound_array.read(i), const_array.read(i)))
                        if upper_bound_array.read(i) < 1e9:
                            const_array = const_array.write(
                                i, (lower_bound_array.read(i) + upper_bound_array.read(i)) / 2)
                    else:
                        lower_bound_array = lower_bound_array.write(
                            i, max(lower_bound_array.read(i), const_array.read(i)))
                        if upper_bound_array.read(i) < 1e9:
                            const_array = const_array.write(
                                i, (lower_bound_array.read(i) + upper_bound_array.read(i)) / 2)
                        else:
                            const_array = const_array.write(
                                i, const_array.read(i) * 10)

            lower_bound = lower_bound_array.stack()
            upper_bound = upper_bound_array.stack()
            const = const_array.stack()

            return best_adv_image

    def create_cw_adversarial_pattern(input_image, input_label, confidence=0):
        print("Generating adversarial pattern using CW...")
        input_label = tf.one_hot(input_label, 1000)
        input_label = tf.reshape(input_label, (1, 1000))

        cw = CarliniWagnerL2(pretrained_model, confidence=confidence)
        adv_image = cw.generate(input_image, input_label)
        return adv_image

    prediction = pretrained_model.predict(image)
    label = tf.argmax(prediction[0])
    label = tf.reshape(label, (1,))

    adv_x = create_cw_adversarial_pattern(image, label)

    print("Predicting label for the adversarial image...")
    _, adv_label, adv_confidence = get_imagenet_label(
        pretrained_model.predict(adv_x))
    print(
        f"Adversarial image prediction: {adv_label} with {adv_confidence * 100:.2f}% confidence.")

    print("Saving adversarial image...")
    plt.figure()
    plt.imshow(adv_x[0] / 255.0)
    plt.title(
        f'{adv_label} : {adv_confidence * 100:.2f}% Confidence\nModel: EfficientNetB0\nMethod: CW')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    adversarial_image_b64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
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


if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python pgdVSenet.py <image_path> <output_path>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
