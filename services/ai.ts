
import { GoogleGenAI, Type } from "@google/genai";

// Use directly from process.env.API_KEY as per the rules
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Module 5: AI Sentiment & Multi-Step Logic
 */
export async function analyzeSentimentAndDraft(emailBody: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', // Fast for sentiment
    contents: `Analyze the following lead response.
    Lead Response: "${emailBody}"
    
    Task:
    1. Categorize: 'Positive', 'Negative', 'OOO', 'Unsubscribe', or 'Needs Human'.
    2. Sentiment Score: 0-100 (where 100 is highly enthusiastic).
    3. Generate a Draft Reply that:
       - Acknowledges their specific point if possible.
       - Proposes a short 15min call next week.
       - Maintains a professional, non-salesy tone.
    4. Return strictly in JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: { type: Type.STRING },
          score: { type: Type.NUMBER },
          draft: { type: Type.STRING },
          keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["sentiment", "score", "draft"]
      }
    }
  });

  try {
    // Correctly accessing the text property on GenerateContentResponse
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { sentiment: 'Needs Human', score: 50, draft: null };
  }
}

/**
 * Advanced: Generate a 3-step sequence based on a business pitch
 */
export async function generateSequence(pitch: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // More creative for copywriting
    contents: `Create a 3-step high-converting cold email sequence for this pitch: "${pitch}"
    
    Requirements:
    - Each email must include Spintax (e.g., {Hi|Hello}) for maximum variation.
    - Step 1: Hook & Value Prop.
    - Step 2: The "Bump" (3 days later).
    - Step 3: The "Break-up" (7 days later).
    
    Return as a JSON list of objects with 'subject' and 'body'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            step: { type: Type.NUMBER },
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
          }
        }
      }
    }
  });

  // Correctly accessing the text property on GenerateContentResponse
  return JSON.parse(response.text || '[]');
}
