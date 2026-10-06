from fastapi import FastAPI, UploadFile, File, HTTPException
from PIL import Image

from io import BytesIO

from .model import predict_flower


# =========================================================
# FastAPI application
# =========================================================

app = FastAPI(
    title="Flower Classification ML API",
    description="DINO ViT-B/16 based flower classification API",
    version="1.0.0"
)


# =========================================================
# Root route
# =========================================================

@app.get("/")
async def root():

    return {
        "message": "Flower Classification ML API is running."
    }


# =========================================================
# Prediction route
# =========================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    # -----------------------------------------
    # Check file type
    # -----------------------------------------

    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be detected."
        )


    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ]


    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image."
        )


    try:

        # -----------------------------------------
        # Read uploaded file
        # -----------------------------------------

        image_bytes = await file.read()


        # -----------------------------------------
        # Convert bytes → PIL Image
        # -----------------------------------------

        image = Image.open(
            BytesIO(image_bytes)
        )


        # -----------------------------------------
        # Predict flower
        # -----------------------------------------

        result = predict_flower(
            image
        )


        # -----------------------------------------
        # Return result
        # -----------------------------------------

        return {
            "success": True,
            "flower": result["flower"],
            "confidence": result["confidence"]
        }


    except Exception as error:

        print("Prediction error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to process the image."
        )
