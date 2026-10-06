const structuredSearch = require("../Services/search");
const {findByFlowerName, createFlower, createPrediction} = require("../model/predict.model");

async function predictController(req, res) {
    if (!req.file) {
        return res.status(400).json({
            message: "File wasn't received."
        });
    }
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication is required."
        });
    }
    const file = req.file.buffer;

    const formData = new FormData();

    formData.append(
        "file",
        new Blob([file]),
        req.file.originalname
    );
    
    let result;
    try {
        const response = await fetch(
            "http://localhost:8000/predict",
            {
                method: "POST",
                body: formData
            }
        );

        result = await response.json();

        if (!response.ok) {
            return res.status(502).json({
                message: result.detail || "ML service prediction failed."
            });
        }

        console.log("Prediction received.");
    } catch (err) {
        console.error("ML prediction request failed:", err);
        return res.status(502).json({
            message: "ML service is unavailable."
        });
    }

    const flowerName = result.flower;
    const confidence = result.confidence;
    const flower = await findByFlowerName(flowerName);

    let flowerData;
    let flowerId;

    if (!flower) {
        const aiSearch = await structuredSearch(flowerName);

        const newFlower = await createFlower(
            flowerName,
            aiSearch.scientific_name,
            aiSearch.origin,
            aiSearch.common_myth
        );

        flowerId = newFlower.insertId;

        flowerData = {
            name: flowerName,
            scientific_name: aiSearch.scientific_name,
            origin: aiSearch.origin,
            common_myth: aiSearch.common_myth
        };
    } else {
        flowerId = flower.id;

        flowerData = {
            name: flower.name,
            scientific_name: flower.scientific_name,
            origin: flower.origin,
            common_myth: flower.common_myth
        };
    }

    const userId = req.user.id;
    await createPrediction(userId, flowerId, confidence);

    return res.status(200).json({
        success: true,
        flower: flowerData,
        confidence
    });
}

module.exports = { predictController };