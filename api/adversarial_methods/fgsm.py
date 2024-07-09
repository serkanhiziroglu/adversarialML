import tensorflow as tf

def create_fgsm_adversarial_pattern(image, epsilon, iterations=10, alpha=0.05):
    image = tf.convert_to_tensor(image, dtype=tf.float32)
    
    for _ in range(iterations):
        with tf.GradientTape() as tape:
            tape.watch(image)
            loss = tf.reduce_mean(image)

        gradient = tape.gradient(loss, image)
        signed_grad = tf.sign(gradient)
        
        image = image + alpha * signed_grad
        image = tf.clip_by_value(image, image - epsilon, image + epsilon)
        image = tf.clip_by_value(image, 0, 1)

    return image