import tensorflow as tf


def create_pgd_adversarial_pattern(pretrained_model, input_image, input_label, model_name):
    print("Generating adversarial pattern using PGD...")
    loss_object = tf.keras.losses.CategoricalCrossentropy()

    # Set specific epsilon and alpha values based on the model name
    epsilon_values = {
        'efficientnetb0': 1.055,
        'mobilenetv2': 0.015,
        'inceptionv3': 0.05
    }

    alpha_values = {
        'efficientnetb0': 0.1,
        'mobilenetv2': 0.001,
        'inceptionv3': 0.001
    }

    # Default values if model not found
    epsilon = epsilon_values.get(model_name.lower(), 1.0)
    alpha = alpha_values.get(model_name.lower(), 0.1)
    iterations = 40

    adversarial_image = tf.identity(input_image)
    for i in range(iterations):
        with tf.GradientTape() as tape:
            tape.watch(adversarial_image)
            prediction = pretrained_model(adversarial_image)
            loss = loss_object(input_label, prediction)

        gradient = tape.gradient(loss, adversarial_image)
        signed_grad = tf.sign(gradient)
        adversarial_image = adversarial_image + alpha * signed_grad
        adversarial_image = tf.clip_by_value(
            adversarial_image, input_image - epsilon, input_image + epsilon)
        if model_name.lower() in ['inceptionv3', 'mobilenetv2']:
            adversarial_image = tf.clip_by_value(adversarial_image, -1, 1)
        else:
            adversarial_image = tf.clip_by_value(adversarial_image, 0, 255)
        print(f"Iteration {i+1}/{iterations} complete.")
    return adversarial_image
