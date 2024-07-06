# In adversarial_methods/fgsm.py

import tensorflow as tf


def create_fgsm_adversarial_pattern(image, epsilon):
    # Create a tensor of ones with the same shape as the image
    perturbation = tf.random.uniform(
        shape=tf.shape(image), minval=-1, maxval=1)

    # Apply the perturbation
    adversarial_image = image + epsilon * tf.sign(perturbation)

    # Clip to ensure we stay in [0, 1] range
    adversarial_image = tf.clip_by_value(adversarial_image, 0, 1)

    return adversarial_image
