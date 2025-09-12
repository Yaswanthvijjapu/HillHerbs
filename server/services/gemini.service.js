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
     const prompt = `
      Analyze the plant in this image and provide a structured response.
      1. Identify the single, most prominent plant.
      2. Determine if this plant is commonly known to have medicinal uses.
      
      Respond with ONLY a single JSON object using this exact format:
      {"label": "plant_name", "isMedicinal": boolean}
      
      For example: {"label": "Neem", "isMedicinal": true} or {"label": "Common Rose", "isMedicinal": false}.
      
      If you are unsure or cannot identify a plant, use {"label": "Unknown", "isMedicinal": false}.
    `;
    
    const imageParts = [fileToGenerativePart(imagePath, mimeType)];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();

    const jsonResponse = JSON.parse(cleanedText);
    return jsonResponse.label; // Return only the plant name string
}

module.exports = { getAiPlantName };