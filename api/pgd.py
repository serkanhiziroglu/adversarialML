import tensorflow as tf
import matplotlib as mpl
import matplotlib.pyplot as plt

mpl.rcParams['figure.figsize'] = (8, 8)
mpl.rcParams['axes.grid'] = False

pretrained_model = tf.keras.applications.MobileNetV2(include_top=True,
                                                     weights='imagenet')
pretrained_model.trainable = False

# ImageNet labels
decode_predictions = tf.keras.applications.mobilenet_v2.decode_predictions

# Helper function to preprocess the image so that it can be inputted in MobileNetV2


def preprocess(image):
    image = tf.cast(image, tf.float32)
    image = tf.image.resize(image, (224, 224))
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    image = image[None, ...]
    return image

# Helper function to extract labels from probability vector


def get_imagenet_label(probs):
    return decode_predictions(probs, top=1)[0][0]


image_path = tf.keras.utils.get_file(
    'YellowLabradorLooking_new.jpg', 'https://storage.googleapis.com/download.tensorflow.org/example_images/YellowLabradorLooking_new.jpg')
image_raw = tf.io.read_file(image_path)
image = tf.image.decode_image(image_raw)

image = preprocess(image)
image_probs = pretrained_model.predict(image)

plt.figure()
plt.imshow(image[0] * 0.5 + 0.5)  # To change [-1, 1] to [0,1]
_, image_class, class_confidence = get_imagenet_label(image_probs)
plt.title('{} : {:.2f}% Confidence'.format(image_class, class_confidence*100))
plt.show()

loss_object = tf.keras.losses.CategoricalCrossentropy()

# PGD method


def create_adversarial_pattern_pgd(input_image, input_label, eps, alpha, num_iter):
    adv_image = tf.identity(input_image)
    for _ in range(num_iter):
        with tf.GradientTape() as tape:
            tape.watch(adv_image)
            prediction = pretrained_model(adv_image)
            loss = loss_object(input_label, prediction)
        # Get the gradients of the loss w.r.t to the input image.
        gradient = tape.gradient(loss, adv_image)
        # Get the sign of the gradients to create the perturbation
        signed_grad = tf.sign(gradient)
        # Update the image with the perturbation
        adv_image = adv_image + alpha * signed_grad
        # Clip the image to ensure it's within the valid range
        adv_image = tf.clip_by_value(
            adv_image, input_image - eps, input_image + eps)
        adv_image = tf.clip_by_value(adv_image, -1, 1)
    return adv_image


# Get the input label of the image.
labrador_retriever_index = 208
label = tf.one_hot(labrador_retriever_index, image_probs.shape[-1])
label = tf.reshape(label, (1, image_probs.shape[-1]))

# Parameters for PGD
eps = 0.03  # Maximum perturbation
alpha = 0.005  # Step size
num_iter = 40  # Number of iterations

adv_image = create_adversarial_pattern_pgd(image, label, eps, alpha, num_iter)

# Function to display images


def display_images(image, description):
    _, label, confidence = get_imagenet_label(pretrained_model.predict(image))
    plt.figure()
    plt.imshow(image[0]*0.5+0.5)
    plt.title('{} \n {} : {:.2f}% Confidence'.format(
        description, label, confidence*100))
    plt.show()


# Display the adversarial image
display_images(adv_image, 'PGD Adversarial Image')
