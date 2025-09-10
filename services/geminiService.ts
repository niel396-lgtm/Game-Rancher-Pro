
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

export const getAIResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert wildlife biologist and ranch management consultant. Provide clear, concise, and actionable advice for game ranchers. Your tone should be professional, helpful, and supportive.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Sorry, I encountered an error. Please try again later.";
  }
};
