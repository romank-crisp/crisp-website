"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Suggests changes to JSON content based on user instructions.
 * Uses a lightweight model for cost efficiency.
 */
export async function suggestJsonUpdate(currentJson: any, userPrompt: string) {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
        return { success: false, error: "AI API key is not configured." };
    }

    if (!apiKey.startsWith("AIza")) {
        console.warn("Potential Invalid API Key: Google API Keys usually start with 'AIza'");
        // We ensure the user sees this warning if the request fails
    }

    try {
        // Use gemini-2.0-flash which is available for this API key
        const result = await generateText({
            model: google("gemini-2.0-flash"),
            messages: [
                {
                    role: "system",
                    content: `You are a specialized content editor for a JSON-based CMS. 
Your task is to modify the provided JSON object according to the user's instructions.

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no code blocks, no explanations
2. Maintain the existing structure, keys, and data types unless explicitly asked to change them
3. Only modify the values that the user requests to change
4. Preserve all formatting, arrays, nested objects exactly as they are
5. If uncertain, make conservative changes

Return the complete modified JSON object.`
                },
                {
                    role: "user",
                    content: `Current JSON:\n\`\`\`json\n${JSON.stringify(currentJson, null, 2)}\n\`\`\`\n\nUser request: ${userPrompt}\n\nReturn only the modified JSON object:`
                }
            ],
        });

        // Parse the response as JSON
        const responseText = result.text.trim();

        // Remove markdown code blocks if present
        let jsonText = responseText;
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        const parsedJson = JSON.parse(jsonText);

        return { success: true, data: parsedJson };
    } catch (error: any) {
        console.error("AI Error Details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));

        if (error instanceof SyntaxError) {
            return { success: false, error: "AI returned invalid JSON. Please try rephrasing your request." };
        }

        // Return actual error message for debugging
        return { success: false, error: `AI Request Failed: ${error.message || "Unknown error"}` };
    }
}
