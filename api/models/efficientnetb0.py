import tensorflow as tf


def load_model():
    print("Loading EfficientNetB0 model...")
    model = tf.keras.applications.EfficientNetB0(
        include_top=True, weights='imagenet')
    model.trainable = False
    print("Model loaded successfully.")
    return model


def preprocess_image(image):
    image = image.resize((224, 224))
    image_array = tf.keras.preprocessing.image.img_to_array(image)
    image_array = tf.keras.applications.efficientnet.preprocess_input(
        image_array)
    return tf.expand_dims(image_array, 0)


def get_imagenet_label(pred_array):
    decoded_predictions = tf.keras.applications.efficientnet.decode_predictions(
        pred_array, top=1)[0]
    # Return (class_name, confidence)
    return decoded_predictions[0][1], decoded_predictions[0][2]
