import tensorflow as tf


def create_adversarial_pattern(model, loss_object, input_image, input_label, epsilon=0.005, num_iterations=10, alpha=0.001):
    adv_image = tf.identity(input_image)  # Make a copy of the input image

    for _ in range(num_iterations):
        with tf.GradientTape() as tape:
            tape.watch(adv_image)
            prediction = model(adv_image)
            loss = loss_object(input_label, prediction)

        gradient = tape.gradient(loss, adv_image)
        signed_grad = tf.sign(gradient)
        adv_image = adv_image + alpha * signed_grad
        adv_image = tf.clip_by_value(
            adv_image, input_image - epsilon, input_image + epsilon)
        adv_image = tf.clip_by_value(adv_image, 0.0, 1.0)

    return adv_image
