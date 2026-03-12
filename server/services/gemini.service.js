const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 

// CHANGE: Accept buffer, convert to base64
function fileToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType,
        },
    };
}

// CHANGE: First arg is now 'imageBuffer'
async function getAiPlantName(imageBuffer, mimeType) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
     const prompt = `
      Analyze the plant in this image and provide a structured response.
      1. Identify the single, most prominent plant. Provide its common or scientific name.
      2. Determine if this plant has ANY recognized medicinal, therapeutic, Ayurvedic, or traditional folk healing uses. 

       CRITICAL INSTRUCTION: Many plants used primarily for culinary, cultural, or everyday purposes (e.g., Betel leaf, Basil, Mint, Turmeric, Ginger, Garlic) 
       possess significant medicinal properties. If the plant has ANY documented health or healing benefits in ANY culture, you MUST set "isMedicinal" to true.
      
      Respond with ONLY a single JSON object using this exact format:
      {"label": "plant_name", "isMedicinal": boolean}
      
      Examples: 
      - {"label": "Neem", "isMedicinal": true} 
      - {"label": "Betel Leaf", "isMedicinal": true}
      - {"label": "Sweet Basil", "isMedicinal": true}
      - {"label": "Common Grass", "isMedicinal": false}
      
      If you are unsure or cannot identify a plant, use {"label": "Unknown", "isMedicinal": false}.
    `;
    
    // Pass buffer
    const imageParts = [fileToGenerativePart(imageBuffer, mimeType)];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();

    const jsonResponse = JSON.parse(cleanedText);
    return jsonResponse.label; // Return only the plant name string
}

module.exports = { getAiPlantName };