import tensorflow as tf


def create_fgsm_adversarial_pattern(pretrained_model, input_image, input_label, epsilon):
    print("Generating adversarial pattern using FGSM...")
    loss_object = tf.keras.losses.CategoricalCrossentropy()

    with tf.GradientTape() as tape:
        tape.watch(input_image)
        prediction = pretrained_model(input_image)
        loss = loss_object(input_label, prediction)
    gradient = tape.gradient(loss, input_image)
    signed_grad = tf.sign(gradient)
    adversarial_image = input_image + epsilon * signed_grad
    adversarial_image = tf.clip_by_value(adversarial_image, 0, 255)
    return adversarial_image
