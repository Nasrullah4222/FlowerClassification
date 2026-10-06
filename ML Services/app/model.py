import json
import joblib
import torch
import timm

from pathlib import Path

from .preprocessing import preprocess_image


# =========================================================
# 1. Configuration
# =========================================================

MODEL_DIR = Path(__file__).resolve().parent.parent / "models"

DINO_PATH = MODEL_DIR / "dino_backbone.pth"
CLASSIFIER_PATH = MODEL_DIR / "flower_classifier.joblib"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.json"


DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


BACKBONE_NAME = "vit_base_patch16_224"


# =========================================================
# 2. Build DINO backbone
# =========================================================

def build_backbone():

    model = timm.create_model(
        BACKBONE_NAME,
        pretrained=False,
        num_classes=0,
        dynamic_img_size=True
    )

    # Same setting used in the deployment notebook
    if hasattr(model, "patch_embed"):
        if hasattr(model.patch_embed, "strict_img_size"):
            model.patch_embed.strict_img_size = False

    model.to(DEVICE)

    return model


# =========================================================
# 3. Load DINO weights
# =========================================================

def load_backbone():

    model = build_backbone()

    checkpoint = torch.load(
        DINO_PATH,
        map_location=DEVICE
    )

    # Handle different checkpoint formats
    if isinstance(checkpoint, dict):

        for key in [
            "state_dict",
            "model_state_dict",
            "model",
            "backbone",
            "encoder"
        ]:

            if key in checkpoint:
                checkpoint = checkpoint[key]
                break

    # Remove common prefixes if they exist
    cleaned_checkpoint = {}

    for key, value in checkpoint.items():

        new_key = key

        for prefix in [
            "module.",
            "student.",
            "backbone."
        ]:

            if new_key.startswith(prefix):
                new_key = new_key[len(prefix):]

        cleaned_checkpoint[new_key] = value

    model.load_state_dict(
        cleaned_checkpoint,
        strict=True
    )

    model.eval()

    return model


# =========================================================
# 4. Load Logistic Regression + Scaler
# =========================================================

def load_classifier():

    artifact = joblib.load(
        CLASSIFIER_PATH
    )

    scaler = artifact["scaler"]
    classifier = artifact["classifier"]

    return scaler, classifier


# =========================================================
# 5. Load class names
# =========================================================

def load_class_names():

    with open(
        CLASS_NAMES_PATH,
        "r",
        encoding="utf-8"
    ) as file:

        class_names = json.load(file)

    return class_names


# =========================================================
# 6. Load everything once
# =========================================================

print("Loading DINO model...")

backbone = load_backbone()

print("Loading classifier...")

scaler, classifier = load_classifier()

print("Loading class names...")

class_names = load_class_names()

print("ML model loaded successfully.")


# =========================================================
# 7. Prediction function
# =========================================================

def predict_flower(image):

    """
    Predict flower from a PIL image.

    Returns:
        {
            "flower": "...",
            "confidence": 0.XX
        }
    """

    # -----------------------------------------
    # Preprocess image
    # -----------------------------------------

    image_tensor = preprocess_image(image)

    image_tensor = image_tensor.to(DEVICE)


    # -----------------------------------------
    # Extract DINO features
    # -----------------------------------------

    with torch.no_grad():

        features = backbone(
            image_tensor
        )


    # -----------------------------------------
    # Move feature to CPU
    # -----------------------------------------

    features = features.cpu().numpy()


    # -----------------------------------------
    # Apply StandardScaler
    # -----------------------------------------

    features_scaled = scaler.transform(
        features
    )


    # -----------------------------------------
    # Logistic Regression prediction
    # -----------------------------------------

    prediction = classifier.predict(
        features_scaled
    )

    probabilities = classifier.predict_proba(
        features_scaled
    )


    # -----------------------------------------
    # Get class index
    # -----------------------------------------

    class_index = int(
        prediction[0]
    )


    # -----------------------------------------
    # Get flower name
    # -----------------------------------------

    flower_name = class_names[
        class_index
    ]


    # -----------------------------------------
    # Get confidence
    # -----------------------------------------

    confidence = float(
        probabilities[0][class_index]
    )


    return {
        "flower": flower_name,
        "confidence": confidence
    }
