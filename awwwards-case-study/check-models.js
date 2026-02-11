const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config({ path: '.env' });

async function listModels() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        console.error("API Key not found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // The SDK doesn't have a direct "listModels" method exposed easily in the high level helper sometimes, 
        // but we can try to hit the REST endpoint or just test a few common ones.
        // Actually, let's try to just run a simple generation with a few candidate names to see which one works.

        // Better yet, let's try to use the raw API to list models if possible, 
        // or just test the specific ones we want to use.

        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-pro"
        ];

        console.log("Testing model availability...");

        for (const modelName of candidates) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`✅ ${modelName} is AVAILABLE`);
            } catch (error) {
                console.log(`❌ ${modelName} is NOT available: ${error.message.split(' ')[0]}...`);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
