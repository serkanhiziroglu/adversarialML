import tensorflow as tf


def load_model():
    print("Loading EfficientNetB0 model...")
    model = tf.keras.applications.EfficientNetB0(
        include_top=True, weights='imagenet')
    model.trainable = False
    print("Model loaded successfully.")
    return model


def preprocess_image(image):
    # Adjust size as needed for each model
    image = tf.image.resize(image, (224, 224))
    # Use the appropriate preprocess_input function for each model
    image = tf.keras.applications.efficientnet.preprocess_input(image)
    return image[tf.newaxis, ...]


def get_imagenet_label(pred_array):
    decoded_predictions = tf.keras.applications.efficientnet.decode_predictions(
        pred_array, top=1)[0]
    return decoded_predictions[0][1]  # Return the class name
