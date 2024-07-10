import tensorflow as tf
import numpy as np
from tensorflow.image import ssim

class UAP:
    def __init__(self, epsilon=0.003, iterations=100, ssim_weight=1.5, learning_rate=0.001):
        self.epsilon = epsilon
        self.iterations = iterations
        self.ssim_weight = ssim_weight
        self.learning_rate = learning_rate

    def generate(self, preprocessed_images):
        adversarial_images = {}
        for model_name, image in preprocessed_images.items():
            model = load_model(model_name)
            delta = tf.Variable(tf.zeros_like(image), trainable=True)
            optimizer = tf.optimizers.Adam(learning_rate=self.learning_rate)
            image = tf.convert_to_tensor(image, dtype=tf.float32)
            image = tf.expand_dims(image, 0)  # Ensure batch dimension

            for i in range(self.iterations):
                with tf.GradientTape() as tape:
                    tape.watch(delta)
                    adversarial_image = image + delta
                    adversarial_image = tf.clip_by_value(adversarial_image, 0, 1)
                    prediction = model(adversarial_image)
                    loss = -tf.reduce_mean(prediction)
                    
                    # Add SSIM loss
                    ssim_value = ssim(image, adversarial_image, max_val=1.0)
                    ssim_loss = (1 - ssim_value) * self.ssim_weight
                    total_loss = loss + ssim_loss

                gradient = tape.gradient(total_loss, delta)
                if gradient is None:
                    print(f"Iteration {i}: Gradient is None for model {model_name}. Check image and delta shapes.")
                    print(f"Image shape: {image.shape}")
                    print(f"Delta shape: {delta.shape}")
                    return None
                
                optimizer.apply_gradients([(gradient, delta)])
                delta.assign(tf.clip_by_value(delta, -self.epsilon, self.epsilon))

            adversarial_images[model_name] = adversarial_image

        return adversarial_images

def preprocess_image(image, model_name):
    if model_name == "efficientnetb0":
        image = image.resize((224, 224))
        image = tf.keras.applications.efficientnet.preprocess_input(np.array(image))
    elif model_name == "inceptionv3":
        image = image.resize((299, 299))
        image = tf.keras.applications.inception_v3.preprocess_input(np.array(image))
    elif model_name == "mobilenetv2":
        image = image.resize((224, 224))
        image = tf.keras.applications.mobilenet_v2.preprocess_input(np.array(image))
    else:
        raise ValueError("Unknown model name")
    return image

def load_model(model_name):
    if model_name == "efficientnetb0":
        model = tf.keras.applications.EfficientNetB0(weights="imagenet", include_top=True)
    elif model_name == "inceptionv3":
        model = tf.keras.applications.InceptionV3(weights="imagenet", include_top=True)
    elif model_name == "mobilenetv2":
        model = tf.keras.applications.MobileNetV2(weights="imagenet", include_top=True)
    else:
        raise ValueError("Unknown model name")
    
    model.trainable = False
    return model