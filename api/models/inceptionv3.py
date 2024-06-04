import tensorflow as tf


def load_model():
    print("Loading InceptionV3 model...")
    try:
        model = tf.keras.applications.InceptionV3(
            include_top=True, weights='imagenet')
        model.trainable = False
        print("Model loaded successfully.")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None


def preprocess_image(image_path):
    image_raw = tf.io.read_file(image_path)
    image = tf.image.decode_image(image_raw, channels=3)
    # InceptionV3 expects 299x299 images
    image = tf.image.resize(image, (299, 299))
    image = tf.cast(image, tf.float32)
    image = tf.keras.applications.inception_v3.preprocess_input(image)
    image = image[None, ...]
    return image


def get_imagenet_label(probs):
    decode_predictions = tf.keras.applications.inception_v3.decode_predictions
    return decode_predictions(probs, top=1)[0][0]
