from models import efficientnetb0, inceptionv3, mobilenetv2


def load_models():
    try:
        efficientnet_model = efficientnetb0.load_model()
        inceptionv3_model = inceptionv3.load_model()
        mobilenetv2_model = mobilenetv2.load_model()

        return {
            'EfficientNetB0': (efficientnet_model, efficientnetb0.preprocess_image, efficientnetb0.get_imagenet_label),
            'InceptionV3': (inceptionv3_model, inceptionv3.preprocess_image, inceptionv3.get_imagenet_label),
            'MobileNetV2': (mobilenetv2_model, mobilenetv2.preprocess_image, mobilenetv2.get_imagenet_label)
        }
    except Exception as e:
        print(f"Error loading models: {e}")
        return None
