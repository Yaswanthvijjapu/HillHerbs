const { GoogleGenerativeAI } = require("@google/generative-ai");
const PlantSubmission = require('../models/plantSubmission.model');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askChatBot = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Fetch verified plants to give the AI "Context"
        // We only fetch fields relevant to answering questions to save token space
        const plants = await PlantSubmission.find({ status: 'verified' })
            .select('finalPlantName medicinalUses importance location');

        // 2. Create a "System Prompt" with your data
        const plantContext = plants.map(p => 
            `- ${p.finalPlantName}: Uses: ${p.medicinalUses}. Notes: ${p.importance}. Found at Lat: ${p.location.coordinates[1]}`
        ).join('\n');

        const prompt = `
            You are "Herbie", the AI assistant for the HillHerbs application.
            
            Here is the list of verified medicinal plants currently in our database:
            ${plantContext}

            User Question: "${message}"

            Instructions:
            1. Answer based STRICTLY on the provided database if possible.
            2. If the user asks about a plant NOT in the list, provide general Ayurvedic knowledge but explicitly state: "This plant is not yet verified in our specific HillHerbs database, but generally..."
            3. Keep answers concise, friendly, and helpful.
            4. Do not provide raw JSON or coordinates unless specifically asked.
        `;

        // 3. Call Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.status(200).json({ reply: responseText });

    } catch (error) {
        console.error("ChatBot Error:", error);
        res.status(500).json({ reply: "I'm having trouble connecting to the herbal archives right now. Please try again later." });
    }
};