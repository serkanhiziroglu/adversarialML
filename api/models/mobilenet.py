import tensorflow as tf


def Mobilenetv2Model():
    model = tf.keras.applications.MobileNetV2(
        include_top=True, weights='imagenet')
    model.trainable = False
    preprocess_input = tf.keras.applications.mobilenet_v2.preprocess_input
    decode_predictions = tf.keras.applications.mobilenet_v2.decode_predictions

    def preprocess(image):
        image = tf.cast(image, tf.float32)
        image = tf.image.resize(image, (224, 224))
        image = preprocess_input(image)
        image = image[None, ...]
        return image

    return model, preprocess, decode_predictions
