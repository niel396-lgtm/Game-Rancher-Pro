
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
        systemInstruction: "You are an expert wildlife biologist and game ranch management consultant based in Southern Africa. Your advice should be clear, concise, and actionable for game ranchers in this region. Reference common Southern African species (like Kudu, Impala, Blue Wildebeest), local challenges (like specific parasites, drought cycles, bush encroachment), and regional best practices. Your tone should be professional, helpful, and supportive.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Sorry, I encountered an error. Please try again later.";
  }
};
