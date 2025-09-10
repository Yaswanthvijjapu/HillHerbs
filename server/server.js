const express = require("express");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Google AI

const app = express();
const upload = multer({ dest: "uploads/" });

// --- NEW: Initialize Google AI ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Helper function to convert file to Google's format
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

app.post("/identify", upload.single("image"), async (req, res) => {
  const imagePath = req.file ? req.file.path : null;
  try {
    if (!imagePath) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    // Initialize the CORRECT model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
      Identify the plant in this image. 
      Respond with ONLY a single JSON object in the format {"label": "plant_name"}.
      If you are unsure or cannot identify a plant, the label should be "Unknown".
    `;

    const imageParts = [
      fileToGenerativePart(imagePath, req.file.mimetype),
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // It's safer to remove potential markdown code fences from the AI's response
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();

    const jsonResponse = JSON.parse(cleanedText);

    res.json(jsonResponse);

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Plant identification failed" });
  } finally {
    if (imagePath) {
      fs.unlinkSync(imagePath);
    }
  }
});

app.listen(5000, () => console.log("✅ FloraSense running at http://localhost:5000"));