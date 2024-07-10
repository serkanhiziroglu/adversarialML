import numpy as np
import cv2
from skimage.metrics import structural_similarity as ssim

def calculate_image_ssim(original_image, adversarial_image):
    original_image = np.array(original_image)
    adversarial_image = np.array(adversarial_image)

    print("Original image shape:", original_image.shape)
    print("Adversarial image shape:", adversarial_image.shape)

    if original_image.ndim < 2 or adversarial_image.ndim < 2:
        raise ValueError("Both images must have at least 2 dimensions")

    if original_image.ndim == 2:
        original_image = np.expand_dims(original_image, axis=-1)
    if adversarial_image.ndim == 2:
        adversarial_image = np.expand_dims(adversarial_image, axis=-1)

    if original_image.shape[-1] != adversarial_image.shape[-1]:
        raise ValueError("Both images must have the same number of channels")

    if original_image.shape[:2] != adversarial_image.shape[:2]:
        print(f"Resizing adversarial image from {adversarial_image.shape[:2]} to {original_image.shape[:2]}")
        if 0 in original_image.shape[:2]:
            raise ValueError("Original image has zero width or height")
        adversarial_image = cv2.resize(adversarial_image, (original_image.shape[1], original_image.shape[0]))

    original_image = original_image.astype(np.float32) / 255.0
    adversarial_image = adversarial_image.astype(np.float32) / 255.0

    num_channels = original_image.shape[-1]
    ssim_values = [ssim(original_image[..., i],
                        adversarial_image[..., i],
                        data_range=1.0) for i in range(num_channels)]
    ssim_value = np.mean(ssim_values)

    return ssim_value