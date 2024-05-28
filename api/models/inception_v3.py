import tensorflow as tf


def Inceptionv3Model():
    model = tf.keras.applications.InceptionV3(
        include_top=True, weights='imagenet')
    model.trainable = False
    preprocess_input = tf.keras.applications.inception_v3.preprocess_input
    decode_predictions = tf.keras.applications.inception_v3.decode_predictions

    def preprocess(image):
        image = tf.cast(image, tf.float32)
        image = tf.image.resize(image, (299, 299))
        image = preprocess_input(image)
        image = image[None, ...]
        return image

    return model, preprocess, decode_predictions
