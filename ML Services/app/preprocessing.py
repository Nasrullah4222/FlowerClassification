from PIL import Image
from torchvision import transforms


IMG_SIZE = 224

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]


transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
])


def preprocess_image(image: Image.Image):
    """
    Convert uploaded PIL image into a tensor
    suitable for the DINO model.
    """

    # Make sure image has 3 RGB channels
    image = image.convert("RGB")

    # Apply the exact inference transformation
    image = transform(image)

    # Add batch dimension
    image = image.unsqueeze(0)

    return image
