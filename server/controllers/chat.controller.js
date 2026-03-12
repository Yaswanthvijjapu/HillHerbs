const { GoogleGenerativeAI } = require("@google/generative-ai");
const PlantSubmission = require('../models/plantSubmission.model');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askChatBot = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Fetch verified plants to give the AI "Context"
        const plants = await PlantSubmission.find({ status: 'verified' })
            .select('finalPlantName medicinalUses importance'); // Removed location to save tokens as it's rarely needed for general chat

        // 2. Create a "System Prompt" with your data
        const plantContext = plants.length > 0 
            ? plants.map(p => `- ${p.finalPlantName}: Uses: ${p.medicinalUses}. Notes: ${p.importance}.`).join('\n')
            : "No plants are currently verified in the database.";

        // --- UPDATED PROMPT ---
        const prompt = `
            You are "Herbie", the AI assistant for the HillHerbs application. You are an expert in Botany, Ayurveda, and traditional herbal medicine.
            
            Here is the list of verified medicinal plants currently in our local HillHerbs database:
            ${plantContext}

            User Question: "${message}"

            Instructions:
            1. Database First: If the user's question can be answered using the HillHerbs database provided above, recommend those plants first and mention they are "verified locally by our experts".
            2. External Knowledge & Google Search: If the database does NOT contain a relevant plant for their ailment, or if they ask about a specific external plant/health care issue:
               - Use your extensive medical/botanical knowledge and Google Search to provide highly accurate remedies.
               - Mention documentation or traditional texts (e.g., Ayurvedic Pharmacopoeia) if relevant.
               - Explicitly state: "While we don't have a verified plant for this in our local HillHerbs database yet, generally speaking..." or "This plant is not in our database, but..."
            3. Safety Warning: For any health remedy, ALWAYS include a brief disclaimer at the end stating: "Disclaimer: I am an AI assistant. Please consult a qualified healthcare professional before trying new herbal remedies."
            4. Tone: Keep answers concise, empathetic, and formatted nicely (use bullet points if listing remedies).
        `;

        // 3. Call Gemini with Google Search Tool Enabled
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            // --- NEW: ENABLE GOOGLE SEARCH GROUNDING ---
            tools:[
                {
                    googleSearch: {} 
                }
            ]
        });
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.status(200).json({ reply: responseText });

    } catch (error) {
        console.error("ChatBot Error:", error);
        res.status(500).json({ reply: "I'm having trouble connecting to the herbal archives right now. Please try again later." });
    }
};