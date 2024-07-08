import tensorflow as tf
import numpy as np
from skimage.metrics import structural_similarity as ssim


def preprocess_image(image):
    image_array = np.array(image)
    image_array = image_array.astype(np.float32) / 255.0
    image_tensor = tf.convert_to_tensor(np.expand_dims(image_array, axis=0))
    return image_tensor


def calculate_ssim(image1, image2):
    return ssim(image1, image2, channel_axis=-1)
