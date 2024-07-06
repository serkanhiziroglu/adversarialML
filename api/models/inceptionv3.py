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


def preprocess_image(image):
    # Adjust size as needed for each model
    image = tf.image.resize(image, (224, 224))
    # Use the appropriate preprocess_input function for each model
    image = tf.keras.applications.efficientnet.preprocess_input(image)
    return image[tf.newaxis, ...]


def get_imagenet_label(probs):
    decode_predictions = tf.keras.applications.inception_v3.decode_predictions
    return decode_predictions(probs, top=1)[0][0]
