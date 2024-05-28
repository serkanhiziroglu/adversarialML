import tensorflow as tf


def EfficientnetModel():
    model = tf.keras.applications.EfficientNetB0(
        include_top=True, weights='imagenet')
    model.trainable = False
    preprocess_input = tf.keras.applications.efficientnet.preprocess_input
    decode_predictions = tf.keras.applications.efficientnet.decode_predictions

    def preprocess(image):
        image = tf.image.resize(image, (224, 224))
        image = tf.cast(image, tf.float32)
        image = preprocess_input(image)
        image = image[None, ...]
        return image

    return model, preprocess, decode_predictions
