const { HfInference } = require("@huggingface/inference");


async function structuredSearch(flowerName) {

    // 1. Check API token
    if (!process.env.HF_TOKEN) {
        throw new Error("HF_TOKEN is missing from .env");
    }


    // 2. Create Hugging Face client
    const hf = new HfInference(process.env.HF_TOKEN);


    // 3. Instruction for the AI
    const systemInstruction = `
        You are a flower information assistant.

        Return information about the flower requested by the user.

        Return ONLY valid JSON with exactly these three fields:

        {
            "scientific_name": "The scientific name of the flower",
            "origin": "The original geographic region or continent where the flower is native",
            "common_myth": "One concise sentence describing a commonly associated myth or cultural belief about the flower"
        }

        Rules:

        - Do not include any additional fields.
        - Do not include Markdown or code fences.
        - "origin" must be a short geographic name, preferably 1-3 words.
        - "common_myth" must be one concise sentence.
        - Use null if reliable information is unavailable.
        - Do not invent or guess facts.
    `;


    // 4. Create the prompt
    const prompt = `
        ${systemInstruction}

        Find information about this flower: ${flowerName}

        Return ONLY valid JSON.
    `;


    // 5. Send prompt to Hugging Face
    const response = await hf.textGeneration({
        model: "TeichAI/gemini-3-flash-preview",
        inputs: prompt,
        parameters: {
            max_new_tokens: 300,
            temperature: 0.2
        }
    });


    // 6. Get AI's generated text
    const generatedText = response.generated_text;

    console.log("AI response:", generatedText);


    // 7. Convert JSON string into JavaScript object
    const result = JSON.parse(generatedText);


    // 8. Return the result
    return result;
}


module.exports = structuredSearch;

