# models/mobilenetv2.py
import tensorflow as tf


def load_model():
    print("Loading MobileNetV2 model...")
    model = tf.keras.applications.MobileNetV2(
        include_top=True, weights='imagenet')
    model.trainable = False
    print("Model loaded successfully.")
    return model


def preprocess_image(image_path):
    image_raw = tf.io.read_file(image_path)
    image = tf.image.decode_image(image_raw, channels=3)
    image = tf.image.resize(image, (224, 224))
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    image = image[None, ...]
    return image


def get_imagenet_label(probs):
    decode_predictions = tf.keras.applications.mobilenet_v2.decode_predictions
    return decode_predictions(probs, top=1)[0][0]
