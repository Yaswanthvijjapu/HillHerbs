const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

async function getAiPlantName(imagePath, mimeType) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Identify the single, most prominent plant in this image. Respond with ONLY a single JSON object in the format {"label": "plant_name"}. If you are unsure or cannot identify a plant, the label should be "Unknown".`;

    const imageParts = [fileToGenerativePart(imagePath, mimeType)];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();

    const jsonResponse = JSON.parse(cleanedText);
    return jsonResponse.label; // Return only the plant name string
}

module.exports = { getAiPlantName };