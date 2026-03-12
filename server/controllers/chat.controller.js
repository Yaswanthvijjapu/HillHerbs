const { GoogleGenerativeAI } = require("@google/generative-ai");
const PlantSubmission = require('../models/plantSubmission.model');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askChatBot = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Fetch verified plants to give the AI "Context"
        const plants = await PlantSubmission.find({ status: 'verified' })
            .select('finalPlantName medicinalUses importance'); 

        // 2. Create a "System Prompt" with your data
        const plantContext = plants.length > 0 
            ? plants.map(p => `- ${p.finalPlantName}: Uses: ${p.medicinalUses}. Notes: ${p.importance}.`).join('\n')
            : "No plants are currently verified in the database.";

        // --- UPDATED PROMPT FOR SHORT ANSWERS ---
        const prompt = `
            You are "Herbie", the AI assistant for the HillHerbs application. You are an expert in Botany, Ayurveda, and traditional herbal medicine.
            
            Here is the list of verified medicinal plants currently in our local HillHerbs database:
            ${plantContext}

            User Question: "${message}"

            Instructions:
            1. Database First: If the user's question can be answered using the HillHerbs database provided above, recommend those plants first and mention they are "verified locally by our experts".
            2. External Knowledge & Google Search: If the database does NOT contain a relevant plant for their ailment, or if they ask about a specific external plant/health care issue:
               - Use your extensive medical/botanical knowledge and Google Search to provide highly accurate remedies.
               - Explicitly state: "While we don't have a verified plant for this in our local HillHerbs database yet..."
            3. Safety Warning: For any health remedy, ALWAYS include a brief disclaimer at the end stating: "Disclaimer: Consult a doctor before trying new herbal remedies."
            4. FORMAT AND LENGTH (CRITICAL): Keep your answer VERY BRIEF. You MUST provide your answer in exactly 4 to 5 short bullet points. Do NOT write long paragraphs or lengthy explanations. Just give the direct points.
        `;

        // 3. Call Gemini with Google Search Tool Enabled
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
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