import tensorflow as tf


def load_mobilenet_model():
    model = tf.keras.applications.MobileNetV2(
        include_top=True, weights='imagenet')
    model.trainable = False
    return model


def preprocess_image(image):
    image = tf.cast(image, tf.float32)
    image = tf.image.resize(image, (224, 224))
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    image = image[None, ...]
    return image


def decode_predictions(preds):
    return tf.keras.applications.mobilenet_v2.decode_predictions(preds, top=1)[0][0]
