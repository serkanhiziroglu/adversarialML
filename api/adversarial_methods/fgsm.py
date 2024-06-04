# adversarial_methods/fgsm.py
import tensorflow as tf


def create_fgsm_adversarial_pattern(model, image, label, epsilon, model_name):
    with tf.GradientTape() as tape:
        tape.watch(image)
        prediction = model(image)
        loss = tf.keras.losses.categorical_crossentropy(label, prediction)

    gradient = tape.gradient(loss, image)
    signed_grad = tf.sign(gradient)
    adversarial_image = image + epsilon * signed_grad

    if model_name.lower() == 'inceptionv3':
        adversarial_image = tf.clip_by_value(adversarial_image, -1, 1)
    else:
        adversarial_image = tf.clip_by_value(adversarial_image, 0, 255)

    print(
        f"Adversarial image min: {adversarial_image.numpy().min()}, max: {adversarial_image.numpy().max()}, mean: {adversarial_image.numpy().mean()}")

    return adversarial_image
